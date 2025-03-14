import mongoose, { Types } from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, "comment is required"],
            minLength: 3,
            maxLength: 30,
            trim: true,
        },
        rate: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        createdBy: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        productId: {
            type: Types.ObjectId,
            ref: "product",
            required: true,
        },
        orderId: {
            type: Types.ObjectId,
            ref: "order",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const reviewModel = mongoose.model("review", reviewSchema);
export default reviewModel
