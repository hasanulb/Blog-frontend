import React from "react";

const PostCard = ({
  title,
  description,
  postImageUrl,
  createdAt,
  onClick,
  actionButtons,
}) => {
  return (
    <div
      onClick={onClick}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {description && <p className="text-gray-700 mb-2">{description}</p>}
        <p className="text-gray-600 text-sm">
          {new Date(createdAt).toLocaleDateString()}
        </p>
        {actionButtons && (
          <div className="mt-2 flex gap-2">{actionButtons}</div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
