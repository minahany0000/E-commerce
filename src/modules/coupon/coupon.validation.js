import Joi from "joi";
import generalField from "../../utils/generalFields.js";

export const createCouponValidation = {
    body: Joi.object({
        code: Joi.string()
            .min(3)
            .max(20)
            .required()
            .messages({
                "string.empty": "Coupon code is required",
                "string.min": "Coupon code must be at least 3 characters long",
                "string.max": "Coupon code must be at most 20 characters long",
            }),

        amount: Joi.number()
            .min(1)
            .max(100)
            .required()
            .messages({
                "number.base": "Amount must be a number",
                "number.min": "Amount must be at least 1",
                "number.max": "Amount must be at most 100",
                "any.required": "Coupon amount is required",
            }),

        fromDate: Joi.date()
            .greater(Date.now()) // Ensures fromDate is after today
            .required()
            .messages({
                "date.base": "From Date must be a valid date",
                "date.greater": "From Date must be after today",
                "any.required": "From Date is required",
            }),

        toDate: Joi.date()
            .greater(Joi.ref("fromDate")) // Ensures toDate is after fromDate
            .required()
            .messages({
                "date.base": "To Date must be a valid date",
                "date.greater": "To Date must be after From Date",
                "any.required": "To Date is required",
            }),
    }),

    headers: generalField.headers.required(),
};

export const updateCouponValidation = {
    body: Joi.object({
        code: Joi.string()
            .min(3)
            .max(20)
            .messages({
                "string.empty": "Coupon code is required",
                "string.min": "Coupon code must be at least 3 characters long",
                "string.max": "Coupon code must be at most 20 characters long",
            }),

        amount: Joi.number()
            .min(1)
            .max(100)
            .messages({
                "number.base": "Amount must be a number",
                "number.min": "Amount must be at least 1",
                "number.max": "Amount must be at most 100",
            }),

        fromDate: Joi.date()
            .greater(Date.now()) // Ensures fromDate is after today
            .messages({
                "date.base": "From Date must be a valid date",
                "date.greater": "From Date must be after today",
            }),

        toDate: Joi.date()
            .greater(Joi.ref("fromDate")) // Ensures toDate is after fromDate
            .messages({
                "date.base": "To Date must be a valid date",
                "date.greater": "To Date must be after From Date",
            }),
    }),

    headers: generalField.headers.required(),
};
