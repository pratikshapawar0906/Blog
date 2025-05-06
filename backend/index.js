import express from "express"
import cors from "cors";
import cloudinary from "cloudinary"
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
dotenv.config()
import router from "./routes/route.js"
import bodyParser from "body-parser";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000
const app=express();



app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

dotenv.config(); // Load environment variables

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use("/api", router);

app.use("/upload", express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
})