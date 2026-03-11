import { useState } from 'react';
import { getCommand } from '../features/commands/api/apiCommands';
import { Navbar } from './layout/Navbar';
import { Route, Routes } from 'react-router-dom';
import { Home } from '../features/commands/lookup/Home';
import { FilterCmd } from '../features/commands/dashboard/FilterCmd';
import { CreateCmd } from '../features/commands/create/CreateCmd';

function App() {
  const [inputText, setInputText] = useState('');
  const [commands, setCommands] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentCommands, setRecentCommands] = useState(['/log -v', '/status']);

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  const executeCommand = async (commandText) => {
    if (!commandText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const filteredCommand = await getCommand(commandText);
      
      if (filteredCommand?.error) {
        console.error('Error fetching command:', filteredCommand.message);
        return;
      }

      setCommands([filteredCommand]);

      // Update recent commands dynamically
      setRecentCommands(prev => {
        const cleaned = commandText.trim();
        // Remove if exists to move to top
        const filtered = prev.filter(c => c !== cleaned);
        // Add to top and keep max 2
        return [cleaned, ...filtered].slice(0, 2);
      });

    } catch (error) {
      console.error('Error in request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await executeCommand(inputText);
    setInputText('');
  };

  const handleRecentClick = async (cmd) => {
    await executeCommand(cmd);
  };

  const handleClear = () => {
    setCommands(null);
  };

  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={
            <Home
              handleInput={handleInput}
              inputText={inputText}
              handleFormSubmit={handleFormSubmit}
              commands={commands}
              isLoading={isLoading}
              handleClear={handleClear}
              handleRecentClick={handleRecentClick}
              recentCommands={recentCommands}
            />
          }
        />
        <Route path='/filter' element={<FilterCmd />} />
        <Route
          path='/create'
          element={<CreateCmd />}
        />
      </Routes>
    </div>
  );
}

export default App;
