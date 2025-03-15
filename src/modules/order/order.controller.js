import couponModel from "../../../db/models/coupon.model.js";
import orderModel from "../../../db/models/order.model.js";
import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";
import appError from "../../utils/appError.js";
import { createInvoice } from "../../services/invoice.js";
import sendEmail from "../../services/sendEmail.js";
import { payment } from "../../utils/payment.js";
import Stripe from "stripe";

export const createOrder = async (req, res, next) => {
    try {
        const { productId, quantity, couponCode, address, phone, paymentMethod, city, street, state } = req.body;

        // Validate the payment method
        if (!["cash", "card"].includes(paymentMethod)) { // ✅ Added validation for payment method
            return next(new appError("Invalid payment method", 400));
        }

        let discount = 0; // ✅ Added to store discount percentage if a coupon is applied

        // Handle coupon validation
        const coupon = await couponModel.findOne({ code: couponCode });

        if (couponCode) {
            if (!coupon || coupon.toDate < Date.now()) {
                return next(new appError("Invalid or expired coupon", 400)); // ✅ Improved error message
            }

            // ✅ Check if the user has already used this coupon
            if (coupon.usedBy.includes(req.user._id)) {
                return next(new appError("You have already used this coupon", 400));
            }

            discount = coupon.amount; // ✅ Extract discount amount from the coupon
        }


        let products = [];
        let isCartOrder = false; // ✅ Changed variable name to be more meaningful

        if (productId) {
            // Validate that product exists and has enough stock
            const product = await productModel.findOne({ _id: productId, stock: { $gte: quantity } });
            if (!product) {
                return next(new appError("Product does not exist or is out of stock", 404)); // ✅ Improved error message
            }
            products = [{ productId, quantity }];
        } else {
            // Fetch cart products for the user
            const cart = await cartModel.findOne({ userId: req.user._id });
            if (!cart || cart.products.length === 0) { // ✅ Added check for empty cart
                return next(new appError("Your cart is empty", 400));
            }
            products = cart.products;
            isCartOrder = true;
        }

        let finalProducts = [];
        let subPrice = 0;
        for (let product of products) {
            if (isCartOrder) {
                product = product.toObject(); // ✅ Convert BSON to plain object when dealing with cart items
            }

            // Ensure each product exists and has enough stock
            const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } });
            if (!checkProduct) {
                return next(new appError(`Product ${product.productId} does not exist or is out of stock`, 404)); // ✅ More informative error message
            }

            // Add product details to order
            product.title = checkProduct.title;
            product.price = checkProduct.price;
            product.finalPrice = checkProduct.finalPrice;
            subPrice += checkProduct.finalPrice * product.quantity; // ✅ Fixed calculation to consider quantity        
            finalProducts.push(product);

        }

        // Calculate total price after applying the coupon discount
        const totalPrice = subPrice - (subPrice * (discount / 100)); // ✅ Fixed the discount calculation

        // Create order
        const order = await orderModel.create({
            userId: req.user._id,
            products: finalProducts,
            subPrice,
            couponCode,
            totalPrice,
            paymentMethod,
            status: "placed",
            phone,
            address
        });

        if (couponCode) {
            coupon.usedBy.push(req.user._id);
            await coupon.save();
        }

        for (const product of finalProducts) {
            await productModel.updateOne(
                { _id: product.productId },
                { $inc: { stock: -product.quantity } }
            );
        }

        // ✅ Clear the cart if the order was placed from it
        let Order
        if (isCartOrder) {
            Order = await cartModel.findOneAndUpdate({ userId: req.user._id }, { $set: { products: [] } }, { new: true });
        }
        // const invoice = {
        //     name: req.user.name,
        //     address,
        //     items: finalProducts,
        //     totalPrice,
        //     paid: 0,
        //     city,
        //     street,
        //     state
        // };
        // createInvoice(invoice, "invoice.pdf");
        // await sendEmail(req.user.email, "invoice", "", "invoice.pdf");



        if (paymentMethod == "card") {
            const stripe = new Stripe(process.env.SECRET_KEY_STRIPE)
            if (!order.products || order.products.length === 0) {
                return res.status(400).json({ msg: "Order has no products" });
            }
            if (req.body?.couponCode) {
                const coupon = await stripe.coupons.create({
                    percent_off: discount,
                    duration: "once"
                })
                console.log(coupon);

                req.body.couponId = coupon.id
            }

            const session = await payment({
                payment_method_types: ["card"],
                mode: "payment",
                customer_email: req.user.email,
                metadata: {
                    orderId: order._id.toString()
                },
                success_url: `${req.protocol}://${req.headers.host}/orders/success/${order._id}`,
                cancel_url: `${req.protocol}://${req.headers.host}/orders/cancel/${order._id}`,
                line_items: order.products.map((product) => ({
                    price_data: {
                        currency: "egp",
                        product_data: { name: product.title },
                        unit_amount: Math.round(product.price * 100) // Ensure integer value
                    },
                    quantity: product.quantity
                })),
                discounts: req.body?.couponId ? [{ coupon: req.body.couponId }] : []
            });

            return res.status(201).json({ msg: "Order placed successfully", url: session.url, session });
        }



        res.status(201).json({ msg: "Order placed successfully", order });
    } catch (error) {
        next(new appError(error.message || "Something went wrong", 500)); // ✅ Improved error handling
    }
};
export const cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const { reason } = req.body
        const order = await orderModel.findOne({ _id: id, userId: req.user._id })
        if (!order || order.status === "cancelled") {
            return next(new appError("Order not found", 404));
        }
        if ((order.paymentMethod === "cash" && order.status !== "placed")
            || (order.paymentMethod === "card" && order.status !== "waitPayment")) {
            return next(new appError("Order can not be canceled", 404));
        }
        await orderModel.findByIdAndUpdate(id, {
            status: "cancelled",
            reason

        })

        await couponModel.updateOne({ code: order.couponCode }, {
            $pull: { usedBy: req.user._id },

        })
        for (const product of order.products) {
            await productModel.updateOne(
                { _id: product.productId },
                { $inc: { stock: product.quantity } } // ✅ Decrease stock
            );
        }

        return res.status(200).json({ msg: "Done order deleted" })


    } catch (error) {
        return next(new appError(error.message || "Something went wrong", 500)); // ✅ Improved error handling
    }
};
