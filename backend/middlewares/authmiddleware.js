import jwt from "jsonwebtoken";
import User from "../Schemas/UserSchema.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log("🔐 Auth Middleware - Token:", token ? "exists" : "missing");
    
    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({ error: "Not authenticated - Please login first" });
    }

    const decoded = jwt.verify(token, process.env.secret_key);
    console.log("✅ Token decoded, userId:", decoded.id);
    
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("❌ User not found for id:", decoded.id);
      return res.status(401).json({ error: "User not found" });
    }

    console.log("✅ User authenticated:", user.userName);
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    return res.status(401).json({ error: "Invalid token - Please login again" });
  }
};

export default authMiddleware;
