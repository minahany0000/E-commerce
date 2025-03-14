import joi from 'joi'
import generalField from '../../utils/generalFields.js'



export const createBrandValidation = {
    body: joi.object({
        name: joi.string().min(3).max(20).required().messages({
            "any.required": "subCategory name is required",
            "string.empty": "subCategory name cannot be empty",
            "string.min": "subCategory name must be at least 3 characters",
            "string.max": "subCategory name cannot exceed 20 characters"
        })
    }).unknown(),
    headers: generalField.headers.required(),
}
