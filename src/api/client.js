import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend says a password change is required, redirect there —
// unless we're already on that page, to avoid a redirect loop.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;

    if (error.response?.status === 403 && data?.must_change_password) {
      if (!window.location.pathname.includes('/change-password')) {
        window.location.href = '/change-password';
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
