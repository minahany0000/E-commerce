import Joi from "joi";
import generalField from "../../utils/generalFields.js";

export const createOrderValidation = {
    body: Joi.object({
        productId: Joi.string().hex().length(24),
        quantity: Joi.number().integer().min(1).when("productId", { is: Joi.exist(), then: Joi.required() }),
        couponCode: Joi.string().trim().optional(),
        address: Joi.string().trim().min(5).max(100).required(),
        city: Joi.string().trim().min(5).max(100).required(),
        street: Joi.string().trim().min(5).max(100).required(),
        state: Joi.string().trim().min(5).max(100).required(),
        phone: Joi.string().pattern(/^(01)[0-9]{9}$/).required(),
        paymentMethod: Joi.string().valid("cash", "card").required(),
    }),

    headers: generalField.headers.required(),
};
export const cancelOrderValidation = {
    body: Joi.object({
        reason: Joi.string().required().min(3).max(100)
    }),

    headers: generalField.headers.required(),
    params: Joi.object({
        id: Joi.string().hex().length(24),
    })

};
