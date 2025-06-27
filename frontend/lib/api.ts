import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get the base URL for images (without /api)
const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    // For production, extract the base URL from the API URL
    const url = new URL(process.env.NEXT_PUBLIC_API_URL);
    return `${url.protocol}//${url.host}`;
  }
  // For development
  return 'http://localhost:5000';
};

// Utility function to construct image URLs
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    console.log('Image URL (already full):', imagePath);
    return imagePath;
  }
  
  // Construct the full URL using the base URL
  const baseUrl = getBaseUrl();
  const fullUrl = `${baseUrl}${imagePath}`;
  
  // Debug logging
  console.log('Image URL construction:', {
    originalPath: imagePath,
    baseUrl,
    fullUrl,
    apiUrl: process.env.NEXT_PUBLIC_API_URL
  });
  
  return fullUrl;
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
    console.error('API Error:', error);
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
  getProjects: async (params?: { category?: string; featured?: boolean; limit?: number; page?: number }) => {
    try {
      const response = await api.get('/projects', { params });
      return response;
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Return empty data structure to prevent undefined errors
      return {
        data: {
          projects: [],
          total: 0,
          page: 1,
          limit: 10
        }
      };
    }
  },
  
  getProject: async (slug: string) => {
    try {
      const response = await api.get(`/projects/${slug}`);
      return response;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },
  
  // Admin endpoints
  getAllProjects: async (params?: { status?: string; category?: string; limit?: number; page?: number }) => {
    try {
      const response = await api.get('/projects/admin/all', { params });
      return response;
    } catch (error) {
      console.error('Error fetching all projects:', error);
      return {
        data: {
          projects: [],
          total: 0,
          page: 1,
          limit: 10
        }
      };
    }
  },
  
  createProject: (formData: FormData) =>
    api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateProject: (id: string, formData: FormData) =>
    api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    
  getProjectById: async (id: string) => {
    try {
      const response = await api.get(`/projects/admin/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      throw error;
    }
  },

  deleteProject: (id: string) =>
    api.delete(`/projects/${id}`),
};

export default api;