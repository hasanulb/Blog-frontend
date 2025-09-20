import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";

// Admin Pages
import ManagePosts from "./pages/Admin/ManagePosts";
import CreatePost from "./pages/Admin/CreatePost";
import ManageUsers from "./pages/Admin/ManageUsers";
import AdminPostDetails from "./pages/Admin/AdminPostDetails";
import AdminEditPost from "./pages/Admin/AdminEditPost";

// User Pages
import MyPosts from "./pages/User/MyPosts";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import UserAllPosts from "./pages/User/UserAllPosts";
import UserMyPosts from "./pages/User/UserMyPosts";
import UserPostDetails from "./pages/User/UserPostDetails";
import UserEditPost from "./pages/User/UserEditPost";
import Profile from "./pages/User/Profile";

// Public Pages
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";

// Context & Routes
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";

const AppRoutes = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/post-details/:id" element={<PostDetails />} />

      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/posts" element={<ManagePosts />} />
        <Route path="/admin/create-post" element={<CreatePost />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/post/:id" element={<AdminPostDetails />} />
        <Route path="/admin/edit-post/:id" element={<AdminEditPost />} />
      </Route>

      {/* User Routes */}
      <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
        <Route path="/user/create-post" element={<CreatePost />} />
        <Route path="/user/posts" element={<MyPosts />} />
        <Route path="/user/edit-post/:id" element={<UserEditPost />} />
        <Route
          path="/user/posts/all"
          element={<UserAllPosts currentUser={user} />}
        />
        <Route
          path="/user/posts/mine"
          element={<UserMyPosts currentUser={user} />}
        />
        <Route
          path="/user/posts/:id"
          element={<UserPostDetails currentUser={user} />}
        />
        <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
        <Route path="/user/profile" element={<Profile />} />
      </Route>

      {/* Default Route */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};

// Root redirect based on role
const RootRedirect = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return user.role === "admin" ? (
    <Navigate to="/admin/posts" />
  ) : (
    <Navigate to="/user/posts" />
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </UserProvider>
  );
};

export default App;
