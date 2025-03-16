import { Router } from "express";
import * as BC from "./brand.controller.js";
import auth from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import * as BV from "./brand.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const brandRouter = Router();

brandRouter.post(
    "/createbrand",
    multerHost(validExtensions.image).single("image"),
    validate(BV.createBrandValidation),
    auth([systemRoles.admin]),
    asyncHandler(BC.createBrand)
);
brandRouter.get(
    "/getAllBrands",
    asyncHandler(BC.getAllBrands)
);

brandRouter.delete(
    "/deleteBrand/:id",
    auth([systemRoles.admin]),
    validate(BV.deleteBrandValidation),
    asyncHandler(BC.deleteBrand)
);

brandRouter.patch(
    "/updateBrand/:id",
    multerHost(validExtensions.image).single("image"),
    auth([systemRoles.admin]),
    validate(BV.updateBrandValidation),
    asyncHandler(BC.updateBrand)
);

//get brand products


// get prand categories


// get brand subCategories

export default brandRouter;
