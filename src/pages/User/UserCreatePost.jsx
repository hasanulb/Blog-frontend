import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import uploadImage from "../../utils/uploadImage";

const UserCreatePost = () => {
  const location = useLocation();
  const { postId } = location.state || {};
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    image: null, 
  });
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleValueChange = (key, value) => {
    setPostData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () =>
    setPostData({ title: "", description: "", image: null });

 
  const createPost = async () => {
    setLoading(true);
    try {
      let imageUrl = "";
      if (postData.image) {
        const uploadRes = await uploadImage(postData.image);
        imageUrl = uploadRes.imageUrl || "";
      }

      const payload = {
        title: postData.title,
        description: postData.description,
        postImageUrl: imageUrl,
      };

      await axiosInstance.post(API_PATHS.POSTS.CREATE_POST, payload);
      toast.success("Post created successfully");
      clearData();
      navigate("/user/posts");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  
  const updatePost = async () => {
    setLoading(true);
    try {
      let imageUrl = currentPost?.postImageUrl || "";

     
      if (postData.image && postData.image instanceof File) {
        const uploadRes = await uploadImage(postData.image);
        imageUrl = uploadRes.imageUrl || "";
      }

      const payload = {
        title: postData.title,
        description: postData.description,
        postImageUrl: imageUrl,
      };

      await axiosInstance.put(API_PATHS.POSTS.UPDATE_POST(postId), payload);
      toast.success("Post updated successfully");
      navigate("/user/posts");
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

 
  const handleSubmit = () => {
    setError("");
    if (!postData.title.trim()) return setError("Title is required");
    if (!postData.description.trim())
      return setError("Description is required");
    if (!postData.image && !currentPost)
      return setError("Please upload an image");

    postId ? updatePost() : createPost();
  };

 
  const getPostDetailsByID = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.POSTS.GET_POST_BY_ID(postId)
      );
      if (res.data) {
        const postInfo = res.data;
        setCurrentPost(postInfo);
        setPostData({
          title: postInfo.title,
          description: postInfo.description,
          image: null, 
        });
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      toast.error("Failed to fetch post details");
    }
  };

  useEffect(() => {
    if (postId) getPostDetailsByID();
  }, [postId]);

  return (
    <DashboardLayout activeMenu={postId ? "Edit Post" : "Create Post"}>
      <div className="mt-5">
        <div className="form-card col-span-3">
          <h2 className="text-xl font-medium">
            {postId ? "Update Post" : "Create Post"}
          </h2>

          <div className="mt-4">
            <label className="text-xs font-medium text-slate-600">
              Post Title
            </label>
            <input
              placeholder="Enter post title"
              className="form-input"
              value={postData.title}
              onChange={({ target }) =>
                handleValueChange("title", target.value)
              }
            />
          </div>

          <div className="mt-3">
            <label className="text-xs font-medium text-slate-600">
              Description
            </label>
            <textarea
              placeholder="Enter post description"
              className="form-input"
              rows={4}
              value={postData.description}
              onChange={({ target }) =>
                handleValueChange("description", target.value)
              }
            />
          </div>

          <div className="mt-3">
            <label className="text-xs font-medium text-slate-600">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleValueChange("image", e.target.files[0])}
              className="block w-half text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />

            
            {currentPost?.postImageUrl && !postData.image && (
              <div className="mt-2">
                <img
                  src={currentPost.postImageUrl}
                  alt="Post"
                  className="w-40 rounded-lg border"
                />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}

            
            {postData.image && postData.image instanceof File && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(postData.image)}
                  alt="Preview"
                  className="w-40 rounded-lg border"
                />
                <p className="text-xs text-gray-500 mt-1">New image preview</p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
          )}

          <div className="flex justify-end mt-7">
            <button
              className="add-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {postId ? "UPDATE POST" : "CREATE POST"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserCreatePost;
