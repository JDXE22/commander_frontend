import { createContext, useContext, useState, useCallback } from 'react';

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
  const [trialCommands, setTrialCommands] = useState(getStoredCommands);
  const [showModal, setShowModal] = useState(false);

  const trialCount = trialCommands.length;
  const canCreate = trialCount < TRIAL_MAX;

  const addTrialCommand = useCallback((command) => {
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
  }, []);

  const updateTrialCommand = useCallback((id, text) => {
    setTrialCommands((prev) => {
      const updated = prev.map((c) => (c._id === id ? { ...c, text } : c));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getTrialCommand = useCallback((trigger) => {
    const match = trialCommands.find(
      (c) => c.command.toLowerCase() === trigger.trim().toLowerCase()
    );
    if (!match) return { error: true, message: 'Command not found' };
    return { command: match.command, text: match.text, name: match.name, error: false };
  }, [trialCommands]);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <TrialContext.Provider value={{
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
