import React, { createContext, useReducer, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { authReducer, initialState, AuthState } from './AuthReducer';
import API_ROUTES from '../../config/api';
import SessionExpiredDialog from '../components/SessionExpiredDialog';

interface AuthContextProps extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isSuperAdmin: boolean;
  reauthenticate: (password: string) => Promise<void>;
  notifySessionExpired: () => void;
  dismissSessionDialog: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  ...initialState,
  login: async () => {},
  logout: () => {},
  isSuperAdmin: false,
  reauthenticate: async () => {},
  notifySessionExpired: () => {},
  dismissSessionDialog: () => {}
});

export const isSessionInvalidResponse = (status?: number, data?: any) =>
  status === 401 && data?.code === 'SESSION_INVALID';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Refs para que el interceptor (registrado una sola vez) lea el estado vigente
  // y para deduplicar varios 401 que llegan antes del siguiente render.
  const isAuthenticatedRef = useRef(state.isAuthenticated);
  const dialogOpenRef = useRef(state.sessionDialogOpen);
  isAuthenticatedRef.current = state.isAuthenticated;
  dialogOpenRef.current = state.sessionDialogOpen;

  const notifySessionExpired = useCallback(() => {
    if (!isAuthenticatedRef.current || dialogOpenRef.current) return;
    dialogOpenRef.current = true;
    dispatch({ type: 'SESSION_EXPIRED' });
  }, []);

  const dismissSessionDialog = useCallback(() => {
    dialogOpenRef.current = false;
    dispatch({ type: 'SESSION_DIALOG_DISMISSED' });
  }, []);

  // Solo abre el aviso; siempre rechaza para que el catch/finally de cada formulario corra igual que antes.
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isSessionInvalidResponse(error.response?.status, error.response?.data)) {
          notifySessionExpired();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [notifySessionExpired]);

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

  const login = async (username: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const response = await axios.post(API_ROUTES.AUTH_LOGIN, { username, password });
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

  // No usa login(): AUTH_LOADING/AUTH_ERROR harían que ProtectedRoute desmonte el panel.
  const reauthenticate = async (password: string) => {
    const username = state.user?.username;
    if (!username) throw new Error('No hay un usuario activo para reautenticar.');

    try {
      const response = await axios.post(API_ROUTES.AUTH_LOGIN, { username, password });
      const { user, token } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      dialogOpenRef.current = false;
      dispatch({ type: 'SESSION_RESTORED', payload: { user, token } });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'No se pudo iniciar sesión. Intenta de nuevo.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isSuperAdmin: state.user?.role === 'superadmin',
        reauthenticate,
        notifySessionExpired,
        dismissSessionDialog
      }}
    >
      {children}
      <SessionExpiredDialog
        expired={state.sessionExpired}
        open={state.sessionDialogOpen}
        username={state.user?.username ?? ''}
        onReauthenticate={reauthenticate}
        onDismiss={dismissSessionDialog}
        onReopen={() => { dialogOpenRef.current = true; dispatch({ type: 'SESSION_EXPIRED' }); }}
      />
    </AuthContext.Provider>
  );
};