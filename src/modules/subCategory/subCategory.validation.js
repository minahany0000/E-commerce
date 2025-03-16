import joi from 'joi';
import generalField from '../../utils/generalFields.js';

export const createSubCategoryValidation = {
    body: joi.object({
        name: joi.string().min(3).max(20).required().messages({
            "any.required": "Subcategory name is required",
            "string.empty": "Subcategory name cannot be empty",
            "string.min": "Subcategory name must be at least 3 characters",
            "string.max": "Subcategory name cannot exceed 20 characters"
        })
    }).unknown(),
    params: joi.object({
        categoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
            "any.required": "Category ID is required",
            "string.pattern.base": "Invalid Category ID format"
        })
    }),
    headers: generalField.headers.required(),
};


export const deleteSubCategoryValidation = {
    headers: generalField.headers.required(),
 
};

export const getSubCategoryValidation = {
    headers: generalField.headers.required(),
};
