import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  getUserProfile: (userId) => api.get(`/auth/user/${userId}`),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  uploadProfilePicture: (formData) => api.post('/auth/upload-profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  sendEmailVerificationOTP: (data) => api.post('/auth/send-verification-otp', data),
  verifyEmailOTP: (data) => api.post('/auth/verify-email-otp', data),
};

// Posts API calls
export const postsAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getUserPosts: (userId, params) => api.get(`/posts/user/${userId}`, { params }),
  getCategories: () => api.get('/posts/categories'),
};

// Comments API calls
export const commentsAPI = {
  getComments: (postId) => api.get(`/comments/${postId}`),
  createComment: (postId, commentData) => api.post(`/comments/${postId}`, commentData),
  updateComment: (commentId, commentData) => api.put(`/comments/${commentId}`, commentData),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  likeComment: (commentId) => api.post(`/comments/${commentId}/like`),
  getCommentThread: (commentId) => api.get(`/comments/thread/${commentId}`),
};

// Likes API calls
export const likesAPI = {
  toggleLike: (targetId, targetType) => api.post(`/likes/${targetId}/${targetType}`),
  getLikes: (targetId, targetType, params) => api.get(`/likes/${targetId}/${targetType}`, { params }),
  checkUserLike: (targetId, targetType) => api.get(`/likes/check/${targetId}/${targetType}`),
};

export default api;
