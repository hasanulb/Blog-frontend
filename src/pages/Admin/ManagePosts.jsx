import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import PostCard from "../../components/Cards/PostCard";
import toast from "react-hot-toast";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/api/posts"); // backend filters by role
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleClick = (postId) => {
    navigate(`/admin/post/${postId}`);
  };

  return (
    <DashboardLayout activeMenu="Manage Posts">
      <div className="my-5">
        <h2 className="text-xl font-medium mb-4">All Posts</h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                title={post.title}
                description={post.description}
                postImageUrl={post.postImageUrl}
                createdBy={post.createdBy?.name}
                createdAt={post.createdAt}
                onClick={() => handleClick(post._id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPosts;
