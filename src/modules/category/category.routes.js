import { Router } from "express"
import * as CC from "./category.controller.js"
import auth from "../../middleware/auth.js"
import asyncHandler from "../../utils/asyncHandler.js"
import { multerHost, validExtensions } from "../../middleware/multer.js"
import validate from "../../middleware/validate.js"
import * as CV from "./category.validation.js"
import subCategoryRouter from '../subCategory/subCategory.routes.js'
import { systemRoles } from "../../utils/systemRoles.js"

const categoryRouter = Router()

categoryRouter.use('/:categoryId/subCategory', subCategoryRouter)


categoryRouter.post('/createCategory',
    multerHost(validExtensions.image).single('image'),
    validate(CV.createCategoryValidation),
    auth([systemRoles.user]),
    asyncHandler(CC.createCategory)
)
categoryRouter.put('/updateCategory/:id',
    multerHost(validExtensions.image).single('image'),
    validate(CV.updateCategoryValidation),
    auth([systemRoles.user]),
    asyncHandler(CC.updateCategory)
)
categoryRouter.get('/getCategory',
    auth([systemRoles.user]),
    asyncHandler(CC.getCategory)
)
categoryRouter.delete('/deleteCategory/:id',
    auth([systemRoles.user]),
    asyncHandler(CC.deleteCategory)
)
// get all categories


//Get a Single Category


//Delete a Category

//Soft Delete Category (Mark as Inactive)

//Restore Soft Deleted Category

//Get Categories Created by Logged-in User

//Get Categories with Pagination & Search

export default categoryRouter