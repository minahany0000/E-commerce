import mongoose, { Types } from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
            minLength: 3,
            maxLength: 20,
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            minLength: 3,
            maxLength: 20,
            trim: true,
            unique: true,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        image: {
            secure_url: String,
            public_id: String
        },
        customId: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel
