import { Router } from "express";
import * as BC from "./review.controller.js";
import auth from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import * as BV from "./review.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const reviewRouter = Router({ mergeParams: true });

// create review
reviewRouter.post(
    "/createReview",
    validate(BV.createReviewValidation),
    auth([systemRoles.user]),
    asyncHandler(BC.createReview)
)
reviewRouter.delete(
    "/deleteReview",
    auth([systemRoles.user]),
    asyncHandler(BC.deleteReview)
)
export default reviewRouter;
