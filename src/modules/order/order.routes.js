import { Router } from "express";
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
    auth([systemRoles.user]),
    asyncHandler(BC.createOrder)
);
orderRouter.delete(
    "/cancelOrder/:id",
    validate(BV.cancelOrderValidation),
    auth([systemRoles.user]),
    asyncHandler(BC.cancelOrder)
);


export default orderRouter;
