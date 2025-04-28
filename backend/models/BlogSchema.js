import mongoose from "mongoose";

const BlogSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        content:{
            type:String,
            required:true,
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"user"
        },
        bannerUrl: { 
            type: String, 
            required: true 
        },
        isPublished: {
            type: Boolean,
            default: false, // false indicates it's a draft
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
    },
    {timestamps:true}
)
const Blog=mongoose.model("Blog",BlogSchema)

export default Blog