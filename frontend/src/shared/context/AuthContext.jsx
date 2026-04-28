import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  setAccessToken,
  clearAccessToken,
  setSessionExpiredHandler,
  refreshSession,
} from '../../apiClient';
import apiClient from '../../apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const logoutSession = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // If AT is expired and refresh fails, session is already dead
      return;
    }
    clearAccessToken();
    setActiveUser(null);
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearAccessToken();
      setActiveUser(null);
    });
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await refreshSession();
        setActiveUser({
          userId: data.userId,
          username: data.username,
          email: data.email,
        });
      } catch {
        setActiveUser(null);
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginSession = (userData) => {
    setAccessToken(userData.accessToken);
    setActiveUser({
      userId: userData.userId,
      username: userData.username,
      email: userData.email,
    });
  };

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
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContextValue;
};
