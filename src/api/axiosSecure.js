import axios from 'axios';

// Every private request goes through this instance so the token
// and 401/403 handling only have to be written once.
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem('access-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect - let the component handle auth errors
    // This prevents infinite loops during initial auth setup
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Auth error intercepted:', error.response?.status);
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
