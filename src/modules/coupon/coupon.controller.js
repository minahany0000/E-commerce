import couponModel from "../../../db/models/coupon.model.js"
import appError from "../../utils/appError.js"






export const createCoupon = async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body
    const couponExist = await couponModel.findOne({ code })
    if (couponExist) {
        return next(new appError("coupon exist", 409))
    }
    const Coupon = await couponModel.create({
        code,
        amount,
        fromDate,
        toDate,
        createdBy: req.user._id
    })



    res.status(201).json({ msg: "created", Coupon })
}

export const updateCoupon = async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body
    const { id } = req.params
    const Coupon = await couponModel.findOne({ _id: id, createdBy: req.user._id })
    if (!Coupon)
        return next(new appError("coupon is not exist", 409))

    if (code) {
        const codeExist = await couponModel.findOne({ code })
        if (!codeExist) {
            Coupon.code = code
        }
    }
    if (amount) {
        Coupon.amount = amount
    }
    if (fromDate) {
        Coupon.fromDate = fromDate
    }
    if (toDate) {
        Coupon.toDate = toDate
    }
    Coupon.save()
    res.status(201).json({ msg: "Updated", Coupon })
}
