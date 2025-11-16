


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./db/db.js";
import userRouter from "./Routers/User.js";
import cookieParser from "cookie-parser";
import productsRouter from "./Routers/Products.js";
import cartRouter from "./Routers/Cart.js";
import orderRouter from "./Routers/Order.js";
import addressRouter from "./Routers/Address.js";
import otpRouter from "./Routers/Otp.js";

dotenv.config();

connection(process.env.mongodb_uri);

const app = express();

// ✅ Proper CORS config:
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue:false,
    optionsSuccessStatus:204,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/products", productsRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/address", addressRouter);
app.use("/otp", otpRouter);

app.listen(process.env.PORT, () => {
  console.log("✅ Server started on port", process.env.PORT);
});
