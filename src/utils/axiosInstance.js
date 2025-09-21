import axios from "axios";
const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "https://blog-backend-3zfh.onrender.com",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response) {
      if (error.response.status === 401) {
        
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
