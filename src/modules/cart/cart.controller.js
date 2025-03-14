import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";
import appError from "../../utils/appError.js";

export const createCart = async (req, res, next) => {
    let cartExist = await cartModel.findOne({ userId: req.user._id });

    let newProducts = [];

    for (const product of req.body.products) {
        const productExist = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity } // Ensures enough stock
        });

        if (!productExist) {
            return next(new appError(`Product with ID ${product.productId} does not exist or does not have enough stock.`));
        }

        newProducts.push({
            productId: product.productId,
            quantity: product.quantity
        });
    }

    if (!cartExist) {
        // If no cart exists, create a new one
        cartExist = await cartModel.create({
            userId: req.user._id,
            products: newProducts
        });

        return res.status(201).json({ msg: "Cart created", cart: cartExist });
    }

    for (const newProduct of newProducts) {
        const existingProduct = cartExist.products.find(p => p.productId.toString() === newProduct.productId);

        if (existingProduct) {
            existingProduct.quantity += newProduct.quantity;
        } else {
            cartExist.products.push(newProduct);
        }
    }

    await cartExist.save();

    return res.status(201).json({ msg: "Cart updated", cart: cartExist });


};
