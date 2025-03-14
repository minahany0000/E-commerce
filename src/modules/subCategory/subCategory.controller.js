import { nanoid } from "nanoid"
import subCategoryModel from "../../../db/models/subCategory.model.js"
import appError from "../../utils/appError.js"
import categoryModel from "../../../db/models/category.model.js"
import cloudinary from "../../utils/cloudinary.js"
import slugify from "slugify"




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
        return next(new appError("Category not exist", 409))
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

    const subCategory = await subCategoryModel.find({})

    res.status(200).json({ msg: "created", subCategory })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const getCategorySubCatigories = async (req, res, next) => {

    const subCategory = await subCategoryModel.find({}).populate([
        {
            path: "createdBy"
        },
        {
            path: "categoryId"
        }])

    res.status(200).json({ msg: "created", subCategory })
}
