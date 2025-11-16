import mongoose from "mongoose";

const connection=(uri)=>{
    mongoose.connect(uri)
    .then(()=>{
        console.log("mongodb connected ");
        
    })
    .catch((error)=>{
        console.log("connection error:", error.message);
    })
}

export default connection 