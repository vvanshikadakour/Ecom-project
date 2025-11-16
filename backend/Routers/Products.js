import { Router } from "express";
import {  addProduct, deleteProduct, getProduct, updateProduct } from "../Controllers/Products.js";
import upload, { handleMulterError } from "../middlewares/multer.js";

const productsRouter= Router()
productsRouter.get("/",getProduct)
productsRouter.post("/add-product",upload.array("image", 2), handleMulterError, addProduct)
productsRouter.patch("/update-product/:id", upload.array("image", 2), handleMulterError, updateProduct)
productsRouter.delete("/delete-product/:id", deleteProduct)

export default productsRouter 