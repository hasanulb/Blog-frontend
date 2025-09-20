import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import PostCard from "../../components/Cards/PostCard";
import toast from "react-hot-toast";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchMyPosts = async () => {
    try {
      const response = await axiosInstance.get("/api/posts"); // backend filters by user
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleClick = (postId) => {
    navigate(`/user/post-details/${postId}`);
  };

  return (
    <DashboardLayout activeMenu="My Posts">
      <div className="my-5">
        <h2 className="text-xl font-medium mb-4">My Posts</h2>

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

export default MyPosts;
