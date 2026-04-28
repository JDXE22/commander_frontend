import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getCommand,
  saveCommand,
  updateCommand,
} from '../../features/commands/api/apiCommands';
import {
  normalizeCommandTrigger,
  normalizeTrialComparison,
} from '../utils/commandUtils';

const TRIAL_MAX_COMMANDS = 2;
const LOCAL_STORAGE_KEY = 'commander_trial_commands';

const getInitialTrialCommands = () => {
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

const TrialContext = createContext(null);

export const TrialProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [trialCommandList, setTrialCommandList] = useState(
    getInitialTrialCommands,
  );
  const [isLimitModalVisible, setIsLimitModalVisible] = useState(false);

  const trialCommandCount = trialCommandList.length;
  const isCreationAllowed =
    isAuthenticated || trialCommandCount < TRIAL_MAX_COMMANDS;

  const addTrialCommand = useCallback(
    async (newCommandData) => {
      if (isAuthenticated) {
        const apiResponse = await saveCommand({ command: newCommandData });
        return apiResponse;
      } else {
        const trialEntry = {
          _id: `trial_${Date.now()}`,
          command: normalizeCommandTrigger(newCommandData.command),
          name: newCommandData.name,
          text: newCommandData.text,
        };
        setTrialCommandList((prevList) => {
          const updatedList = [...prevList, trialEntry];
          try {
            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(updatedList),
            );
          } catch (e) {
            console.error('Failed to save to localStorage:', e);
          }
          return updatedList;
        });
        return { error: false };
      }
    },
    [isAuthenticated],
  );

  const updateTrialCommand = useCallback(
    async (commandId, updatedContent) => {
      if (isAuthenticated) {
        return await updateCommand({
          updatedData: { text: updatedContent },
          id: commandId,
        });
      } else {
        setTrialCommandList((prevList) => {
          const updatedList = prevList.map((cmd) =>
            cmd._id === commandId ? { ...cmd, text: updatedContent } : cmd,
          );
          try {
            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(updatedList),
            );
          } catch (e) {
            console.error('Failed to update localStorage:', e);
          }
          return updatedList;
        });
        return { error: false };
      }
    },
    [isAuthenticated],
  );

  const getTrialCommand = useCallback(
    async (commandTrigger) => {
      if (isAuthenticated) {
        return await getCommand(commandTrigger);
      } else {
        const requestedTrigger = normalizeTrialComparison(commandTrigger);
        const matchedCommand = trialCommandList.find(
          (cmd) => normalizeTrialComparison(cmd.command) === requestedTrigger,
        );
        if (!matchedCommand)
          return { error: true, message: 'Command not found' };
        return {
          command: matchedCommand.command,
          text: matchedCommand.text,
          name: matchedCommand.name,
          error: false,
        };
      }
    },
    [isAuthenticated, trialCommandList],
  );

  const showLimitModal = useCallback(() => setIsLimitModalVisible(true), []);
  const hideLimitModal = useCallback(() => setIsLimitModalVisible(false), []);

  return (
    <TrialContext.Provider
      value={{
        trialCommands: trialCommandList,
        trialCount: trialCommandCount,
        canCreate: isCreationAllowed,
        addTrialCommand,
        updateTrialCommand,
        getTrialCommand,
        showModal: isLimitModalVisible,
        openModal: showLimitModal,
        closeModal: hideLimitModal,
        TRIAL_MAX: TRIAL_MAX_COMMANDS,
      }}>
      {children}
    </TrialContext.Provider>
  );
};

export const useTrial = () => {
  const trialContextValue = useContext(TrialContext);
  if (!trialContextValue)
    throw new Error('useTrial must be used within TrialProvider');
  return trialContextValue;
};
