import { nanoid } from "nanoid"
import brandModel from "../../../db/models/brand.model.js"
import appError from "../../utils/appError.js"
import cloudinary from "../../utils/cloudinary.js"
import slugify from "slugify"
import { ApiFeatures } from "../../utils/apiFeatures.js"

export const createBrand = async (req, res, next) => {
    const { name } = req.body
    const brandExist = await brandModel.findOne({ name })
    if (brandExist) {
        return next(new appError("brand exist", 409))
    }
    if (!req.file) {
        return next(new appError("Image is required", 400))
    }
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `EcommerceMedia/brands/${customId}`
    })

    const brand = await brandModel.create({
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
    res.status(201).json({ msg: "created", brand })
}
export const updateBrand = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        const brand = await brandModel.findById(id);
        if (!brand) {
            return next(new appError("Brand does not exist", 404));
        }

        let isUpdated = false;


        if (name) {
            const checkBrand = await brandModel.findOne({ name })
            if (checkBrand) {
                return next(new appError("Brand name is already exist", 409))
            }
            brand.name = name;
            isUpdated = true;
        }
        if (req.file) {
            await cloudinary.api.delete_resources_by_prefix(`EcommerceMedia/brands/${brand.customId}`);
            await cloudinary.api.delete_folder(`EcommerceMedia/brands/${brand.customId}`);

            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: `EcommerceMedia/brands/${brand.customId}`
            });

            brand.image = { secure_url, public_id };
            isUpdated = true;
        }


        if (!isUpdated) {
            return next(new appError("No updates were made", 400));
        }

        await brand.save();

        return res.status(200).json({ msg: "Brand updated successfully", brand });

    } catch (error) {
        return next(error);
    }
};

export const getAllBrands = async (req, res, next) => {
    const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
        .filter()
        .pagination()
        .search()
        .sort()
        .select()

    const brands = await apiFeatures.query

    return res.status(200).json({ msg: "done", page: apiFeatures.page, brands })
}

export const deleteBrand = async (req, res, next) => {
    const { id } = req.params

    const brand = await brandModel.findByIdAndDelete(id)

    await cloudinary.api.delete_resources_by_prefix(`EcommerceMedia/brands/${brand.customId}`)
    await cloudinary.api.delete_folder(`EcommerceMedia/brands/${brand.customId}`)

    return res.status(200).json({ msg: "done brand deleted" })
}

