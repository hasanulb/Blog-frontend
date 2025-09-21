import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const AdminPostDetails = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  const getPostDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_POST_BY_ID(id));
      setPost(response.data?.post);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };
  
  

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE_POST(id));
      navigate("/admin/posts"); 
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdate = () => {
    navigate(`/admin/edit-post/${id}`);
  };

  useEffect(() => {
    getPostDetails();
  }, [id]);

  return (
    <DashboardLayout activeMenu="Manage Posts">
      {post ? (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <img
            src={post.postImageUrl}
            alt={post.title}
            className="w-full h-80 object-cover rounded-lg mb-4"
          />
          <h1 className="text-2xl font-semibold mb-2">{post.title}</h1>
          <p className="text-gray-700 mb-4">{post.description}</p>
          <p className="text-sm text-gray-500">
            Created By: {post.createdBy?.name || "Unknown"} on{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading post...</p>
      )}
    </DashboardLayout>
  );
};

export default AdminPostDetails;
