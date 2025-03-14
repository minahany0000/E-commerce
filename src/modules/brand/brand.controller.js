import { nanoid } from "nanoid"
import brandModel from "../../../db/models/brand.model.js"
import appError from "../../utils/appError.js"
import cloudinary from "../../utils/cloudinary.js"
import slugify from "slugify"





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
