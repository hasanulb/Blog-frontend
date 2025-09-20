
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PostCard from "../../components/Cards/PostCard";
import toast from "react-hot-toast";

const MyPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch posts for the logged-in user (backend handles role filtering)
  const getAllPosts = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL_POSTS);

      setAllPosts(response.data?.posts?.length > 0 ? response.data.posts : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    }
  };

  const handleClick = (postId) => {
    navigate(`/user/post-details/${postId}`);
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <DashboardLayout activeMenu="My Posts">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium ">My Posts</h2>
        </div>

        {/* ✅ Show empty state if no posts */}
        {allPosts.length === 0 ? (
          <p className="text-gray-500 mt-4">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allPosts.map((item) => (
              <PostCard
                key={item._id}
                title={item.title}
                description={item.description}
                postImageUrl={item.postImageUrl} // 🔑 backend uses description (not content)
                createdAt={item.createdAt}
                onClick={() => handleClick(item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPosts;
