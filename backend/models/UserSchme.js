import mongoose from "mongoose";

const UserSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        profilePicture: {
            type: String,
             default: '' ,
           },
          
       bio:{ 
             type: String ,
             default: ' this is my bio'
       },
       socialLinks: {
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        website: { type: String, default: "" },
      },
        resetToken: String,
        resetTokenExpiry: Date,
    },
    {timestamps:true}
);

const user=mongoose.model("user",UserSchema);
export default user;