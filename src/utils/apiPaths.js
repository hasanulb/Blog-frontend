//  utils/apiPaths.js

// eslint-disable-next-line no-undef
export const BASE_URL = "https://blog-backend-3zfh.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // register a new user (Admi or Member)
    LOGIN: "/api/auth/login", // Authenticate user and return jwt token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    UPDATE_PROFILE: "/api/auth/profile",
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users (Admin only)
    GET_BY_USER: (userId) => `/api/posts/user/${userId}`, // Get user by ID
    CREATE_USER: "/api/users", // Create a new user (Admin only)
    UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
    DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user
  },

  POSTS: {
    GET_ADMIN_POSTS: "/api/posts/admin",
    GET_MEMBER_POSTS: "/api/posts/member",
    GET_ALL_PUBLIC: "/api/posts/public",
    GET_POST_BY_ID: (postId) => `/api/posts/${postId}`,
    GET_MY_POSTS: (userId) => `${BASE_URL}/posts/${userId}`,
    CREATE_POST: "/api/posts",
    UPDATE_POST: (postId) => `/api/posts/${postId}`,
    DELETE_POST: (id) => `/api/posts/${id}`,
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
