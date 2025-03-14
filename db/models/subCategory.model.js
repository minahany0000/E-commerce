import mongoose, { Types } from "mongoose";

const subCategorySchema = new mongoose.Schema(
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
        categoryId: {
            type: Types.ObjectId,
            ref: "Category",
            required: true
        },
        customId: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);
export default subCategoryModel
