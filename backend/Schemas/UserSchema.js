import { model, Schema } from "mongoose";

 const UserSchema= new Schema({
    firstName:{
type:String,
required:[true , "name is required"]
    },
    lastName:{
        type:String,
        
    },
    userName:{
        type: String,
         unique:[true,"username already taken"],
         required:[true,"username is required "]
    },
    password:{
        type:String,
   
        required: [true, "please enter a password "],
        minlength: [9, "Password must be at least 9 characters long"]
    },
    picture:{
        type: String
    },
   Cartvalue:{
    type:Number,
    default:0,
    required:true
   }
 })

const User=  model("Users", UserSchema)
export default User;