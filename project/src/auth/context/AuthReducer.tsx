export type AuthState = {
    isAuthenticated: boolean;
    user: {
      id: string;
      username: string;
      role: string;
    } | null;
    loading: boolean;
    error: string | null;
    token: string | null;
  };
  
  export const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem('token')
  };
  
  type AuthAction =
    | { type: 'AUTH_LOADING' }
    | { type: 'AUTH_SUCCESS'; payload: { user: any; token: string } }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'AUTH_LOGOUT' };
  
  export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case 'AUTH_LOADING':
        return {
          ...state,
          loading: true,
          error: null
        };
      case 'AUTH_SUCCESS':
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          loading: false,
          error: null
        };
      case 'AUTH_ERROR':
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          loading: false,
          error: action.payload
        };
      case 'AUTH_LOGOUT':
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null
        };
      default:
        return state;
    }
  };