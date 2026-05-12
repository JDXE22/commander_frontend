import { useState, useCallback } from 'react';
import { useAuth } from './auth-context';
import {
  getCommand,
  saveCommand,
  updateCommand,
} from '../../features/commands/api/apiCommands';
import {
  normalizeCommandTrigger,
  normalizeTrialComparison,
} from '../utils/commandUtils';
import {
  TrialContext,
  getInitialTrialCommands,
  TRIAL_MAX_COMMANDS,
  LOCAL_STORAGE_KEY,
} from './trial-context';

export const TrialProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [trialCommandList, setTrialCommandList] = useState(
    getInitialTrialCommands,
  );
  const [startedTrial, setStartedTrial] = useState(() => {
    try {
      return localStorage.getItem('commander_started_trial') === 'true';
    } catch {
      return false;
    }
  });
  const [isLimitModalVisible, setIsLimitModalVisible] = useState(false);

  const startTrial = useCallback(() => {
    setStartedTrial(true);
    try {
      localStorage.setItem('commander_started_trial', 'true');
    } catch (error) {
      console.error('Failed to persist trial start:', error);
    }
  }, []);

  const exitTrial = useCallback(() => {
    setStartedTrial(false);
    try {
      localStorage.removeItem('commander_started_trial');
    } catch (e) {
      console.error('Failed to clear trial state:', e);
    }
  }, []);

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
        isTrial: startedTrial,
        startTrial,
        exitTrial,
      }}>
      {children}
    </TrialContext.Provider>
  );
};
