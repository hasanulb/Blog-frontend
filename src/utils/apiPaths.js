//  utils/apiPaths.js

// eslint-disable-next-line no-undef
export const BASE_URL = "https://blog-backend-j2ex.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // register a new user (Admi or Member)
    LOGIN: "/api/auth/login", // Authenticate user and return jwt token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users (Admin only)
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID
    CREATE_USER: "/api/users", // Create a new user (Admin only)
    UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
    DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user
  },

  POSTS: {
    GET_DASHBOARD_DATA: "/api/posts/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/posts/user-dashboard-data",
    GET_ALL_POSTS: "/api/posts",
    GET_POST_BY_ID: (postId) => `/api/posts/${postId}`, // ✅ correct
    CREATE_POST: "/api/posts",
    UPDATE_POST: (postId) => `/api/posts/${postId}`, // ✅ correct
    DELETE_POST: (id) => `/api/posts/${id}`, // ✅ correct
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", // Download all tasks as an excel
    EXPORT_USERS: "/api/reports/export/users", // Download user-task report
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
