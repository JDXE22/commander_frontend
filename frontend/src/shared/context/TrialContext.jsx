import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getCommand,
  saveCommand,
  updateCommand,
} from '../../features/commands/api/apiCommands';

const TRIAL_MAX = 2;
const STORAGE_KEY = 'commander_trial_commands';

const getStoredCommands = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const TrialContext = createContext(null);

export const TrialProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [trialCommands, setTrialCommands] = useState(getStoredCommands);
  const [showModal, setShowModal] = useState(false);

  const trialCount = trialCommands.length;
  const canCreate = isAuthenticated || trialCount < TRIAL_MAX;

  const addTrialCommand = useCallback(
    async (command) => {
      if (isAuthenticated) {
        const res = await saveCommand({ command });
        return res;
      } else {
        const newCommand = {
          _id: `trial_${Date.now()}`,
          command: command.command,
          name: command.name,
          text: command.text,
        };
        setTrialCommands((prev) => {
          const updated = [...prev, newCommand];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return { error: false };
      }
    },
    [isAuthenticated],
  );

  const updateTrialCommand = useCallback(
    async (id, text) => {
      if (isAuthenticated) {
        return await updateCommand({ updatedData: { text }, id });
      } else {
        setTrialCommands((prev) => {
          const updated = prev.map((c) => (c._id === id ? { ...c, text } : c));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return { error: false };
      }
    },
    [isAuthenticated],
  );

  const getTrialCommand = useCallback(
    async (trigger) => {
      if (isAuthenticated) {
        return await getCommand(trigger);
      } else {
        const match = trialCommands.find(
          (c) => c.command.toLowerCase() === trigger.trim().toLowerCase(),
        );
        if (!match) return { error: true, message: 'Command not found' };
        return {
          command: match.command,
          text: match.text,
          name: match.name,
          error: false,
        };
      }
    },
    [isAuthenticated, trialCommands],
  );

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <TrialContext.Provider
      value={{
        trialCommands,
        trialCount,
        canCreate,
        addTrialCommand,
        updateTrialCommand,
        getTrialCommand,
        showModal,
        openModal,
        closeModal,
        TRIAL_MAX,
      }}>
      {children}
    </TrialContext.Provider>
  );
};

export const useTrial = () => {
  const ctx = useContext(TrialContext);
  if (!ctx) throw new Error('useTrial must be used within TrialProvider');
  return ctx;
};
