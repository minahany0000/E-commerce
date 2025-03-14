import Joi from "joi";
import generalField from "../../utils/generalFields.js";

export const createReviewValidation = {
    body: Joi.object({
        comment: Joi.string().trim().min(5).max(500).required().messages({
            "string.empty": "Comment cannot be empty.",
            "string.min": "Comment must be at least 5 characters.",
            "string.max": "Comment cannot exceed 500 characters.",
            "any.required": "Comment is required."
        }),
        rate: Joi.number().min(1).max(5).required().messages({
            "number.base": "Rate must be a number.",
            "number.min": "Rate must be at least 1.",
            "number.max": "Rate cannot exceed 5.",
            "any.required": "Rate is required."
        })
    }),
    params: Joi.object({
        productId: generalField.id.required().messages({
            "any.required": "Product ID is required.",
        })
    }),
    headers: generalField.headers.required(),

};


