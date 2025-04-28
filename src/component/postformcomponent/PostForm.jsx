import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BlogEditor = () => {
  const { BlogId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [blog, setBlog] = useState({
    title: '',
    bannerUrl: '',
    content: '',
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (!token) {
      console.error("No token found. Redirecting to login...");
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!BlogId) return;
    axios.get(`http://localhost:7000/api/blog/${BlogId}`)
      .then(({ data }) => setBlog(data))
      .catch((err) => console.error("Error fetching blog:", err));
  }, [BlogId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("Token");
    if (!token) {
      console.error("No token found. Redirecting to login...");
      navigate('/login');
      return;
    }
  
    if (!blog.title || !blog.content) {
      toast.error("Title and Content are required.");
      return;
    }
  
    let bannerUrl = blog.bannerUrl;
  
    if (fileInputRef.current.files[0]) {
      // Upload the image to the backend
      const formData = new FormData();
      formData.append("blogPhoto", fileInputRef.current.files[0]);
      formData.append("BlogId", BlogId);
  
      try {
        const response = await fetch("http://localhost:7000/api/blogPost/uploadBlogPhoto", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        bannerUrl = data.secure_url; // Update with actual Cloudinary URL
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Image upload failed.");
        return;
      }
    }
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const apiUrl = BlogId 
      ? `http://localhost:7000/api/blogPost/${BlogId}` 
      : 'http://localhost:7000/api/blogPost';
  
    const method = BlogId ? 'put' : 'post';
  
    try {
      await axios[method](apiUrl, { ...blog, bannerUrl }, config);
      toast.success(BlogId ? "Blog updated successfully!" : "Blog published successfully!");
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.error("Unauthorized. Redirecting to login...");
        navigate('/login');
      } else {
        console.error("An error occurred:", err);
        toast.error("An error occurred while saving the blog.");
      }
    }
  };
  

  // Cloudinary Image Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBlog((prevBlog) => ({ ...prevBlog, bannerUrl: reader.result }));
    };
    reader.readAsDataURL(file);
    
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();

    if (!blog.title || !blog.content) {
      toast.error("Title and Content are required.");
      return;
    }

    try {
      const token = localStorage.getItem("Token");
      console.log(token) // Retrieve token from local storage

      const response = await axios.post("http://localhost:7000/api/saveDraft", {
        title: blog.title,
        content: blog.content,
        isPublished: false,
      },
      {
        headers: { Authorization: `Bearer ${token}` } // Include token in request headers
      });

      if (response.data.success) {
        toast.success("Draft saved successfully!");
        navigate(`/preview/${response.data.draft}`);// Redirect to preview page
      } else {
        toast.error(response.data.message || "Error saving draft.");
      }
    } catch (error) {
      toast.error("An error occurred while saving the draft.");
      console.error(error);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{BlogId ? "Edit Blog" : "New Blog"}</h5>
        <div>
          <button
            type="submit"
            className="btn btn-dark me-2"
            onClick={handleSubmit}
          >
            Publish
          </button>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        </div>
      </div>

      {/* Blog Banner */}
      <div className="mb-4">
        <div
          className="border rounded bg-light d-flex justify-content-center align-items-center"
          onClick={() => fileInputRef.current.click()}
          style={{
            height: "400px",
            backgroundImage: `url(${blog.bannerUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer"
          }}
        >
          {!blog.bannerUrl && (
            <span className="text-muted">Upload or paste banner URL</span>
          )}
        </div>
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} />
      </div>

      {/* Blog Title */}
      <div className="mb-3">
        <label htmlFor="blogTitle" className="form-label">
          Blog Title
        </label>
        <input
          type="text"
          id="blogTitle"
          className="form-control"
          name="title"
          value={blog.title}
          onChange={handleChange}
          placeholder="Enter your blog title"
          required
        />
      </div>

      {/* Blog Content */}
      <div className="mb-3">
        <label htmlFor="blogContent" className="form-label">
          Blog Content
        </label>
        <textarea
          id="blogContent"
          className="form-control"
          rows="10"
          name="content"
          value={blog.content}
          onChange={handleChange}
          placeholder="Let’s write an awesome story!"
          required
        ></textarea>
      </div>
    </div>
  );
};

export default BlogEditor;
