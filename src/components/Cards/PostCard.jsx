
import React from "react";

const PostCard = ({ title, description, postImageUrl, createdBy, createdAt, onClick }) => {
  return (
    <div
      className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={title}
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      {createdBy && <p className="text-xs mt-2 text-gray-500">By {createdBy}</p>}
      <p className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</p>
    </div>
  );
};

export default PostCard;
