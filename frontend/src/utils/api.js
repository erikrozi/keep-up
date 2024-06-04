import axios from 'axios';
import { supabase } from './supabase';


const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
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
  
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;