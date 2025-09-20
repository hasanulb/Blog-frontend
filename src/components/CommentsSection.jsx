// // components/CommentsSection.jsx
// import React, { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPaths";

// const CommentsSection = ({ postId, currentUser }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch comments for the post
//   const fetchComments = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(
//         API_PATHS.POSTS.GET_POST_BY_ID(postId)
//       );
//       setComments(res.data.post.comments || []);
//     } catch (err) {
//       console.error("Error fetching comments:", err);
//       setError("Failed to load comments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [postId]);

//   // Add a new comment
//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;

//     try {
//       const res = await axiosInstance.post(`/api/posts/${postId}/comments`, {
//         text: newComment,
//       });
//       setComments(res.data.post.comments);
//       setNewComment("");
//     } catch (err) {
//       console.error("Error adding comment:", err);
//       setError("Failed to add comment");
//     }
//   };

//   if (loading) return <p>Loading comments...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="mt-10">
//       <h2 className="text-xl font-semibold mb-4">Comments</h2>

//       {/* Comment Form */}
//       {currentUser && (
//         <form onSubmit={handleAddComment} className="mb-6">
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Write a comment..."
//             className="w-full border rounded-lg p-3 mb-2 focus:outline-none"
//             rows={3}
//           />
//           <button
//             type="submit"
//             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//           >
//             Add Comment
//           </button>
//         </form>
//       )}

//       {/* Comments List */}
//       <div className="space-y-4">
//         {comments.length === 0 && <p>No comments yet.</p>}
//         {comments.map((comment) => (
//           <div key={comment._id} className="border rounded-lg p-3">
//             <p className="text-gray-800">{comment.text}</p>
//             <div className="text-sm text-gray-500 mt-1">
//               By {comment.createdBy?.name || "Unknown"} ·{" "}
//               {new Date(comment.createdAt).toLocaleString()}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CommentsSection;
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8000");

const CommentsSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(
        `${API_PATHS.POSTS.GET_POST_BY_ID(postId)}`
      );
      setComments(res.data.post.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Join the post room for real-time updates
    socket.emit("joinPost", postId);

    // Listen for new comments via Socket.IO
    socket.on("receiveComment", (comment) => {
      setComments((prev) => [...prev, comment]);
    });

    return () => {
      socket.off("receiveComment");
    };
  }, [postId]);

  // Post a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axiosInstance.post(
        `${API_PATHS.POSTS.ADD_COMMENT(postId)}`,
        {
          text: newComment,
        }
      );

      // Emit new comment via Socket.IO
      socket.emit("newComment", {
        postId,
        comment: res.data.post.comments.slice(-1)[0],
      });

      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h2>

      {/* Comment input */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded-lg p-2 mb-2 focus:outline-none"
            rows={3}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="mb-4 text-gray-500">Login to post a comment</p>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="border-b pb-2">
            <p className="text-sm text-gray-600">
              {c.createdBy?.name || "Anonymous"}
            </p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
