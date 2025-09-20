import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PostCard from "../../components/Cards/PostCard";


const MyPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();

  const getUserPosts = async () => {
    const response = await axiosInstance.get(API_PATHS.POSTS.GET_MEMBER_POSTS);
    setUserPosts(response.data.posts);
  };

  const handleClick = (postId) => {
    navigate(`/user/post-details/${postId}`);
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  return (
    <DashboardLayout activeMenu="My Posts">
      <div className="my-5">
        <h2 className="text-xl font-medium mb-4">My Posts</h2>

        {userPosts.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userPosts.map((item) => (
              <PostCard
                key={item._id}
                title={item.title}
                description={item.description}
                postImageUrl={item.postImageUrl}
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
