
import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const UserAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(UserContext);

  
  const [comments, setComments] = useState({});

  
  const fetchAllPosts = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.POSTS.GET_ALL_PUBLIC);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleEdit = (postId) => {
    alert(`Edit post ${postId}`);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axiosInstance.delete(`/api/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      alert("Post deleted successfully");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const commentText = comments[postId]?.trim();
    if (!commentText) {
      alert("Cannot post empty comment");
      return;
    }

    try {
      const res = await axiosInstance.post(`/api/posts/${postId}/comment`, {
        comment: commentText,
      });

     
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: [...(p.comments || []), res.data.comment] }
            : p
        )
      );

      setComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error posting comment:", err);
      alert(err.response?.data?.message || "Failed to post comment");
    }
  };

  if (loading) return <p className="text-center py-10">Loading posts...</p>;
  if (!posts.length)
    return <p className="text-center py-10">No posts found.</p>;

  return (
    <DashboardLayout activeMenu="All Blogs">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">All Users' Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => {
            const isMine = post.createdBy?._id === currentUser?._id;

            return (
              <div
                key={post._id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {post.postImageUrl && (
                  <img
                    src={post.postImageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    By {post.createdBy?.name || "Unknown"} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>

                  {isMine ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                     
                      {post.comments && post.comments.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-sm font-semibold">Comments:</h4>
                          <ul className="space-y-1 text-sm text-gray-700 max-h-24 overflow-y-auto">
                            {post.comments.map((c) => (
                              <li key={c._id}>
                                <span className="font-medium">
                                  {c.user?.name || "Anon"}:
                                </span>{" "}
                                {c.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      
                      <textarea
                        value={comments[post._id] || ""}
                        onChange={(e) =>
                          handleCommentChange(post._id, e.target.value)
                        }
                        placeholder="Write a comment..."
                        className="w-full border rounded p-2 mb-2"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Publish Comment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserAllPosts;
