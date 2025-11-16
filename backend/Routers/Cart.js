import { Router } from "express";
import { addToCart, getCart, updateCart } from "../Controllers/Cart.js";
import  authMiddleware from "../middlewares/authmiddleware.js";

const cartRouter=  Router()

cartRouter.post("/add",authMiddleware, addToCart)
cartRouter.get("/get", authMiddleware, getCart)
cartRouter.post("/update", authMiddleware, updateCart)

export default cartRouter;