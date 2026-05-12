import { createContext, use } from 'react';

export const TRIAL_MAX_COMMANDS = 2;
export const LOCAL_STORAGE_KEY = 'commander_trial_commands:v1';

export const getInitialTrialCommands = () => {
  try {
    const storedCommands = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedCommands ? JSON.parse(storedCommands) : [];
  } catch (initializationError) {
    console.error(
      'Failed to load trial commands from storage:',
      initializationError,
    );
    return [];
  }
};

export const TrialContext = createContext(null);

export const useTrial = () => {
  const trialContextValue = use(TrialContext);
  if (!trialContextValue)
    throw new Error('useTrial must be used within TrialProvider');
  return trialContextValue;
};
