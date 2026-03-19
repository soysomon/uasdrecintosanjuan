export type AuthState = {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    role: string;
  } | null;
  loading: boolean;
  error: string | null;
};

// Token is no longer stored in state — it lives in an httpOnly cookie managed
// by the browser. Auth state is derived from the server's /auth/me response.
export const initialState: AuthState = {
  isAuthenticated: false,
  user:            null,
  loading:         true, // Start loading: we must verify the session cookie on mount
  error:           null,
};

type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthState['user'] } }
  | { type: 'AUTH_ERROR';   payload: string }
  | { type: 'AUTH_LOGOUT' };

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user:            action.payload.user,
        loading:         false,
        error:           null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user:            null,
        loading:         false,
        error:           action.payload,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user:            null,
        loading:         false,
        error:           null,
      };

    default:
      return state;
  }
};
