import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const Home = () => {
  const [posts, setAllPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest"); 
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; 

  
  const getPosts = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL_PUBLIC);
      setAllPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  
  const filteredPosts = posts.filter((post) => {
    const lowerSearch = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(lowerSearch) ||
      (post.createdBy?.name || "unknown").toLowerCase().includes(lowerSearch)
    );
  });

  
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white min-h-screen">
      
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <Link to="/" className="text-2xl font-bold">
            MyBlog
          </Link>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by title or author"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-full px-4 py-1 text-sm focus:outline-none"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-full px-2 py-1 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <Link to="/login" className="text-sm">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-1 rounded-full text-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-lg font-medium mb-6">Editor’s picks</h2>

        
        {currentPosts.length > 0 && (
          <Link
            to={`/post/${currentPosts[0]._id}`}
            className="grid md:grid-cols-2 gap-6 mb-10"
          >
            <img
              src={currentPosts[0].postImageUrl}
              alt={currentPosts[0].title}
              className="w-full h-72 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {currentPosts[0].title}
              </h1>
              <p className="text-gray-600 mb-3">
                {currentPosts[0].description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{currentPosts[0].createdBy?.name || "Unknown"}</span>
                <span>
                  · {new Date(currentPosts[0].createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        )}

        
        <div className="grid md:grid-cols-3 gap-6">
          {currentPosts.slice(1).map((post) => (
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

        
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-3 py-1 rounded ${
                  currentPage === num
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
