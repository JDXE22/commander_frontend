import {
  useCallback,
  useEffect,
  useSyncExternalStore,
} from 'react';
import apiClient, {
  clearAccessToken,
  setAccessToken,
} from '../api/apiClient';
import {
  AuthContext,
  initSession,
  subscribe,
  getSnapshot,
  getServerSnapshot,
  setAuth,
  initializationState,
} from './auth-context';

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
      initializationState.promise = null;
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
