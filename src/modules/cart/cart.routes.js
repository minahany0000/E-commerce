import { Router } from "express";
import * as BC from "./cart.controller.js";
import auth from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import * as BV from "./cart.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const cartRouter = Router();

// create cart
cartRouter.post(
    "/createcart",
    validate(BV.createCartValidation),
    auth(systemRoles.user),
    asyncHandler(BC.createCart)
);
// remove product from cart 


export default cartRouter;
