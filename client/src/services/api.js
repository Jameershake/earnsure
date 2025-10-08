import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add token to requests
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Job APIs
export const getJobs = (params) => API.get('/jobs', { params });
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const createJob = (jobData) => API.post('/jobs', jobData);
export const applyForJob = (id) => API.post(`/jobs/${id}/apply`);

// Wage APIs
export const getWages = (params) => API.get('/wages', { params });

// User APIs
export const getProfile = () => API.get('/auth/profile');
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateProfile = (data) => API.put('/users/profile', data);

export default API;
