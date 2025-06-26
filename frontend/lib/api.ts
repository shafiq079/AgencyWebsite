import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth-token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: { username: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
};

// Projects API
export const projectsAPI = {
  // Public endpoints
  getProjects: (params?: { category?: string; featured?: boolean; limit?: number; page?: number }) =>
    api.get('/projects', { params }),
  
  getProject: (slug: string) =>
    api.get(`/projects/${slug}`),
  
  // Admin endpoints
  getAllProjects: (params?: { status?: string; category?: string; limit?: number; page?: number }) =>
    api.get('/projects/admin/all', { params }),
  
  createProject: (formData: FormData) =>
    api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateProject: (id: string, formData: FormData) =>
    api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getProjectById: (id: string) =>
  api.get(`/projects/admin/${id}`),

  
  deleteProject: (id: string) =>
    api.delete(`/projects/${id}`),
};

export default api;