
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PostCard from "../../components/Cards/PostCard"; // ✅ create this similar to TaskCard

const AdminPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const navigate = useNavigate();

  const getAllPosts = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL_POSTS);
console.log("API response:", response.data);

      setAllPosts(response.data?.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleClick = (postData) => {
    navigate(`/admin/post/${postData._id}`);
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <DashboardLayout activeMenu="Manage Posts">
      <div className="my-5">
        <h2 className="text-xl md:text-xl font-medium mb-4">All Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allPosts.length > 0 ? (
            allPosts.map((item) => (
              <PostCard
                key={item._id}
                title={item.title}
                description={item.description}
                postImageUrl={item.postImageUrl}
                createdBy={item.createdBy?.name}
                createdAt={item.createdAt}
                onClick={() => handleClick(item)}
              />
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPosts;
