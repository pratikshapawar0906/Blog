import User from "../models/UserSchme.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import mongoose from "mongoose";

export const signup=async(req,res)=>{
      try{
        const { name ,email , password  }=req.body;
         
        // Validate required fields
         if (!name || !email || !password) {
           return res.status(400).json({ message: 'All fields are required' });
         }

        //check if user alrady exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"user already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create a new user
        const newUser= new User({name,email,password:hashedPassword})
        await newUser.save();

        res.status(201).json({message:"User registered successfully"})
      }catch(error){
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false,  message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ success: true, message: 'Login successful',token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: error.message });
  }
};

export const forgot_password=async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    // Generate reset token or link
    const resetLink = `http://localhost:3000/reset-password/${email}`;
    
    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.PASSWORD, // Your Gmail App Password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Password reset email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

// In your backend (Node.js / Express example)
export const user = async (req, res) => {
  const { userId } = req.params;
  const updatedData = req.body;

  try {
    // Check if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Retrieve user from database
    const user = await User.findById(userId);
    
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure full image URL is sent
    const imageUrl = user.profilePicture?.startsWith("http")
      ? user.profilePicture
      : `http://localhost:7000/uploads/${user.profilePicture}`;

    res.json({ ...user._doc, profilePicture: imageUrl });

  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Error fetching user profile", error: err.message });
  }
};

// Update user profile (name , bio, socialLinks)
export const updateProfile = async (req, res) => {
  const { userId, name, bio, socialLinks } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name and bio if provided
    user.name = name || user.name;
    user.bio = bio || user.bio;

    // Update social links only if provided
    if (socialLinks) {
      user.socialLinks.instagram = socialLinks.instagram || user.socialLinks.instagram;
      user.socialLinks.twitter = socialLinks.twitter || user.socialLinks.twitter;
      user.socialLinks.linkedin = socialLinks.linkedin || user.socialLinks.linkedin;
      user.socialLinks.website = socialLinks.website || user.socialLinks.website;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });

  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};
