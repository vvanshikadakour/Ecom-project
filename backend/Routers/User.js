import { Router } from "express";
import { getProfile, login, logout, signup, updateProfile } from "../Controllers/User.js";
import password from "../middlewares/passwordVrification.js";
import upload, { handleMulterError } from "../middlewares/multer.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const userRouter= Router()
userRouter.post("/signup",upload.single("picture"), handleMulterError, signup )
userRouter.post("/login", password, login)
userRouter.get("/getProfile", authMiddleware,getProfile)
userRouter.post("/logout",authMiddleware,  logout)
userRouter.put("/updateProfile", upload.single("picture"), handleMulterError, updateProfile);

export default userRouter;