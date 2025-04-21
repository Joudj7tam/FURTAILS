import express from "express"
import { addOrder, listOrders } from "../Controllers/ordersController.js"

const ordersRouter = express.Router();

ordersRouter.post("/add", addOrder)
ordersRouter.get("/list", listOrders)

export default ordersRouter;