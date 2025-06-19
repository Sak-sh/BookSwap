import axios from "axios";

const API_URL = "https://bookswap-mi28.onrender.com/api/protected-route";

const getToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
