import Joi from "joi";
import generalField from "../../utils/generalFields.js";

export const createCartValidation = {
    body: Joi.object({
        products: Joi.array()
            .items(
                Joi.object({
                    productId: Joi.string()
                        .pattern(/^[0-9a-fA-F]{24}$/) // Ensures productId is a valid MongoDB ObjectId
                        .required()
                        .messages({
                            "string.pattern.base": "Invalid product ID format",
                            "string.empty": "Product ID is required",
                            "any.required": "Product ID is required",
                        }),

                    quantity: Joi.number()
                        .integer()
                        .min(1)
                        .required()
                        .messages({
                            "number.base": "Quantity must be a number",
                            "number.integer": "Quantity must be an integer",
                            "number.min": "Quantity must be at least 1",
                            "any.required": "Quantity is required",
                        }),
                })
            )
            .min(1)
            .required()
            .messages({
                "array.base": "Products must be an array",
                "array.min": "At least one product is required",
                "any.required": "Products are required",
            }),
    }),

    headers: generalField.headers.required(),
};
