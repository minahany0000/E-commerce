import mongoose, { Types } from "mongoose";




const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "name is required"],
            minLength: 3,
            maxLength: 50,
            trim: true,
        },
        slug: {
            type: String,
            minLength: 3,
            maxLength: 50,
            trim: true,
        },
        description: {
            type: String,
            minLength: 3,
            trim: true,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        categoryId: {
            type: Types.ObjectId,
            ref: "Category",
            required: true
        },
        subCategoryId: {
            type: Types.ObjectId,
            ref: "SubCategory",
            required: true
        },
        brandId: {
            type: Types.ObjectId,
            ref: "Brand",
            required: true
        },
        image: {
            secure_url: String,
            public_id: String
        },
        coverImages: [{
            secure_url: String,
            public_id: String
        }],
        price: {
            type: Number,
            required: true,
            min: 1
        },
        discount: {
            type: Number,
            default: 1,
            min: 1,
            max: 100
        },
        subPrice: {
            type: Number,
            default: 1,
            min: 1,
        },
        stock: {
            type: Number,
            required: 1
        },
        rateAvg: {
            type: Number,
            default: 0
        },
        rateNum: {
            type: Number,
            default: 0
        },

        customId: String
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


productSchema.virtual("finalPrice").get(function () {
    return this.price - (this.price * (this.discount / 100));
});

/** 🔹 Ensure `finalPrice` is always included when querying */
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });


const productModel = mongoose.model("product", productSchema);
export default productModel
