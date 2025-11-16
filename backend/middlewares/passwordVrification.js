import User from "../Schemas/UserSchema.js"
import bcrypt from "bcrypt"
export default async  function password(req,res,next){
const {userName, password}= req.body 
if(userName=== process.env.admin_username){
if(password!==process.env.admin_password){
return res.status(401).json({
  message:"invalid admin password",
    isAdmin: true,
})

}
 return res.status(202).json({
  message:"admin loggedin ",
   isAdmin: true,
 })
}
const user = await User.findOne({userName})
if(!user){
    throw new Error("invalid credentials ")
}

try {
    let hashedpassword= user.password
  const isVerified= await  bcrypt.compare(password, hashedpassword )
  if(isVerified){
    req.body.user=user; 
  next()
  }
  else{
  return res.status(401).json({ error: "Invalid credentials" });
  }

} catch (error) {
  throw new Error (`server error, ${error.message}`)  
}


 }