
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const Home = () => {
  const [posts, setPosts] = useState([]);

  // ✅ Fetch published posts (public)
  const getPosts = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.POSTS.GET_ALL_POSTS);
      setPosts(res.data?.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <Link to="/" className="text-2xl font-bold">MyBlog</Link>
          
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full px-4 py-1 text-sm focus:outline-none"
            />
            <Link to="/login" className="text-sm">Sign in</Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-1 rounded-full text-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-lg font-medium mb-6">Editor’s picks</h2>

        {/* Featured Post */}
        {posts.length > 0 && (
          <Link to={`/post/${posts[0]._id}`} className="grid md:grid-cols-2 gap-6 mb-10">
            <img
              src={posts[1].postImageUrl}
              alt={posts[1].title}
              className="w-full h-72 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold mb-2">{posts[1].title}</h1>
              <p className="text-gray-600 mb-3">{posts[1].description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{posts[1].createdBy?.name || "Unknown"}</span>
                <span>· {new Date(posts[1].createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Other posts grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <Link
            to={`/post-details/${post._id}`}
              key={post._id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <img
                src={post.postImageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                <p>
                  {post.description
                    ? post.description.substring(0, 100) + "..."
                    : "No description available"}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <span>{post.createdBy?.name || "Unknown"}</span>
                  <span>· {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
