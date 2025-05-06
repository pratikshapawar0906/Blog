import express from "express";
import multer from "multer"; // Import multer
import User from "../models/UserSchme.js";
import { blogPost, saveDraft, getDraft } from "../controllers/BlogController.js";
import { forgot_password, login, signup, updateProfile, user } from "../controllers/UserController.js";
import Blog from "../models/BlogSchema.js";
import { authMiddleware, authenticateToken } from "../middleare/authMiddleare.js";
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// multer stroge for picture 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/')
  },
  filename: function (req, file, cb) {
      console.log(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept image files
  } else {
      cb(new Error("Please upload an image file"), false); // Reject non-image files
  }
};

const upload = multer({ 
  storage: storage ,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit to 50MB per file
})

// Blog Routes // blog post //create blog 
router.post("/blogPost", authMiddleware, blogPost); // blog post 

// Blog Routes  // get all blog 
router.get("/AllPost", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const blogs = await Blog.find().populate('author', 'email').skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Blog.countDocuments();
  res.json({ blogs, total });
});

 // find blog by id
router.get("/blog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'email');
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
}); 


router.get("/draft/:id", authMiddleware, getDraft); //draft  id
router.post("/saveDraft",authMiddleware, saveDraft);// save draft
router.post("/forgot-password", forgot_password); // forgot paaword of email
router.get("/user/:userId", user);  // user and userId
router.put("/updateProfile", updateProfile);// profile update
let blogs = [];

// Update a blog post
router.put("/blogPost/:id", async (req, res) => {
    // try {
    //     const { id } = req.params;
    //     const { title, bannerUrl, content, isPublished } = req.body;
    //     const updatedBlog = await Blog.findByIdAndUpdate(
    //         id,
    //         { title, bannerUrl, content, isPublished },
    //         { new: true }
    //     );
    //     res.json(updatedBlog);
    // } catch (error) {
    //     res.status(500).json({ message: "Failed to update blog" });
    // }

    const blog = await Blog.findById(req.params.id);
  if (!blog || blog.author.toString() !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  Object.assign(blog, req.body);
  await blog.save();
  res.json(blog);
});

// Delete a blog post
router.delete("/blogPost/:id", authMiddleware, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.author.toString() !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  await blog.deleteOne();
  res.json({ message: 'Blog deleted' });
});


// add a profile photo 
router.post("/user/uploadProfilePhoto", upload.single("profilePhoto"), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required!" });

    //  Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures", // Save in "profile_pictures" folder in Cloudinary
    });

    // Update User Profile Picture in Database
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url }, // Save Cloudinary URL
      { new: true }
    );

    res.json({ success: true, photoUrl: result.secure_url, user });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

//Blog  photo upload
router.post("/blogPost/uploadBlogPhoto", upload.single("blogPhoto"), async (req, res) => {
  const { title, content } = req.body;
  const bannerUrl = req.file ? `/uploads/${req.file.filename}` : '';
  const newBlog = { id: Date.now(), title, content, bannerUrl };
  blogs.push(newBlog);
  res.status(201).json(newBlog);
});

// In server/routes/blogRoutes.js or wherever you defined
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();
    const blogs = await Blog.find()
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .populate('author', 'name'); // if you want author details

    res.json({
      blogs,
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Authentication Routes
router.post("/auth/signup", signup); //signup
router.post("/auth/login", login);  //login

export default router;
