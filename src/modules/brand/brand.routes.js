import { Router } from "express";
import * as BC from "./brand.controller.js";
import auth from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import * as BV from "./brand.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const brandRouter = Router();

// create brand
brandRouter.post(
    "/createbrand",
    multerHost(validExtensions.image).single("image"),
    validate(BV.createBrandValidation),
    auth([systemRoles.user]),
    asyncHandler(BC.createBrand)
);

// update brand
// brandRouter.put("/updatebrand/:id", ...);

// delete brand
// brandRouter.delete("/deletebrand/:id", ...);

// get brand by id
// brandRouter.get("/getbrand/:id", ...);

// get all subcategories
// brandRouter.get("/getAllSubCategories", ...);

export default brandRouter;
