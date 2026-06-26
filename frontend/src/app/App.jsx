import { useState, useEffect, useCallback } from 'react';
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
import { Settings } from '../features/settings/Settings';
import { AuthProvider, useAuth, TrialProvider, useTrial } from '../shared/context';
import { TrialModal } from '../shared/ui/Modal/TrialModal';
import { Toaster, sileo } from 'sileo';
import { setCsrfToken } from '../shared/api/apiClient';

const STORAGE_KEYS = {
  HISTORY: 'commander_command_history:v1',
  ACTIVE: 'commander_active_commands:v1',
};

function AppContentInner() {
  const [terminalInput, setTerminalInput] = useState('');
  const [activeCommands, setActiveCommands] = useState(() => {
    try {
      const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE);
      return savedActive ? JSON.parse(savedActive) : null;
    } catch (error) {
      console.error('Failed to load active commands:', error);
      return null;
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Failed to load command history:', error);
      return [];
    }
  });

  const currentLocation = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading, login } = useAuth();
  const { getTrialCommand, isTrial, exitTrial } = useTrial();

  useEffect(() => {
    if (loading) return;

    const publicRoutes = ['/', '/auth'];
    const isPublicRoute = publicRoutes.includes(currentLocation.pathname);

    if (!isAuthenticated && !isTrial && !isPublicRoute) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isTrial, loading, currentLocation.pathname, navigate]);

  useEffect(() => {
    if (loading || isAuthenticated) return;

    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get('accessToken');
    const csrfToken = params.get('csrfToken');
    const userId = params.get('userId');
    const username = params.get('username');
    const email = params.get('email');

    if (accessToken && userId) {
      if (csrfToken) setCsrfToken(csrfToken);
      login({ accessToken, userId, username, email });
      exitTrial();
      navigate('/terminal', { replace: true });
    }
  }, [loading, isAuthenticated, login, navigate, setCsrfToken, exitTrial]);

  const updateActiveCommands = useCallback((commands) => {
    setActiveCommands(commands);
    if (commands) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE, JSON.stringify(commands));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE);
    }
  }, []);

  const updateHistory = useCallback((history) => {
    setCommandHistory(history);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, []);

  const handleTerminalInputChange = (event) => {
    setTerminalInput(event.target.value);
  };

  const processCommand = async (commandTrigger) => {
    if (!commandTrigger.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const commandResult = await getTrialCommand(commandTrigger);

      if (commandResult?.error) {
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
        updateActiveCommands(null);
        return;
      }

      updateActiveCommands([commandResult]);

      const cleanedTrigger = commandTrigger.trim();
      const filteredHistory = commandHistory.filter((cmd) => cmd !== cleanedTrigger);
      const newHistory = [cleanedTrigger, ...filteredHistory].slice(0, 2);
      updateHistory(newHistory);

      } catch {
      sileo.error({

        title: 'Something went wrong',
        description: "Couldn't retrieve that template.",
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
    updateActiveCommands(null);
  };

  if (loading) {
    return (
      <div className='app-loading' suppressHydrationWarning>
        <div className='loader'></div>
        <p>Initializing Commander…</p>
      </div>
    );
  }

  const routesWithoutNavbar = ['/', '/auth'];
  const shouldDisplayNavbar = !routesWithoutNavbar.includes(currentLocation.pathname);

  return (
    <div className='App'>
      {shouldDisplayNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={isAuthenticated ? <Navigate to='/terminal' replace /> : <Hero />} />
        <Route path='/auth' element={isAuthenticated ? <Navigate to='/terminal' replace /> : <Auth />} />
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
        <Route path='/settings' element={<Settings />} />
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
