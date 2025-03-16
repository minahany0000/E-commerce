import { Router } from "express"
import express from "express"
import * as BC from "./order.controller.js";
import auth from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";
import validate from "../../middleware/validate.js";
import * as BV from "./order.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";


const orderRouter = Router();

// create order
orderRouter.post(
    "/createorder",
    validate(BV.createOrderValidation),
    auth([systemRoles.user , systemRoles.admin]),
    asyncHandler(BC.createOrder)
);
orderRouter.delete(
    "/cancelOrder/:id",
    validate(BV.cancelOrderValidation),
    auth([systemRoles.admin , systemRoles.user]),
    asyncHandler(BC.cancelOrder)
);
orderRouter.get(
    "/successPayment/:orderId",
    // validate(BV.successPaymentValidation),
    asyncHandler(BC.successPayment)
);


orderRouter.post('/webhook', express.raw({ type: 'application/json' }), BC.webhook);



export default orderRouter;
