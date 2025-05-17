import axios from 'axios';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Add a request interceptor to include JWT token in Authorization header if available
api.interceptors.request.use((config) => {
  // Get token from localStorage only if running in the browser
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
