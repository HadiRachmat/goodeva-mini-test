import axios from 'axios';

// Base URL can be configured via Vite env: VITE_API_URL
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: response interceptor to unwrap data
http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);
