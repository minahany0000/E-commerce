import { Router } from "express";
import * as BC from "./coupon.controller.js";
import auth from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import * as BV from "./coupon.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const couponRouter = Router();

// create coupon
couponRouter.post(
    "/createcoupon",
    validate(BV.createCouponValidation),
    auth([systemRoles.admin]),
    asyncHandler(BC.createCoupon)
);
couponRouter.patch(
    "/updateCoupon/:id",
    validate(BV.updateCouponValidation),
    auth([systemRoles.admin]),
    asyncHandler(BC.updateCoupon)
);

export default couponRouter;
