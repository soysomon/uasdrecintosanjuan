import axios from 'axios';
import API_ROUTES from '../../config/api';

// Interfaz para usuario
export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string; // Puede mantenerse si aún se usa en alguna parte o para migración
  role: string;
  active?: boolean;
  lastLogin?: string;
}

// Interfaz para crear/actualizar usuario
export interface UserFormData {
  email: string;
  password: string; // Requerido para login y creación. Para actualización, se manejará en el componente.
  name?: string;
  username?: string; // Puede mantenerse si aún se usa en alguna parte o para migración
  role: string;
  active?: boolean;
}

// Servicios de autenticación y gestión de usuarios
const AuthService = {
  // Login de usuario
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(API_ROUTES.AUTH_LOGIN, { email, password });
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
  updateUser: async (userId: string, userData: Partial<UserFormData>) => {
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