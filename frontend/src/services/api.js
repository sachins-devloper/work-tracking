import axios from 'axios';

const API_BASE_URL = '/api';

// Auth API
export const authAPI = {
  login: (username, password) => 
    axios.post(`${API_BASE_URL}/auth/login`, { username, password })
};

// User API
export const userAPI = {
  createUser: (userData) => 
    axios.post(`${API_BASE_URL}/users`, userData),
  getAllUsers: () => 
    axios.get(`${API_BASE_URL}/admin/users`),
  getUserActivities: (userId, filters = {}) => 
    axios.get(`${API_BASE_URL}/admin/users/${userId}/activities`, { params: filters })
};

// Activity API
export const activityAPI = {
  getUserActivities: () => 
    axios.get(`${API_BASE_URL}/activities`),
  addActivity: (activityData) => 
    axios.post(`${API_BASE_URL}/activities`, activityData),
  getAllActivities: (filters = {}) => 
    axios.get(`${API_BASE_URL}/admin/activities`, { params: filters })
};

// Profile API
export const profileAPI = {
  getProfile: () => 
    axios.get(`${API_BASE_URL}/profile`),
  updateProfile: (profileData) => 
    axios.put(`${API_BASE_URL}/profile`, profileData),
  changePassword: (passwordData) => 
    axios.put(`${API_BASE_URL}/profile/password`, passwordData)
};
