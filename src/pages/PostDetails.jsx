
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import CommentsSection from "../components/CommentsSection";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const getPost = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.POSTS.GET_POST_BY_ID(id));
      setPost(res.data.post || res.data);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!post) return <p className="text-center py-10">Post not found</p>;

  return (
    <div className="bg-white min-h-screen">
      
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <Link to="/" className="text-2xl font-bold">
            MyBlog
          </Link>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full px-4 py-1 text-sm focus:outline-none"
            />
            <Link to="/login" className="text-sm">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-1 rounded-full text-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      
      <main className="max-w-4xl mx-auto px-6 py-10">
        <img
          src={post.postImageUrl}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span>{post.createdBy?.name || "Unknown Author"}</span>
          <span>· {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="text-gray-700 leading-relaxed mb-10">
          {post.description}
        </p>

        
        <CommentsSection postId={post._id} />
      </main>
    </div>
  );
};

export default PostDetails;
