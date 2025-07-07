import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1); // current page number
  const [totalPages, setTotalPages] = useState(1); // total pages from backend

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const fetchBlogs = async (page) => {
    try {
      const res = await axios.get(`http://localhost:7000/api/AllPost?page=${page}&limit=5`);
      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Main Content */}
        <div className="col-md-8">
          {blogs.map((blog) => (
            <div key={blog._id} className="card mb-4 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>{blog.authorName}</span> {/* assuming you are saving author name */}
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">{blog.content.substring(0, 150)}...</p>
                <div className="d-flex align-items-center">
                  <a href={`/blog/${blog._id}`} className="btn btn-primary btn-sm">Read More</a>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Buttons */}
          <div className="d-flex justify-content-between">
            <button onClick={handlePrev} disabled={page === 1} className="btn btn-secondary">
              Previous
            </button>
            <button onClick={handleNext} disabled={page === totalPages} className="btn btn-secondary">
              Next
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          {/* Add your categories/trending section here, same as before */}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
