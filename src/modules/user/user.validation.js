import joi from 'joi'
import generalField from '../../utils/generalFields.js'

export const signUpValidation = {
    body: joi.object({
        name: joi.string().
            min(3).
            max(20).
            trim().
            required().
            messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
                "string.min": "Name is too short, must be at least {#limit} characters",
                "string.max": "Name is too long, must be at most {#limit} characters",
            }),
        email: generalField.email.
            messages({
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty",
                "string.email": "Email must be a valid email address",
                "string.pattern.base": "Email must contain at least one number and be in a valid format (e.g., example1@gmail.com) and lowercase",
                "string.pattern.base": "Only Gmail addresses are allowed"

            }),
        password: generalField.password.
            messages({
                "any.required": "Password is required",
                "string.empty": "Password cannot be empty",
                "string.min": "Password must be at least {#limit} characters long",
                "string.max": "Password cannot exceed {#limit} characters",
                "string.pattern.base": "Password must contain at least one letter, one number, and one special character (@$!%*?&)"
            }),
        cPassword: generalField.cPassword
            .messages({
                "any.required": "Confirm password is required",
                "any.only": "Passwords do not match"
            }),
        age: joi.number().
            min(12).
            max(90).
            required().
            messages({
                'number.base': 'Age must be a number.',
                'number.min': 'Age must be at least {#limit} years old.',
                'number.max': 'Age must be at most {#limit} years old.',
                'any.required': 'Age is a required field'
            }),
        phone: joi.string()
            .pattern(/^01[0125][0-9]{8}$/)
            .messages({
                'string.pattern.base': 'Phone number must be a valid Egyptian mobile number starting with 010, 011, 012, or 015 and followed by 8 digits.',
            }),
        street: joi.string()
            .min(3)
            .max(100).
            required()
            .messages({
                'string.base': 'Street must be a string.',
                'string.empty': 'Street cannot be empty.',
                'string.min': 'Street should have a minimum length of {#limit} characters.',
                'string.max': 'Street should have a maximum length of {#limit} characters.',
                'any.required': 'Street is a required field'

            }),
        city: joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.base': 'City must be a string.',
                'string.empty': 'City cannot be empty.',
                'string.min': 'City should have a minimum length of {#limit} characters.',
                'string.max': 'City should have a maximum length of {#limit} characters.',
                'any.required': 'City is a required field'
            }),
        state: joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.base': 'State must be a string.',
                'string.empty': 'State cannot be empty.',
                'string.min': 'State should have a minimum length of {#limit} characters.',
                'string.max': 'State should have a maximum length of {#limit} characters.',
                'any.required': 'State is a required field'
            }),
        role: joi.string()
            .valid('admin', 'user')
            .optional()
            .messages({
                'any.only': 'Role must be either "admin" or "user".',
                'string.base': 'Role must be a string.',
                'string.empty': 'Role cannot be empty.',
            }),
    }).with("password", "cPassword")

}
/*
User verify email and RE verifyF
 */
export const verifyEmailValidation = {
    params: joi.object({
        token: joi.string()
            .required()
            .messages({
                "any.required": "Token is required",
                "string.empty": "Token cannot be empty",
            }),
    }),
};

export const forgetPasswordValidation = {
    body: joi.object({
        email: generalField.email.
            messages({
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty",
                "string.email": "Email must be a valid email address",
                "string.pattern.base": "Only Gmail addresses are allowed"
            })
    })
};
export const resetPasswordValidation = {
    body: joi.object({
        OTP: joi.string()
            .length(6)
            .pattern(/^\d{6}$/)
            .required()
            .messages({
                "string.empty": "OTP cannot be empty.",
                "string.length": "OTP must be exactly 6 digits.",
                "string.pattern.base": "OTP must contain only numbers.",
                "any.required": "OTP is required."
            }),
        email: generalField.email.
            messages({
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty",
                "string.email": "Email must be a valid email address",
                "string.pattern.base": "Only Gmail addresses are allowed"
            }),
        newPassword: generalField.password.
            messages({
                "any.required": "Password is required",
                "string.empty": "Password cannot be empty",
                "string.min": "Password must be at least {#limit} characters long",
                "string.max": "Password cannot exceed {#limit} characters",
                "string.pattern.base": "Password must contain at least one letter, one number, and one special character (@$!%*?&)"
            }),
        cPassword: joi.string().valid(joi.ref('newPassword')).required().
            messages({
                "any.required": "Confirm password is required",
                "any.only": "Passwords do not match"
            }),
    })
};
export const logInValidation = {
    body: joi.object({
        email: generalField.email.
            messages({
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty",
                "string.email": "Email must be a valid email address",
                "string.pattern.base": "Only Gmail addresses are allowed"
            }),
        password: joi.string().required().
            messages({
                "any.required": "Password is required",
                "string.empty": "Password cannot be empty",
            }),

    })
};
export const logOutValidation = {
    headers: generalField.headers
};
export const updateProfileValidation = {
    body: joi.object({
        name: joi.string().
            min(3).
            max(20).
            trim().
            messages({
                "string.min": "Name is too short, must be at least {#limit} characters",
                "string.max": "Name is too long, must be at most {#limit} characters",
            }),
        age: joi.number().
            min(12).
            max(90).
            messages({
                'number.base': 'Age must be a number.',
                'number.min': 'Age must be at least {#limit} years old.',
                'number.max': 'Age must be at most {#limit} years old.',
            }),
        phone: joi.string()
            .pattern(/^01[0125][0-9]{8}$/)
            .messages({
                'string.pattern.base': 'Phone number must be a valid Egyptian mobile number starting with 010, 011, 012, or 015 and followed by 8 digits.',
            }),
        street: joi.string()
            .min(3)
            .max(100)
            .messages({
                'string.base': 'Street must be a string.',
                'string.min': 'Street should have a minimum length of {#limit} characters.',
                'string.max': 'Street should have a maximum length of {#limit} characters.',
            }),
        city: joi.string()
            .min(2)
            .max(50)
            .messages({
                'string.base': 'City must be a string.',
                'string.min': 'City should have a minimum length of {#limit} characters.',
                'string.max': 'City should have a maximum length of {#limit} characters.',
            }),
        state: joi.string()
            .min(2)
            .max(50)
            .messages({
                'string.base': 'State must be a string.',
                'string.min': 'State should have a minimum length of {#limit} characters.',
                'string.max': 'State should have a maximum length of {#limit} characters.',
            }),
    }),
    headers: generalField.headers
};
