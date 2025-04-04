import axios from 'axios';
import API_ROUTES from '../../config/api';

// Interfaz para usuario
export interface User {
  id: string;
  username: string;
  role: string;
  active?: boolean;
  lastLogin?: string;
}

// Interfaz para crear/actualizar usuario
export interface UserFormData {
  username: string;
  password: string;
  role: string;
  active?: boolean;
}

// Servicios de autenticación y gestión de usuarios
const AuthService = {
  // Login de usuario
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(API_ROUTES.AUTH_LOGIN, { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar usuario actual
  getCurrentUser: async () => {
    try {
      const response = await axios.get(API_ROUTES.AUTH_ME);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todos los usuarios (solo superadmin)
  getUsers: async () => {
    try {
      const response = await axios.get(API_ROUTES.USERS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo usuario (solo superadmin)
  createUser: async (userData: UserFormData) => {
    try {
      const response = await axios.post(API_ROUTES.USERS, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar usuario existente (solo superadmin)
  updateUser: async (userId: string, userData: UserFormData) => {
    try {
      const response = await axios.put(API_ROUTES.USER_BY_ID(userId), userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar usuario (solo superadmin)
  deleteUser: async (userId: string) => {
    try {
      const response = await axios.delete(API_ROUTES.USER_BY_ID(userId));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuthService;