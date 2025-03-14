import joi from 'joi'
import generalField from '../../utils/generalFields.js'



export const createCategoryValidation = {
    body: joi.object({
        name: joi.string().min(3).max(20).required().messages({
            "any.required": "Category name is required",
            "string.empty": "Category name cannot be empty",
            "string.min": "Category name must be at least 3 characters",
            "string.max": "Category name cannot exceed 20 characters"
        })
    }).unknown(),
    headers: generalField.headers.required(),
}

export const updateCategoryValidation = {
    body: joi.object({
        name: joi.string().min(3).max(20).messages({
            "string.empty": "Category name cannot be empty",
            "string.min": "Category name must be at least 3 characters",
            "string.max": "Category name cannot exceed 20 characters"
        })
    }).unknown(),
    headers: generalField.headers.required(),
}