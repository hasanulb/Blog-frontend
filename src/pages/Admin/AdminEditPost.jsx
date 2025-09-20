
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage"; // make sure you have this

const AdminEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    postImageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch post details
  const getPostDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_POST_BY_ID(id));
      const post = response.data?.post || response.data; // handle your API response structure
      setFormData({
        title: post.title || "",
        description: post.description || "",
        postImageUrl: post.postImageUrl || "",
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post details");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit updated post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.postImageUrl;

      // Upload image if a new one is selected
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        imageUrl = uploadRes.imageUrl; // returned URL from upload API
      }

      // Update post
      await axiosInstance.put(API_PATHS.POSTS.UPDATE_POST(id), {
        title: formData.title,
        description: formData.description,
        postImageUrl: imageUrl,
      });

      toast.success("Post updated successfully");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostDetails();
  }, [id]);

  return (
    <DashboardLayout activeMenu="Manage Posts">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
          </div>

          {formData.postImageUrl && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : formData.postImageUrl}
              alt="Post Preview"
              className="w-full h-64 object-cover rounded-lg mt-2"
            />
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-gray-500" : "bg-blue-600"}`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AdminEditPost;
