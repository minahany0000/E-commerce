import joi from 'joi';
import generalField from '../../utils/generalFields.js';

export const createProductValidation = {
    body: joi.object({
        title: joi.string().min(3).max(100).required().messages({
            "any.required": "Title is required",
            "string.empty": "Title cannot be empty"
        }),
        description: joi.string().required().messages({
            "any.required": "Description is required"
        }),
        categoryId: generalField.mongoId.required().messages({
            "any.required": "Category ID is required"
        }),
        subCategoryId: generalField.mongoId.required().messages({
            "any.required": "Subcategory ID is required"
        }),
        brandId: generalField.mongoId.required().messages({
            "any.required": "Brand ID is required"
        }),
        price: joi.number().positive().required().messages({
            "any.required": "Price is required"
        }),
        stock: joi.number().integer().min(0).required().messages({
            "any.required": "Stock is required"
        }),
        discount: joi.number().min(0).max(100).optional(),
    })
};
export const getProductsValidation = {
    headers: generalField.headers.required(),
};
