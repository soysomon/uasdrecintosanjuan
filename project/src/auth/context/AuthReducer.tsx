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
    // Independientes de isAuthenticated/loading para que ProtectedRoute no desmonte el panel.
    sessionExpired: boolean;
    sessionDialogOpen: boolean;
  };

  export const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem('token'),
    sessionExpired: false,
    sessionDialogOpen: false
  };

  type AuthAction =
    | { type: 'AUTH_LOADING' }
    | { type: 'AUTH_SUCCESS'; payload: { user: any; token: string } }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'SESSION_EXPIRED' }
    | { type: 'SESSION_DIALOG_DISMISSED' }
    | { type: 'SESSION_RESTORED'; payload: { user: any; token: string } };
  
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
          error: null,
          sessionExpired: false,
          sessionDialogOpen: false
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
          error: null,
          sessionExpired: false,
          sessionDialogOpen: false
        };
      case 'SESSION_EXPIRED':
        return {
          ...state,
          sessionExpired: true,
          sessionDialogOpen: true
        };
      case 'SESSION_DIALOG_DISMISSED':
        return {
          ...state,
          sessionDialogOpen: false
        };
      case 'SESSION_RESTORED':
        return {
          ...state,
          user: action.payload.user,
          token: action.payload.token,
          error: null,
          sessionExpired: false,
          sessionDialogOpen: false
        };
      default:
        return state;
    }
  };