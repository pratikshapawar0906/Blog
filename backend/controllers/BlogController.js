import Blog from "../models/BlogSchema.js"


// Create a blog post
export const blogPost= async (req, res) => {
    try {
      const { BlogId } = req.user;
      const { title, content,  bannerUrl, author, isPublished } = req.body;
      
      if (!title || !content || !author || ! bannerUrl) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newBlog = new Blog({ title, content,  author: BlogId , bannerUrl,isPublished});
      await newBlog.save();
  
      res.status(201).json(newBlog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Get all blogs
export const AllBlog= async (req, res) => {
    try {
      const blogs = await Blog.findById(req.params.id).populate("author", "name", "email"); // Fetch author details
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getDraft = async (req, res) => {
  try {
    const draft = await Blog.findById(req.params.id);
    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }
    res.status(200).json({ success: true, draft });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching draft" });
  }
};
  
export const blog=async(req,res)=>{
  try{
      const blog=await Blog.findById(req.params.id).populate("author","name", "email")
      if(!blog){
          return res.status(404).json({message:"Blog not found"});
      }
      res.status(200).json(blog);
  }catch(error){
      res.status(500).json({message:error.message});
  }
}

export const saveDraft = async (req, res) => {
  const { title, content, isPublished } = req.body;
  const author =  req.user.id || req.user.id; // Extract author from the token

  if (!title || !content ) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const newBlog = new Blog({
      title,
      content,
      author:req.user.id,
      isPublished: false, // Draft status
    });

    await newBlog.save();

    res.status(200).json({
      success: true,
      message: "Draft saved successfully!",
      draft: newBlog._id, // Send draft ID to frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving draft." });
  }
};
