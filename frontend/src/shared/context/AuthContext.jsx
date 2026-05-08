import { createContext, use, useCallback, useEffect, useSyncExternalStore } from 'react';
import apiClient, {
  clearAccessToken,
  refreshSession,
  setAccessToken,
  setSessionExpiredHandler,
} from '../api/apiClient';

const AuthContext = createContext(null);

let authState = {
  user: null,
  loading: true,
};

let initializationPromise = null;

const listeners = new Set();

const subscribe = (onStoreChange) => {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
};

const getSnapshot = () => authState;
const getServerSnapshot = () => ({ user: null, loading: true });

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const setAuth = (newAuth) => {
  authState = { ...authState, ...newAuth };
  emitChange();
};

setSessionExpiredHandler(() => {
  clearAccessToken();
  setAuth({ user: null, loading: false });
});

const initSession = () => {
  if (initializationPromise) return initializationPromise;

  initializationPromise = refreshSession()
    .then((data) => {
      setAuth({
        user: {
          userId: data.userId,
          username: data.username,
          email: data.email,
        },
        loading: false,
      });
    })
    .catch(() => {
      setAuth({ user: null, loading: false });
    });

  return initializationPromise;
};

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    initSession();
  }, []);

  const { user, loading } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const logoutSession = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      return;
    } finally {
      clearAccessToken();
      setAuth({ user: null, loading: false });
    }
  }, []);

  const loginSession = useCallback((userData) => {
    setAccessToken(userData.accessToken);
    setAuth({
      user: {
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
      },
      loading: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginSession,
        logout: logoutSession,
        isAuthenticated: !!user,
        loading,
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
