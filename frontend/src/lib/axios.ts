import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return standard error shape even on failures so components can display messages
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
