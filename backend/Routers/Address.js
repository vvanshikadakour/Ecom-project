import { Router } from "express";
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../Controllers/Address.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const addressRouter = Router();

addressRouter.get("/get", authMiddleware, getAddresses);
addressRouter.post("/add", authMiddleware, addAddress);
addressRouter.put("/update/:id", authMiddleware, updateAddress);
addressRouter.delete("/delete/:id", authMiddleware, deleteAddress);
addressRouter.patch("/setDefault/:id", authMiddleware, setDefaultAddress);

export default addressRouter;
