/**
 * AuthContext — Cookie-based authentication context
 *
 * Security model:
 *   - Access token lives in an httpOnly cookie (set by the server, invisible to JS)
 *   - Refresh token lives in an httpOnly cookie scoped to /api/auth
 *   - CSRF token is fetched on mount and stored in memory (never in localStorage)
 *   - All mutating requests include X-CSRF-Token header via axios interceptor
 *   - On 401 TOKEN_EXPIRED, the interceptor calls /auth/refresh silently
 *   - localStorage is never used for any auth data
 */

import React, { createContext, useReducer, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { authReducer, initialState, AuthState } from './AuthReducer';
import API_ROUTES from '../../config/api';

interface AuthContextProps extends AuthState {
  login:        (username: string, password: string) => Promise<void>;
  logout:       () => Promise<void>;
  isSuperAdmin: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  ...initialState,
  login:        async () => {},
  logout:       async () => {},
  isSuperAdmin: false,
});

// ── Axios default: always send cookies ────────────────────────────────────────
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // CSRF token stored in memory — not in localStorage, not in a cookie readable after XSS
  const csrfToken = useRef<string>('');

  // Flag to prevent concurrent refresh calls
  const isRefreshing   = useRef(false);
  const refreshWaiters = useRef<Array<(token: string) => void>>([]);

  // ── Fetch CSRF token and attach to axios interceptor ───────────────────────
  const fetchCsrfToken = async () => {
    try {
      const { data } = await axios.get<{ csrfToken: string }>(API_ROUTES.AUTH_CSRF);
      csrfToken.current = data.csrfToken;
    } catch {
      // CSRF fetch failure is non-fatal on first load; retry happens on next request
    }
  };

  // ── Axios request interceptor: attach X-CSRF-Token header ─────────────────
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const method = config.method?.toLowerCase();
      if (method && ['post', 'put', 'delete', 'patch'].includes(method)) {
        config.headers['X-CSRF-Token'] = csrfToken.current;
      }
      return config;
    });

    // ── Axios response interceptor: silent refresh on TOKEN_EXPIRED ──────────
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<{ message: string; code?: string }>) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean };

        const isExpired =
          error.response?.status === 401 &&
          error.response?.data?.code === 'TOKEN_EXPIRED' &&
          !originalRequest?._retry;

        if (!isExpired) return Promise.reject(error);

        if (isRefreshing.current) {
          // Queue request until refresh resolves
          return new Promise((resolve) => {
            refreshWaiters.current.push(() => {
              if (originalRequest) resolve(axios(originalRequest));
            });
          });
        }

        originalRequest._retry     = true;
        isRefreshing.current       = true;

        try {
          // Re-fetch CSRF before the refresh call (token may have rotated)
          await fetchCsrfToken();

          await axios.post(API_ROUTES.AUTH_REFRESH);

          // Drain queued requests
          refreshWaiters.current.forEach((cb) => cb(''));
          refreshWaiters.current = [];

          return axios(originalRequest);
        } catch {
          // Refresh failed — session fully expired, force logout
          dispatch({ type: 'AUTH_LOGOUT' });
          refreshWaiters.current = [];
          return Promise.reject(error);
        } finally {
          isRefreshing.current = false;
        }
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // ── Verify session on mount ────────────────────────────────────────────────
  useEffect(() => {
    const initSession = async () => {
      // Fetch CSRF token first (needed for all subsequent mutations)
      await fetchCsrfToken();

      try {
        dispatch({ type: 'AUTH_LOADING' });
        const { data } = await axios.get(API_ROUTES.AUTH_ME);
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: data.user } });
      } catch {
        // No valid session — not an error, just not logged in
        dispatch({ type: 'AUTH_ERROR', payload: '' });
      }
    };

    initSession();
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = async (username: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const { data } = await axios.post(API_ROUTES.AUTH_LOGIN, { username, password });
      // After login, refresh CSRF token (server may rotate it post-auth)
      await fetchCsrfToken();
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: data.user } });
    } catch (error: unknown) {
      const msg =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        'Error al iniciar sesión';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      throw new Error(msg);
    }
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await axios.post(API_ROUTES.AUTH_LOGOUT);
    } catch {
      // Even if the request fails, clear client state
    }
    await fetchCsrfToken(); // Get fresh CSRF for post-logout state
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isSuperAdmin: state.user?.role === 'superadmin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
