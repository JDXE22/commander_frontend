import { useState, useEffect } from 'react';
import { Navbar } from './layout/Navbar';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';

function NavigateWithQuery({ to }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
}
import { Home } from '../features/commands/lookup/Home';
import { FilterCmd } from '../features/commands/dashboard/FilterCmd';
import { CreateCmd } from '../features/commands/create/CreateCmd';
import { Hero } from '../features/landing/Hero';
import { Auth } from '../features/auth/Auth';
import { TrialProvider, useTrial } from '../shared/context/TrialContext';
import { AuthProvider, useAuth } from '../shared/context/AuthContext';
import { TrialModal } from '../shared/ui/Modal/TrialModal';
import { Toaster, sileo } from 'sileo';
import { setCsrfToken } from '../shared/api/apiClient';

function AppContentInner() {
  const [terminalInput, setTerminalInput] = useState('');
  const [activeCommands, setActiveCommands] = useState(() => {
    try {
      const savedActive = localStorage.getItem('commander_active_commands');
      return savedActive ? JSON.parse(savedActive) : null;
    } catch (error) {
      console.error('Failed to load active commands:', error);
      return null;
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('commander_command_history');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Failed to load command history:', error);
      return [];
    }
  });

  const currentLocation = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading, login } = useAuth();
  const { getTrialCommand } = useTrial();

  useEffect(() => {
    const params = new URLSearchParams(currentLocation.search);
    const accessToken = params.get('accessToken');
    const csrfToken = params.get('csrfToken');
    const userId = params.get('userId');
    const username = params.get('username');
    const email = params.get('email');

    if (accessToken && userId) {
      if (csrfToken) setCsrfToken(csrfToken);
      login({ accessToken, userId, username, email });
      navigate('/terminal', { replace: true });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'commander_command_history',
      JSON.stringify(commandHistory),
    );
  }, [commandHistory]);

  useEffect(() => {
    if (activeCommands) {
      localStorage.setItem(
        'commander_active_commands',
        JSON.stringify(activeCommands),
      );
    } else {
      localStorage.removeItem('commander_active_commands');
    }
  }, [activeCommands]);

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
        sileo.error({
          title: 'No match found',
          description: commandResult.message,
          fill: '#ef4444',
          styles: {
            title: 'sileo-text-white',
            description: 'sileo-text-white',
            badge: 'sileo-badge-fill sileo-badge-fix',
          },
        });
        setActiveCommands(null);
        return;
      }

      setActiveCommands([commandResult]);

      setCommandHistory((prevHistory) => {
        const cleanedTrigger = commandTrigger.trim();
        const filteredHistory = prevHistory.filter(
          (cmd) => cmd !== cleanedTrigger,
        );
        return [cleanedTrigger, ...filteredHistory].slice(0, 2);
      });
    } catch (processError) {
      console.error('Terminal processing error:', processError);
      sileo.error({
        title: 'Something went wrong',
        description: "Couldn't retrieve that template. Try again in a moment.",
        fill: '#ef4444',
        styles: {
          title: 'sileo-text-white',
          description: 'sileo-text-white',
          badge: 'sileo-badge-fill sileo-badge-fix',
        },
      });
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

  if (loading) {
    return (
      <div className='app-loading'>
        <div className='loader'></div>
        <p>Initializing Commander...</p>
      </div>
    );
  }

  const routesWithoutNavbar = ['/', '/auth'];
  const shouldDisplayNavbar = !routesWithoutNavbar.includes(
    currentLocation.pathname,
  );

  return (
    <div className='App'>
      {shouldDisplayNavbar && <Navbar />}
      <Routes>
        <Route
          path='/'
          element={
            isAuthenticated ? <Navigate to='/terminal' replace /> : <Hero />
          }
        />
        <Route
          path='/auth'
          element={
            isAuthenticated ? <Navigate to='/terminal' replace /> : <Auth />
          }
        />
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
        <Route path='/login' element={<NavigateWithQuery to='/auth' />} />
      </Routes>
      <TrialModal />
    </div>
  );
}

function AppContent() {
  return <AppContentInner />;
}

function App() {
  return (
    <AuthProvider>
      <TrialProvider>
        <AppContent />
        <Toaster position='top-right' />
      </TrialProvider>
    </AuthProvider>
  );
}

export default App;
