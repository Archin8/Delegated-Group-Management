import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      const { state } = JSON.parse(token);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }
  return config;
});

export default api; 