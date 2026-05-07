import {
  createContext,
  use,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import apiClient, {
  clearAccessToken,
  refreshSession,
  setAccessToken,
  setSessionExpiredHandler,
} from '../api/apiClient';

const AuthContext = createContext(null);

const initialState = {
  activeUser: null,
  isInitialLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, activeUser: action.payload };
    case 'SET_LOADING':
      return { ...state, isInitialLoading: action.payload };
    case 'INITIALIZE':
      return { ...state, activeUser: action.payload, isInitialLoading: false };
    case 'LOGOUT':
      return { ...state, activeUser: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { activeUser, isInitialLoading } = state;

  const logoutSession = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      return;
    } finally {
      clearAccessToken();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearAccessToken();
      dispatch({ type: 'LOGOUT' });
    });
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await refreshSession();
        dispatch({
          type: 'INITIALIZE',
          payload: {
            userId: data.userId,
            username: data.username,
            email: data.email,
          }
        });
      } catch {
        dispatch({ type: 'INITIALIZE', payload: null });
      }
    };

    initializeAuth();
  }, []);

  const loginSession = useCallback((userData) => {
    setAccessToken(userData.accessToken);
    dispatch({
      type: 'SET_USER',
      payload: {
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        login: loginSession,
        logout: logoutSession,
        isAuthenticated: !!activeUser,
        loading: isInitialLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = use(AuthContext);
  if (!authContextValue) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContextValue;
};
