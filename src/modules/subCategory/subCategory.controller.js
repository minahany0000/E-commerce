import { nanoid } from "nanoid"
import subCategoryModel from "../../../db/models/subCategory.model.js"
import appError from "../../utils/appError.js"
import categoryModel from "../../../db/models/category.model.js"
import cloudinary from "../../utils/cloudinary.js"
import slugify from "slugify"
import { ApiFeatures } from "../../utils/apiFeatures.js"


/*
createSubCategory by only admin
*/
export const createSubCategory = async (req, res, next) => {
    const { name } = req.body
    const { categoryId } = req.params
    const subCategoryExist = await subCategoryModel.findOne({ name })
    const category = await categoryModel.findById(categoryId)
    if (subCategoryExist) {
        return next(new appError("subCategory exist", 409))
    }
    if (!category) {
        return next(new appError("Category not exist", 400))
    }
    if (!req.file) {
        return next(new appError("Image is required", 400))
    }
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `EcommerceMedia/categories/${category.customId}/subCategory/${customId}`
    })

    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name, {
            replacement: "_",
            lower: true
        }),
        image: {
            secure_url,
            public_id
        },
        createdBy: req.user._id,
        categoryId,
        customId
    })

    res.status(201).json({ msg: "created", subCategory })
}
/*
getSubCategories by all
*/
export const getSubCategories = async (req, res, next) => {
    const apiFeatures = new ApiFeatures(subCategoryModel.find(), req.query)
        .filter()
        .pagination()
        .search()
        .sort()
        .select()
    const subCategories = await apiFeatures.query
    res.status(200).json({ msg: "Done", page: apiFeatures.page, subCategories })
}


export const getCategoryById = async (req, res, next) => {

    const { categoryId } = req.params
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new appError("Category not found", 404))
    }
    const apiFeatures = new ApiFeatures(subCategoryModel.find({ categoryId }), req.query)
        .filter()
        .pagination()
        .search()
        .sort()
        .select()

    const subCategories = await apiFeatures.query
    res.status(200).json({ msg: "Done", page: apiFeatures.page, subCategories })
}
export const deleteSubCategory = async (req, res, next) => {

    const { categoryId, subCategoryId } = req.params
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new appError("Category not found", 404))
    }
    const subCategory = await subCategoryModel.findByIdAndDelete(subCategoryId)
    if (!subCategory) {
        return next(new appError("subCategory not found", 404))
    }
    await subCategoryModel.deleteOne({ _id: subCategoryId })
    await cloudinary.api.delete_resources_by_prefix(`EcommerceMedia/categories/${category.customId}/subCategory/${subCategory.customId}`)
    await cloudinary.api.delete_folder(`EcommerceMedia/categories/${category.customId}/subCategory/${subCategory.customId}`)
    return res.status(200).json({ msg: "done", category })
}
