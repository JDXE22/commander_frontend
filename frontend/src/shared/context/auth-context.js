import {
  createContext,
  use,
} from 'react';
import {
  clearAccessToken,
  refreshSession,
  setSessionExpiredHandler,
} from '../api/apiClient';

export const AuthContext = createContext(null);

let authState = {
  user: null,
  loading: true,
};

export const initializationState = {
  promise: null,
};

const listeners = new Set();

export const subscribe = (onStoreChange) => {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
};

export const getSnapshot = () => authState;
export const getServerSnapshot = () => ({ user: null, loading: true });

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const setAuth = (newAuth) => {
  authState = { ...authState, ...newAuth };
  emitChange();
};

export const initSession = () => {
  if (initializationState.promise) return initializationState.promise;

  initializationState.promise = refreshSession()
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
    })
    .finally(() => {
      initializationState.promise = null;
    });

  return initializationState.promise;
};

setSessionExpiredHandler(() => {
  clearAccessToken();
  initializationState.promise = null;
  setAuth({ user: null, loading: false });
});

export const useAuth = () => {
  const authContextValue = use(AuthContext);
  if (!authContextValue) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContextValue;
};
