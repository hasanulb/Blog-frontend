import React from "react";

const UserCard = ({ userInfo }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h3 className="font-semibold text-lg">{userInfo.name}</h3>
      <p className="text-sm text-gray-500">{userInfo.email}</p>
      

      {userInfo.posts && userInfo.posts.length > 0 && (
        <ul className="mt-2 list-disc list-inside text-sm text-gray-600 max-h-32 overflow-y-auto">
          {userInfo.posts.map((post) => (
            <li key={post._id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserCard;
