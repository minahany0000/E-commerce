import cloudinary from "./cloudinary.js"

export const deleteFromCloudinary = async (req, res, next) => {
    if (req?.filePath) {
        await cloudinary.api.delete_resources_by_prefix(req.filepath)
        await cloudinary.api.delete_folder(req.filepath)
    }
    next()
}