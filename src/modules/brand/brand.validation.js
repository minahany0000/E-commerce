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

export const deleteBrandValidation = {

    headers: generalField.headers.required(),
    params: joi.object({
        id: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
            "string.pattern.base": "Invalid brand ID format",
            "any.required": "Brand ID is required",
        }),
    }),

}

export const updateBrandValidation = {
    headers: generalField.headers.required(),
    params: joi.object({
        id: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
            "string.pattern.base": "Invalid brand ID format",
            "any.required": "Brand ID is required",
        }),
    }),
    body: joi.object({
        name: joi.string().optional().min(2).max(50).messages({
            "string.min": "Brand name must be at least 2 characters long",
            "string.max": "Brand name must be at most 50 characters long",
        }),
    }),
};

