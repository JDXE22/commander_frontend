import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'commander_user',
  TOKEN: 'commander_token',
};

export const AuthProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const cachedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (cachedUser) {
          setActiveUser(JSON.parse(cachedUser));
        }
      } catch (cacheError) {
        console.error('Failed to parse cached user:', cacheError);
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginSession = (userData) => {
    setActiveUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.TOKEN, userData.token);
  };

  const logoutSession = () => {
    setActiveUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  const isUserAuthenticated = !!activeUser;

  return (
    <AuthContext.Provider value={{ 
      user: activeUser, 
      login: loginSession, 
      logout: logoutSession, 
      isAuthenticated: isUserAuthenticated, 
      loading: isInitialLoading 
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
