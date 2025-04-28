import express from "express";
import multer from "multer"; // Import multer
import User from "../models/UserSchme.js";
import { blogPost, AllBlog, blog, saveDraft, getDraft } from "../controllers/BlogController.js";
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

// Blog Routes
router.post("/blogPost", authenticateToken, blogPost); // blog post 
router.get("/AllBlog", authMiddleware, AllBlog);// get all blog 
router.get("/blog/:id", authMiddleware, blog);  // find blog by id
router.get("/draft/:id", authMiddleware, getDraft); //draft  id
router.post("/saveDraft",authMiddleware, saveDraft);// save draft
router.post("/forgot-password", forgot_password); // forgot paaword of email
router.get("/user/:userId", user);  // user and userId
router.put("/updateProfile", updateProfile);// profile update

// Update a blog post
router.put("/blogPost/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, bannerUrl, content } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, bannerUrl, content },
            { new: true }
        );
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: "Failed to update blog" });
    }
});

// Delete a blog post
router.delete("/blogPost/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete blog" });
    }
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
  try {
    const { blogId } = req.body;
    if (!blogId) return res.status(400).json({ error: "Blog ID is required!" });

    //  Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Blog_pictures", // Save in "profile_pictures" folder in Cloudinary
    });

    // Update Blog's Banner URL
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { bannerUrl: result.secure_url },
      { new: true }
    );

    res.json({ success: true, photoUrl: result.secure_url, blog });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// Authentication Routes
router.post("/auth/signup", signup); //signup
router.post("/auth/login", login);  //login

export default router;
