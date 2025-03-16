import dbConnection from "../db/dbConnection.js"
import * as routers from './modules/index.routes.js'
import { globalErrorHandling } from "./utils/asyncHandler.js";
import { deleteFromCloudinary } from "./utils/deleteFromCloudinary.js";
import { deleteFromDb } from "./utils/deleteFromDb.js";

export const initApp = (app, express) => {
    const port = process.env.PORT || 3000
    // json
    app.use((req, res, next) => {
        if (req.originalUrl == "/order/webhook") {
            next()
        } else
            express.json()(req, res, next);
    })


    // connct database
    dbConnection()

    // 
    app.get('/', (req, res) => res.send('Welcome in my E-commerce app'))



    app.use('/users', routers.userRouter)
    app.use('/category', routers.categoryRouter)
    app.use('/subCategory', routers.subCategoryRouter)
    app.use('/brand', routers.brandRouter)
    app.use('/product', routers.productRouter)
    app.use('/coupon', routers.couponRouter)
    app.use('/cart', routers.cartRouter)
    app.use('/order', routers.orderRouter)
    app.use('/review', routers.reviewRouter)
    app.use('/wishList', routers.wishListRouter)

    // basic
    app.use("*", (req, res) => res.status(404).json(`${req.originalUrl} not found`))


    //Global error handling
    app.use(globalErrorHandling, deleteFromCloudinary, deleteFromDb)

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}


