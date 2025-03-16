import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";
import appError from "../../utils/appError.js";

export const createCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const productIds = req.body.products.map(p => p.productId);

        // Fetch all products at once
        const products = await productModel.find({ _id: { $in: productIds } });

        // Convert products to a Map for quick lookup
        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        let newProducts = [];
        let invalidProducts = [];

        // Validate all products
        for (const product of req.body.products) {
            const productExist = productMap.get(product.productId);

            if (!productExist || productExist.stock < product.quantity) {
                invalidProducts.push(product.productId);
            } else {
                newProducts.push({
                    productId: product.productId,
                    quantity: product.quantity
                });
            }
        }

        // Return error if any products are invalid
        if (invalidProducts.length > 0) {
            return next(new appError(`These products do not exist or have insufficient stock: ${invalidProducts.join(", ")}`));
        }

        // Check if cart exists
        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            // Create new cart if it doesn't exist
            cart = await cartModel.create({ userId, products: newProducts });
            return res.status(201).json({ msg: "Cart created", cart });
        }

        // Update existing cart
        for (const newProduct of newProducts) {
            const existingProduct = cart.products.find(p => p.productId.toString() === newProduct.productId);

            if (existingProduct) {
                existingProduct.quantity += newProduct.quantity;
            } else {
                cart.products.push(newProduct);
            }
        }

        await cart.save();
        return res.status(200).json({ msg: "Cart updated", cart });

    } catch (error) {
        next(error);
    }
};

    export const removeFromCart = async (req, res, next) => {
        try {
            const userId = req.user._id
            const {productId} = req.params
            const cart = await cartModel.findOneAndUpdate(
                { userId },
                { $pull: { products: { productId } } }, // Removes the product from the array
                { new: true } // Returns the updated cart
            );
            if (!cart) {
                return next(new appError("Cart not found or product does not exist in the cart.", 404));
            }
    
            return res.status(200).json({ msg: "Product removed from cart", cart });
        } catch (error) {
            next(error);
        }
    };

