import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

export const setAuthToken = (token) => {
    if (token) {
      // Apply token to every request if logged in
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Delete auth header
      delete api.defaults.headers.common['Authorization'];
    }
  };
  

export default api;