import mongoose, { Types } from "mongoose";

const orderSchema = new mongoose.Schema(
    {

        userId: {
            type: Types.ObjectId,
            ref: "user",
            required: true
        },
        products: [{
            title: { type: String, required: true },
            productId: { type: Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            finalPrice: { type: Number, required: true },
        }],
        subPrice: { type: Number, required: true },
        couponCode: { type: String },
        totalPrice: { type: Number, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        paymentMethod: { type: String, required: true, enum: ["card", "cash"] },
        status: { type: String, required: true, enum: ["placed", "waitPayment", "delivered", "onWay", "cancelled" , "rejected"], default: "placed" },
        reason: { type: String },

    },
    {
        timestamps: true,
        versionKey: false
    }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel
