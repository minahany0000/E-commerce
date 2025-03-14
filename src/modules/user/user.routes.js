import { Router } from "express"
import * as UC from './user.controller.js'
import asyncHandler from "../../utils/asyncHandler.js"
import validate from "../../middleware/validate.js"
import * as UV from './user.validation.js'
import auth from "../../middleware/auth.js"

const userRouter = Router()

userRouter.post('/',
    validate(UV.signUpValidation),
    asyncHandler(UC.signUp)
)

userRouter.post('/logIn',
    validate(UV.logInValidation),
    asyncHandler(UC.logIn)
)
userRouter.get('/verifyEmail/:token',
    validate(UV.verifyEmailValidation),
    asyncHandler(UC.verifyEmail)
)
userRouter.get('/rfVerifyEmail/:token',
    validate(UV.verifyEmailValidation),
    asyncHandler(UC.rfVerifyEmail)
)
userRouter.patch('/forgetPassword',
    validate(UV.forgetPasswordValidation),
    asyncHandler(UC.forgetPassword)
)
userRouter.patch('/resetPassword',
    validate(UV.resetPasswordValidation),
    asyncHandler(UC.resetPassword)
)
userRouter.delete('/logOut',
    auth(["user", "admin"]),
    validate(UV.logOutValidation),
    asyncHandler(UC.logOut)
)
userRouter.patch('/updateProfile',
    auth(["user", "admin"]),
    validate(UV.updateProfileValidation),
    asyncHandler(UC.updateProfile)
)

userRouter.get('/myProfile',
    auth(["user", "admin"]),
    asyncHandler(UC.myProfile)
)

userRouter.get('/allUsers',
    auth(["admin"]),
    asyncHandler(UC.allUsers)
)





export default userRouter
