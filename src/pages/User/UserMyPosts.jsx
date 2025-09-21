import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const UserMyPosts = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const fetchMyPosts = async () => {
    if (!currentUser?._id) {
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.get(API_PATHS.POSTS.GET_MEMBER_POSTS);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Error fetching my posts:", err);
      setError("Failed to load your posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [currentUser]);

  
  const handleEdit = (postId) => {
    navigate("/user/create-post", {
      state: { postId, redirectTo: "/user/posts" },
    });
  };

  
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE_POST(postId));
      toast.success("Post deleted successfully");
      fetchMyPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post");
    }
  };

  
  const handleView = (postId) => {
    navigate(`/user/posts/${postId}`);
  };

  if (loading)
    return <p className="text-center py-10">Loading your posts...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!posts.length)
    return (
      <p className="text-center py-10">You have not created any posts yet.</p>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={post.postImageUrl}
              alt={post.title}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => handleView(post._id)}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
                  onClick={() => handleEdit(post._id)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserMyPosts;
