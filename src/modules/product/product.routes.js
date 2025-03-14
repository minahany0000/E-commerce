import { Router } from 'express'
import multer from 'multer'
import * as PC from './product.controller.js'
import auth from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import * as PV from './product.validation.js'
import { multerHost, validExtensions } from '../../middleware/multer.js';
import asyncHandler from '../../utils/asyncHandler.js';
import reviewRouter from '../review/review.routes.js'
import wishListRouter from '../wishList/wishList.routes.js'
import { systemRoles } from '../../utils/systemRoles.js';

const productRouter = Router()
productRouter.use("/:productId/reveiws", reviewRouter)
productRouter.use("/:productId/wishList", wishListRouter)

productRouter.post(
    "/createProduct",
    auth([systemRoles.user]),
    multerHost(validExtensions.image).fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 3 }
    ]),
    validate(PV.createProductValidation),
    asyncHandler(PC.createProduct)
);

productRouter.get(
    "/",
    // auth([systemRoles.user]),
    multerHost(validExtensions.image).fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 3 }
    ]),
    // validate(PV.getProductsValidation),
    asyncHandler(PC.getProducts)
);

export default productRouter
