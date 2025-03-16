import { Router } from "express";
import * as SCC from "./subCategory.controller.js";
import auth from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import * as CV from "./subCategory.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const subCategoryRouter = Router({ mergeParams: true });
//'/:categoryId/subCategory'

subCategoryRouter.post(
    "/createSubCategory",
    multerHost(validExtensions.image).single("image"),
    validate(CV.createSubCategoryValidation),
    auth([systemRoles.admin]),
    asyncHandler(SCC.createSubCategory)
);
subCategoryRouter.get(
    "/getSubCategories",
    asyncHandler(SCC.getSubCategories)
);
subCategoryRouter.get(
    "/",
    asyncHandler(SCC.getCategoryById)
);
subCategoryRouter.delete("/deleteSubCategory/:subCategoryId",
    validate(CV.deleteSubCategoryValidation),
    auth([systemRoles.admin]),
    SCC.deleteSubCategory
);
export default subCategoryRouter;
