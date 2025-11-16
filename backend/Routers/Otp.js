import { Router } from "express";
import { sendOtp, verifyOtp } from "../Controllers/Otp.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const otpRouter = Router();

otpRouter.post("/send", authMiddleware, sendOtp);
otpRouter.post("/verify", authMiddleware, verifyOtp);

export default otpRouter;
