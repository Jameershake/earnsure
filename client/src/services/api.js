import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🌐 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Auth APIs ====================
export const registerUser = (userData) => api.post('/auth/register', userData);
export const register = (userData) => api.post('/auth/register', userData);

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const login = (credentials) => api.post('/auth/login', credentials);

export const getProfile = () => api.get('/auth/profile');
export const getUserProfile = () => api.get('/auth/profile');

export const updateProfile = (data) => api.put('/auth/profile', data);
export const updateUserProfile = (data) => api.put('/auth/profile', data);

export const logoutUser = () => api.post('/auth/logout');
export const logout = () => api.post('/auth/logout');

// ==================== Job APIs ====================
export const getJobs = (params) => api.get('/jobs', { params });
export const fetchJobs = (params) => api.get('/jobs', { params });
export const getAllJobs = (params) => api.get('/jobs', { params });

export const getJob = (id) => api.get(`/jobs/${id}`);
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const fetchJob = (id) => api.get(`/jobs/${id}`);
export const getJobDetails = (id) => api.get(`/jobs/${id}`);

export const createJob = (jobData) => api.post('/jobs', jobData);
export const postJob = (jobData) => api.post('/jobs', jobData);

export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);
export const editJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);

export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const removeJob = (id) => api.delete(`/jobs/${id}`);

// Job Application APIs
export const applyToJob = (id, applicationData) => api.post(`/jobs/${id}/apply`, applicationData);
export const applyForJob = (id, applicationData) => api.post(`/jobs/${id}/apply`, applicationData);
export const applyJob = (id, applicationData) => api.post(`/jobs/${id}/apply`, applicationData);
export const submitApplication = (id, applicationData) => api.post(`/jobs/${id}/apply`, applicationData);

export const getJobApplications = (id) => api.get(`/jobs/${id}/applications`);
export const getApplications = (id) => api.get(`/jobs/${id}/applications`);
export const fetchApplications = (id) => api.get(`/jobs/${id}/applications`);

export const updateApplicationStatus = (jobId, applicationId, status) => 
  api.put(`/jobs/${jobId}/applications/${applicationId}`, { status });
export const updateApplication = (jobId, applicationId, status) => 
  api.put(`/jobs/${jobId}/applications/${applicationId}`, { status });

// ==================== Wage APIs ====================
export const getWages = (params) => api.get('/wages', { params });
export const fetchWages = (params) => api.get('/wages', { params });

export const getWageBenchmark = (category, location) => 
  api.get('/wages/benchmark', { params: { category, location } });
export const fetchWageBenchmark = (category, location) => 
  api.get('/wages/benchmark', { params: { category, location } });

export const createWageBenchmark = (data) => api.post('/wages', data);
export const addWageBenchmark = (data) => api.post('/wages', data);

// ==================== User APIs ====================
export const getUser = (id) => api.get(`/users/${id}`);
export const getUserById = (id) => api.get(`/users/${id}`);
export const fetchUser = (id) => api.get(`/users/${id}`);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const editUser = (id, data) => api.put(`/users/${id}`, data);

export const getUserJobs = () => api.get('/users/jobs');
export const getMyJobs = () => api.get('/users/jobs');
export const fetchUserJobs = () => api.get('/users/jobs');

export const getUserApplications = () => api.get('/users/applications');
export const getMyApplications = () => api.get('/users/applications');
export const fetchUserApplications = () => api.get('/users/applications');

export const getUserPostedJobs = () => api.get('/users/posted-jobs');
export const getPostedJobs = () => api.get('/users/posted-jobs');
export const getMyPostedJobs = () => api.get('/users/posted-jobs');

// ==================== Default Export ====================
export default api;
