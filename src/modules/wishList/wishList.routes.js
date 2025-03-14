import { Router } from "express";
import * as BC from "./wishList.controller.js";
import auth from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import * as BV from "./wishList.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const wishListRouter = Router({ mergeParams: true });

// create wishList
wishListRouter.post(
    "/add",
    // validate(BV.addValidation),
    auth([systemRoles.user]),
    asyncHandler(BC.add)
);
// wishListRouter.delete(
//     "/delete/:id",
//     // validate(BV.addValidation),
//     auth(["user"]),
//     asyncHandler(BC.remove)
// );
// // remove product from wishList 


export default wishListRouter;
