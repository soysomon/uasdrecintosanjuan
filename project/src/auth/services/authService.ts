/**
 * authService.ts — HTTP client for user management operations
 *
 * Authentication (login/logout/refresh) is handled by AuthContext, not here.
 * This service handles superadmin user CRUD operations only.
 *
 * withCredentials is set globally in AuthContext (axios.defaults.withCredentials = true),
 * so all requests here automatically include auth cookies.
 * The X-CSRF-Token header is injected by the request interceptor in AuthContext.
 */

import axios from 'axios';
import API_ROUTES from '../../config/api';

export interface User {
  id: string;
  username: string;
  role: string;
  active?: boolean;
  lastLogin?: string;
}

export interface UserFormData {
  username: string;
  password: string;
  role: string;
  active?: boolean;
}

const AuthService = {
  getCurrentUser: async () => {
    const response = await axios.get(API_ROUTES.AUTH_ME);
    return response.data;
  },

  getUsers: async () => {
    const response = await axios.get(API_ROUTES.USERS);
    return response.data;
  },

  createUser: async (userData: UserFormData) => {
    const response = await axios.post(API_ROUTES.USERS, userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: Partial<UserFormData>) => {
    const response = await axios.put(API_ROUTES.USER_BY_ID(userId), userData);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await axios.delete(API_ROUTES.USER_BY_ID(userId));
    return response.data;
  },
};

export default AuthService;
