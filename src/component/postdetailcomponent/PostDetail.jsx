import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:7000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <h2>Loading...</h2>;

  return (
    <div className="container mt-5">
      <h2>{blog.title}</h2>
      <p className="text-muted">
        By {blog.author?.email} | {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <img src={blog.bannerUrl} alt="Banner" className="img-fluid mb-3" />
      <p>{blog.content}</p>
    </div>
  );
};

export default BlogDetail;
