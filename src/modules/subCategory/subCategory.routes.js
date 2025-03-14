import { Router } from "express";
import * as SCC from "./subCategory.controller.js";
import auth from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import * as CV from "./subCategory.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const subCategoryRouter = Router({ mergeParams: true });
// zbt al validations
// create subcategory
subCategoryRouter.post(
    "/createSubCategory",
    multerHost(validExtensions.image).single("image"),
    validate(CV.createSubCategoryValidation),
    auth([systemRoles.user]),
    asyncHandler(SCC.createSubCategory)
);
subCategoryRouter.get(
    "/getSubCategories",
    auth([systemRoles.user, "admin"]),
    asyncHandler(SCC.getSubCategories)
);
subCategoryRouter.get(
    "/getCategorySubCatigories",
    auth([systemRoles.user, "admin"]),
    asyncHandler(SCC.getCategorySubCatigories)
);

// update subcategory
// subCategoryRouter.put("/updateSubCategory/:id", ...);

// delete subcategory
// subCategoryRouter.delete("/deleteSubCategory/:id", ...);

// get subcategory by id
// subCategoryRouter.get("/getSubCategory/:id", ...);

// get all subcategories
// subCategoryRouter.get("/getAllSubCategories", ...);

export default subCategoryRouter;
