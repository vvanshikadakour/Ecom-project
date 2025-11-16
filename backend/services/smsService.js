// export const sendOTP = async (phone, otp) => {
//   try {
 
//     return { success: true, message: "OTP sent", otp: otp };
//   } catch (error) {    return { success: false, message: "Failed to send OTP" };
//   }
// };

// export const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };




export const sendOTP = async (phone, otp) => {
  try {
 
    return { success: true, message: "OTP sent", otp: otp };
  } catch (error) {    return { success: false, message: "Failed to send OTP" };
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};