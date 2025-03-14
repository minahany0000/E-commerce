import mongoose, { Types } from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "code is required"],
            minLength: 3,
            maxLength: 30,
            trim: true,
            unique: true,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
            max: 100
        },
        usedBy: [{
            type: Types.ObjectId,
            ref: "User",
        }],
        fromDate: {
            type: Date,
            required: true
        },
        toDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const couponModel = mongoose.model("Coupon", couponSchema);
export default couponModel
