import OTP from "../Schemas/OtpSchema.js";
import { sendOTP, generateOTP } from "../services/smsService.js";

export async function sendOtp(req, res) {
  try {
    const userId = req.user._id;
    const { phone } = req.body;
if (!phone) {
      return res.status(400).json({ message: "Phone number is required" }); }
const phoneRegex = /^[6-9]\d{9}$/; 
    if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Invalid phone number format" });}
await OTP.deleteMany({ userId, phone });
const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 30  * 1000); 
const otpDoc = new OTP({
      phone,
      otp,
      userId,
      expiresAt,});
await otpDoc.save();
const smsResult = await sendOTP(phone, otp);
if (smsResult.success) {
      res.status(200).json({ 
        message: "OTP sent successfully",
    devOtp: otp });
    } else {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    const userId = req.user._id;
    const { phone, otp } = req.body;

    if (!phone ||  !otp) {
      return res.status(400).json({ message: "phone num & OTP are required" }); }
 const otpDoc = await OTP.findOne({ 
       phone ,   userId, otp,expiresAt: { $gt: new Date() }
    });
if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" }); }
if(otpDoc.otp== otp){
  otpDoc.verified = true;
    await otpDoc.save();
    //  await OTP.deleteOne({_id: otpDoc._id});
     res.status(200).json({ 
      message: "OTP verified successfully",
      verified: true 
    });}
else{
      return res.status(404).json({ 
      message: "invalid otp ",
      verified: true 
    });
}

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
