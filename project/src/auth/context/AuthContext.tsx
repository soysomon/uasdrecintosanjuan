import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { authReducer, initialState, AuthState } from './AuthReducer';
import API_ROUTES from '../../config/api';
import AuthService from '../services/authService'; // Import AuthService

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isSuperAdmin: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  ...initialState,
  login: async () => {}, // Signature updated
  logout: () => {},
  isSuperAdmin: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configurar el token en las solicitudes de axios
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!state.token) return;

        dispatch({ type: 'AUTH_LOADING' });
        const response = await axios.get(API_ROUTES.AUTH_ME);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user,
            token: state.token
          }
        });
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Sesión expirada. Por favor, inicia sesión de nuevo.' });
        localStorage.removeItem('token');
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => { // Signature updated
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      // Now using AuthService.login to keep API calls centralized if desired,
      // or keep the axios call here if that's the established pattern.
      // For this change, we'll assume the direct axios call was intentional here and just update the payload.
      const response = await axios.post(API_ROUTES.AUTH_LOGIN, { email, password }); // Payload updated
      const { user, token } = response.data;
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isSuperAdmin: state.user?.role === 'superadmin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};