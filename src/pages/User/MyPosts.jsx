
import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PostCard from "../../components/Cards/PostCard";
import { UserContext } from "../../context/userContext";

const MyPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);


  const getUserPosts = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_MEMBER_POSTS
      );
      setUserPosts(response.data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);


  const handleEdit = (postId) => {
    navigate("/user/create-post", {
      state: { postId, redirectTo: "/user/posts" },
    });
  };


  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axiosInstance.delete(`${API_PATHS.POSTS.DELETE_POST(postId)}`);
  
      setUserPosts((prev) => prev.filter((post) => post._id !== postId));
      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  return (
    <DashboardLayout activeMenu="My Posts">
      <div className="my-5">
        <h2 className="text-xl font-medium mb-4">My Posts</h2>

        {userPosts.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userPosts.map((item) => (
              <div key={item._id} className="relative">
                <PostCard
                  title={item.title}
                  description={item.description}
                  postImageUrl={item.postImageUrl}
                  createdAt={item.createdAt}
                  onClick={() => handleEdit(item._id)} 
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(item._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPosts;
