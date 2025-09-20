

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import uploadImage from "../../utils/uploadImage";

const CreatePost = () => {
  const location = useLocation();
  const { postId } = location.state || {};
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [currentPost, setCurrentPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleValueChange = (key, value) => {
    setPostData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setPostData({
      title: "",
      description: "",
      image: null,
    });
  };

  // Create Post
  const createPost = async () => {
    setLoading(true);

    try {
      let imageUrl = "";

      if (postData.image) {
        const uploadRes = await uploadImage(postData.image);
        console.log("Upload response:", uploadRes);
        imageUrl = uploadRes.imageUrl || "";
      }

      const payload = {
        title: postData.title,
        description: postData.description,
        postImageUrl: imageUrl,
      };

      const response = await axiosInstance.post(API_PATHS.POSTS.CREATE_POST, payload);
      toast.success("Post created successfully");
      clearData();
      navigate("/user/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Update Post
  const updatePost = async () => {
    setLoading(true);

    try {
      let imageUrl = currentPost?.image || "";

      if (postData.image && postData.image !== currentPost.image) {
        const uploadRes = await uploadImage(postData.image);
        imageUrl = uploadRes.imageUrl || "";
      }

      const payload = {
        title: postData.title,
        description: postData.description,
        image: imageUrl,
      };

      const response = await axiosInstance.put(API_PATHS.POSTS.UPDATE_POST(postId), payload);
      toast.success("Post updated successfully");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  // Handle Submit
  const handleSubmit = async () => {
    setError(null);

    if (!postData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!postData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!postData.image) {
      setError("Please upload an image");
      return;
    }

    if (postId) {
      updatePost();
    } else {
      createPost();
    }
  };

  // Get Post by ID
  const getPostDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_POST_BY_ID(postId));

      if (response.data) {
        const postInfo = response.data;
        setCurrentPost(postInfo);
        setPostData({
          title: postInfo.title,
          description: postInfo.description,
          image: postInfo.image,
        });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(() => {
    if (postId) {
      getPostDetailsByID();
    }
  }, [postId]);

  return (
    <DashboardLayout activeMenu="Create Post">
      <div className="mt-5">
        <div className="form-card col-span-3">
          <h2 className="text-xl font-medium">
            {postId ? "Update Post" : "Create Post"}
          </h2>

          <div className="mt-4">
            <label className="text-xs font-medium text-slate-600">Post Title</label>
            <input
              placeholder="Enter post title"
              className="form-input"
              value={postData.title}
              onChange={({ target }) => handleValueChange("title", target.value)}
            />
          </div>

          <div className="mt-3">
            <label className="text-xs font-medium text-slate-600">Description</label>
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
  <label className="text-xs font-medium text-slate-600">Upload Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleValueChange("image", e.target.files[0])}
    className="block w-half text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
  />
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

export default CreatePost;

