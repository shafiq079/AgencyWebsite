import Cookies from 'js-cookie';
import { authAPI } from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export const auth = {
  // Set auth token
  setToken: (token: string) => {
    Cookies.set('auth-token', token, { expires: 7, secure: true, sameSite: 'strict' });
  },

  // Get auth token
  getToken: () => {
    return Cookies.get('auth-token');
  },

  // Remove auth token
  removeToken: () => {
    Cookies.remove('auth-token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!Cookies.get('auth-token');
  },

  // Login
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      auth.setToken(token);
      return { success: true, user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // Register
  register: async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      auth.setToken(token);
      return { success: true, user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      auth.removeToken();
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await authAPI.getCurrentUser();
      return response.data.user;
    } catch (error) {
      auth.removeToken();
      return null;
    }
  },
};