import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const UserMyPosts = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axiosInstance.get(`${API_PATHS.POSTS.GET_BY_USER}/${currentUser._id}`);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Error fetching my posts:", err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchMyPosts();
  }, [currentUser]);

  if (loading) return <p className="text-center py-10">Loading your posts...</p>;
  if (!posts.length) return <p className="text-center py-10">You have not created any posts yet.</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/user/posts/${post._id}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={post.postImageUrl}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserMyPosts;
