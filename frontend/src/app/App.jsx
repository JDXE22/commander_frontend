import { useState } from 'react';
import { Navbar } from './layout/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from '../features/commands/lookup/Home';
import { FilterCmd } from '../features/commands/dashboard/FilterCmd';
import { CreateCmd } from '../features/commands/create/CreateCmd';
import { Hero } from '../features/landing/Hero';
import { Auth } from '../features/auth/Auth';
import { TrialProvider, useTrial } from '../shared/context/TrialContext';
import { AuthProvider } from '../shared/context/AuthContext';
import { TrialModal } from '../shared/ui/Modal/TrialModal';

function AppContent() {
  const [terminalInput, setTerminalInput] = useState('');
  const [activeCommands, setActiveCommands] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const currentLocation = useLocation();
  const { getTrialCommand } = useTrial();

  const handleTerminalInputChange = (event) => {
    setTerminalInput(event.target.value);
  };

  const processCommand = async (commandTrigger) => {
    if (!commandTrigger.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const commandResult = await getTrialCommand(commandTrigger);

      if (commandResult?.error) {
        console.error('Command validation failed:', commandResult.message);
        setActiveCommands(null);
        return;
      }

      setActiveCommands([commandResult]);

      setCommandHistory((prevHistory) => {
        const cleanedTrigger = commandTrigger.trim();
        const filteredHistory = prevHistory.filter((cmd) => cmd !== cleanedTrigger);
        return [cleanedTrigger, ...filteredHistory].slice(0, 2);
      });
    } catch (processError) {
      console.error('Terminal processing error:', processError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTerminalSubmit = async (event) => {
    event.preventDefault();
    await processCommand(terminalInput);
    setTerminalInput('');
  };

  const handleHistoryItemClick = async (historicalCommand) => {
    await processCommand(historicalCommand);
  };

  const handleClearTerminal = () => {
    setActiveCommands(null);
  };

  const routesWithoutNavbar = ['/', '/auth'];
  const shouldDisplayNavbar = !routesWithoutNavbar.includes(currentLocation.pathname);

  return (
    <div className={`App ${!shouldDisplayNavbar ? 'no-sidebar' : ''}`}>
      {shouldDisplayNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Hero />} />
        <Route path='/auth' element={<Auth />} />
        <Route
          path='/terminal'
          element={
            <Home
              handleInput={handleTerminalInputChange}
              inputText={terminalInput}
              handleFormSubmit={handleTerminalSubmit}
              commands={activeCommands}
              isLoading={isProcessing}
              handleClear={handleClearTerminal}
              handleRecentClick={handleHistoryItemClick}
              recentCommands={commandHistory}
            />
          }
        />
        <Route path='/filter' element={<FilterCmd />} />
        <Route path='/create' element={<CreateCmd />} />
      </Routes>
      <TrialModal />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TrialProvider>
        <AppContent />
      </TrialProvider>
    </AuthProvider>
  );
}

export default App;
