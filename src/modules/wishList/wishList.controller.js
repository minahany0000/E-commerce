import wishListModel from "../../../db/models/wishList.model.js";
import productModel from "../../../db/models/product.model.js";
import appError from "../../utils/appError.js";

export const add = async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new appError("product is not exist", 404))
    }
    const wishList = await wishListModel.findOne({ userId: req.user._id })
    if (!wishList) {
        const newWishList = await wishListModel.create({
            userId: req.user._id,
            products: [{ productId }]
        })
        return res.status(200).json({ msg: "done", wishList: newWishList })
    }

    if (wishList.products.includes(productId)) {
        return next(new appError("Product is already in wishlist"))
    }
    await wishListModel.updateOne({ userId: req.user._id },
        { $addToSet: { products: { productId } } },
        { new: true }
    )
    return res.status(200).json({ msg: "done" })

}

// export const remove = async (req, res, next) => {
//     const { id } = req.params
//     const product = await productModel.findById(id)
//     if(!product){
//         return next(new app)
//     }
// }