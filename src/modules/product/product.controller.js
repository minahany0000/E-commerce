import slugify from "slugify"
import brandModel from "../../../db/models/brand.model.js"
import categoryModel from "../../../db/models/category.model.js"
import productModel from "../../../db/models/product.model.js"
import subCategoryModel from "../../../db/models/subCategory.model.js"
import appError from "../../utils/appError.js"
import cloudinary from "../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import { ApiFeatures } from "../../utils/apiFeatures.js"

export const createProduct = async (req, res, next) => {
    const { title, description, categoryId, subCategoryId, brandId, price, discount, stock } = req.body

    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new appError("Category not exists", 404))
    }
    const subCategory = await subCategoryModel.findById(subCategoryId)
    if (!subCategory) {
        return next(new appError("subCategory not exists", 404))
    }
    if (subCategory.categoryId.toString() !== category._id.toString()) {
        return next(new appError("There is no this subCategory for this category", 404));
    }

    const brand = await brandModel.findById(brandId)
    if (!brand) {
        return next(new appError("brand not exists", 404))
    }

    if (!req.files) {
        return next(new appError("image is required", 404))
    }

    let subPrice = 0
    subPrice = ((100 - discount) / 100) * price * 1.0;


    const customId = nanoid(5)
    let coverImages = []
    for (const file of req.files.images) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `EcommerceMedia/categories/${category.customId}/subCategory/${subCategory.customId}/products/${customId}`
        })
        coverImages.push({ secure_url, public_id })
    }

    const { secure_url, public_id } = req.files.image[0]




    const product = await productModel.create({
        title,
        slug: slugify(title, { replacement: "_" }),
        description,
        createdBy: req.user._id,
        categoryId,
        subCategoryId,
        brandId,
        image: { secure_url, public_id },
        coverImages,
        price,
        discount,
        stock,
        subPrice
    })
    return res.status(201).json({ msg: "done", product })

}

export const getProducts = async (req, res, next) => {


    const apiFeatures = new ApiFeatures(productModel.find(), req.query)
        .pagination()
        .filter()
        .sort()
        .select()
        .search()

    const products = await apiFeatures.query

    return res.status(200).json({ msg: "done", page: apiFeatures.page, products })
}
