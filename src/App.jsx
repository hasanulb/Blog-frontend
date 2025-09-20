import React, { useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route, 
  Outlet,
  Navigate
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/SignUp';
import ManagePosts from './pages/Admin/ManagePosts';
import CreatePost from './pages/Admin/CreatePost';
import ManageUsers from './pages/Admin/ManageUsers';
import AdminPostDetails from './pages/Admin/AdminPostDetails';
import AdminEditPost from './pages/Admin/AdminEditPost'

import MyPosts from './pages/User/MyPosts';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import UserPostDetails from './pages/User/UserPostDetails';
import UserEditPost from './pages/User/UserEditPost';

import Home from './pages/Home';
import PostDetails from './pages/PostDetails';

import PrivateRoute from './routes/PrivateRoute';
import UserProvider, { UserContext } from './context/userContext';

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          <Route path="/" element={<Home />} />
        <Route path="/post-details/:id" element={<PostDetails />} />

          {/* Admin Routes*/}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
           <Route path="/admin/post/:id" element={<AdminPostDetails />} />
           <Route path='/admin/posts' element={<ManagePosts />} />
           <Route path='/admin/create-post' element={<CreatePost />} />
           <Route path='/admin/users' element={<ManageUsers />} />
           <Route path="/admin/edit-post/:id" element={<AdminEditPost />} />
          </Route>

           {/* User Routes*/}
           <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
           <Route path='/user/create-post' element={<CreatePost />} />
           <Route path='/user/posts' element={<MyPosts />} />
           <Route path="/user/edit-post/:id" element={<UserEditPost />} />
           <Route path="/user/post-details/:id" element={<UserPostDetails />} />
           <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />


          </Route>


          {/* Default Route*/}
          <Route path="/" element={<Root />} />

        </Routes>
      </Router>
    </div>

    <Toaster 
      toastOptions={{
        className:"",
        style: {
          fontSize: "13px",
        },
      }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading) return <Outlet />

  if(!user){
    return <Navigate to="/" />
  }

  return user.role === "admin" ?  <Navigate to= "/admin/posts" /> : <Navigate to= "/user/posts" />;
}
