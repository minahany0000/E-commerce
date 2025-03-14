import orderModel from "../../../db/models/order.model.js"
import productModel from "../../../db/models/product.model.js"
import reviewModel from "../../../db/models/review.model.js"
import appError from "../../utils/appError.js"






export const createReview = async (req, res, next) => {
    const { comment, rate } = req.body
    const { productId } = req.params
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new appError("Product not found", 404))
    }
    const reviewE = await reviewModel.findOne({ createdBy: req.user._id })
    // add here update review
    if (reviewE) {
        return next(new appError("Review already exist", 404))
    }
    const order = await orderModel.findOne({
        userId: req.user._id,
        "products.productId": productId,
        status: "delivered"
    })
    if (!order) {
        return next(new appError("You can only review your own orders.", 404));
    }
    const review = await reviewModel.create({
        createdBy: req.user._id,
        comment,
        rate,
        productId,
        orderId: order._id

    })
    product.rateAvg = ((product.rateAvg * product.rateNum) + rate) / (product.rateNum * 1.0 + 1)
    product.rateNum += 1
    product.save()
    res.status(201).json({ msg: "created", review })
}
export const deleteReview = async (req, res, next) => {
    const reviewE = await reviewModel.findOne({ createdBy: req.user._id })
    if (!reviewE) {
        return next(new appError("Review already deleted", 404))
    }

    const review = await reviewModel.findByIdAndDelete(reviewE._id)


    const product = await productModel.findOne(reviewE.productId)

    if (product.rateNum === 1) {
        product.rateAvg = 0;
    } else {
        product.rateAvg = ((product.rateAvg * product.rateNum) - reviewE.rate) / (product.rateNum - 1);
    }
    product.rateNum -= 1;

    product.save()
    res.status(201).json({ msg: "deleted" })
}

