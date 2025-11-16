import { Router } from "express";
import { addOrder, getOrder } from "../Controllers/Order.js";

 const orderRouter= Router()

 orderRouter.get("/getOrder", getOrder)
 orderRouter.post("/addOrder", addOrder)

 export default orderRouter 