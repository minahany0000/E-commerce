import couponModel from "../../../db/models/coupon.model.js";
import orderModel from "../../../db/models/order.model.js";
import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";
import appError from "../../utils/appError.js";
import { createInvoice } from "../../services/invoice.js";
import sendEmail from "../../services/sendEmail.js";
import { payment } from "../../utils/payment.js";
import Stripe from "stripe";
import userModel from "../../../db/models/user.model.js";

const stripe = new Stripe(process.env.SECRET_KEY_STRIPE);

export const createOrder = async (req, res, next) => {
    try {
        const { productId, quantity, couponCode, address, phone, paymentMethod, city, street, state } = req.body;

        // Validate the payment method
        if (!["cash", "card"].includes(paymentMethod)) {
            return next(new appError("Invalid payment method", 400));
        }

        let discount = 0;

        // Handle coupon validation
        const coupon = await couponModel.findOne({ code: couponCode });

        if (couponCode) {
            if (!coupon || coupon.toDate < Date.now()) {
                return next(new appError("Invalid or expired coupon", 400));
            }

            if (coupon.usedBy.includes(req.user._id)) {
                return next(new appError("You have already used this coupon", 400));
            }

            discount = coupon.amount;
        }


        let products = [];
        let isCartOrder = false;

        if (productId) {
            // Validate that product exists and has enough stock
            const product = await productModel.findOne({ _id: productId, stock: { $gte: quantity } });
            if (!product) {
                return next(new appError("Product does not exist or is out of stock", 404));
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
                product = product.toObject();
            }

            // Ensure each product exists and has enough stock
            const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } });
            if (!checkProduct) {
                return next(new appError(`Product ${product.productId} does not exist or is out of stock`, 404));
            }

            // Add product details to order
            product.title = checkProduct.title;
            product.price = checkProduct.price;
            product.finalPrice = checkProduct.finalPrice;
            subPrice += checkProduct.finalPrice * product.quantity;
            finalProducts.push(product);

        }

        // Calculate total price after applying the coupon discount
        const totalPrice = subPrice - (subPrice * (discount / 100));

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

        let Order
        if (isCartOrder) {
            Order = await cartModel.findOneAndUpdate({ userId: req.user._id }, { $set: { products: [] } }, { new: true });
        }
        if (paymentMethod == "cash") {
            const invoice = {
                name: req.user.name,
                address,
                items: finalProducts,
                totalPrice,
                paid: 0,
                city,
                street,
                state
            };
            createInvoice(invoice, "invoice.pdf");
            await sendEmail(req.user.email, "invoice", "", "invoice.pdf");
        }


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

                req.body.couponId = coupon.id
            }

            const session = await payment({
                payment_method_types: ["card"],
                mode: "payment",
                customer_email: req.user.email,
                metadata: {
                    orderId: order._id.toString()
                },
                success_url: `https://e-commerce-rust-ten-99.vercel.app//order/successPayment/${order._id}`,
                cancel_url: `https://e-commerce-rust-ten-99.vercel.app//order/cancel/${order._id}`,
                line_items: order.products.map((product) => ({
                    price_data: {
                        currency: "egp",
                        product_data: { name: product.title },
                        unit_amount: Math.round(product.finalPrice * 100)
                    },
                    quantity: product.quantity
                })),
                discounts: req.body?.couponId ? [{ coupon: req.body.couponId }] : []
            });
            await orderModel.findByIdAndUpdate(order._id, { status: "waitPayment" })
            return res.status(201).json({ msg: "Order placed successfully Please pay  ", url: session.url, session });
        }



        res.status(201).json({ msg: "Order placed successfully", order });
    } catch (error) {
        next(new appError(error.message || "Something went wrong", 500)); // ✅ Improved error handling
    }
};


export const successPayment = async (req, res, next) => {
    const { orderId } = req.params

    const orderExist = await orderModel.findByIdAndUpdate(orderId, { status: "placed" });
    if (!orderExist) {
        return next(new appError("Order not exist"))

    }
    // if(orderExist.status == "placed"){
    //     return next(new appError("Payment done"))
    // }

    const order = await orderModel.findById(orderId).populate("userId");

    const invoice = {
        name: order.userId.name,
        address: order.address,
        items: order.products,
        totalPrice: order.totalPrice,
        paid: order.totalPrice,
        city: order.userId.address.city,
        street: order.userId.address.street,
        state: order.userId.address.state
    };
    createInvoice(invoice, "invoice.pdf");
    await sendEmail(order.userId.email, "invoice", "", "invoice.pdf");

    res.status(201).json({ msg: "Payment done succefully check your email for the invoice" });

}


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

export const webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.SIGNING_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send('Webhook Error');
    }

    const { orderId } = event.data.object.metadata

    if (event.type === 'checkout.session.completed') {
        await orderModel.findOneAndUpdate({ _id: orderId }, { status: "placed" })
        res.status(200).json({ msg: "done" });
    } else {
        await orderModel.findOneAndUpdate({ _id: orderId }, { status: "rejected" })
        res.status(400).json({ msg: "fail" });
    }

}