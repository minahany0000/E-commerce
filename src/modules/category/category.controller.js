import categoryModel from "../../../db/models/category.model.js"
import appError from "../../utils/appError.js"
import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import subCategoryModel from "../../../db/models/subCategory.model.js";


export const createCategory = async (req, res, next) => {
    const { name } = req.body
    const categoryExist = await categoryModel.findOne({ name })
    if (categoryExist) {
        return next(new appError("category exist", 409))
    }
    if (!req.file) {
        return next(new appError("Image is required", 400))
    }
    const customId = nanoid(5)
    req.filePath = `EcommerceMedia/categories/${customId}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: req.filePath
    })

    const category = await categoryModel.create({
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
        customId
    })
    req.data = {
        model: categoryModel,
        id: category._id
    }

    res.status(201).json({ msg: "created", category })
}


export const getCategory = async (req, res, next) => {
    const category = await categoryModel.find()
    let categories = [];
    for (const c of category) {
        const subCategory = await subCategoryModel.find({ categoryId: c.id })
        categories.push({ category: c, subCategories: subCategory })
    }
    res.status(200).json({ msg: "done", categories })
}

export const deleteCategory = async (req, res, next) => {
    const { id } = req.params
    const category = await categoryModel.findByIdAndDelete(id)
    if (!category)
        return res.status(404).json({ msg: "cotegory not found" })

    await subCategoryModel.deleteMany({ categoryId: id })

    await cloudinary.api.delete_resources_by_prefix(`EcommerceMedia/categories/${category.customId}`)
    await cloudinary.api.delete_folder(`EcommerceMedia/categories/${category.customId}`)
    return res.status(200).json({ msg: "done", category })
}
export const updateCategory = async (req, res, next) => {
    const { name } = req.body
    const { id } = req.params

    const category = await categoryModel.findById(id)

    if (!category) {
        return next(new appError("Category not found", 404))
    }

    if (name) {
        if (name === category.name) {
            return next(new appError("Category name must be diffrent", 400))
        }
        if (await categoryModel.findOne({ name })) {
            return next(new appError("Category is exist", 400))
        }
        category.name = name
        category.slug = slugify(name, { replacement: '_' })
    }

    else if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `EcommerceMedia/categories/${category.customId}`
        })
        category.image.secure_url = secure_url
        category.image.public_id = public_id
    }
    else {
        return next(new appError("Add data to update", 204))
    }
    await category.save()

    res.status(200).json({ msg: "Updated", category })
}