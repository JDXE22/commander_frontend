import { useState, useEffect } from 'react';
import { Button, CopyButton } from '../../../shared/ui/Button/Button';
import { useTrial } from '../../../shared/context/TrialContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { getCommands } from '../api/apiCommands';
import "./FilterCmd.css";

export const FilterCmd = () => {
  const { trialCommands, updateTrialCommand } = useTrial();
  const { isAuthenticated } = useAuth();
  
  const [persistentCommands, setPersistentCommands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [isLoadingCommands, setIsLoadingCommands] = useState(false);
  const [pendingUpdateInput, setPendingUpdateInput] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      const loadPersistentCommands = async () => {
        setIsLoadingCommands(true);
        try {
          const fetchResponse = await getCommands({ page: currentPage });
          if (fetchResponse && !fetchResponse.error) {
            setPersistentCommands(fetchResponse.commands);
            setTotalPageCount(fetchResponse.totalPages);
          }
        } catch (fetchError) {
          console.error('Error loading account commands:', fetchError);
        } finally {
          setIsLoadingCommands(false);
        }
      };
      loadPersistentCommands();
    }
  }, [isAuthenticated, currentPage]);

  const activeCommandList = isAuthenticated ? persistentCommands : trialCommands;

  const handleCommandUpdate = async ({ commandId, updatedText }) => {
    await updateTrialCommand(commandId, updatedText);
    
    setPendingUpdateInput((prevPending) => {
      const nextPending = { ...prevPending };
      delete nextPending[commandId];
      return nextPending;
    });

    if (isAuthenticated) {
      const refreshResponse = await getCommands({ page: currentPage });
      if (refreshResponse && !refreshResponse.error) {
        setPersistentCommands(refreshResponse.commands);
      }
    }
  };

  return (
    <main className='main-content'>
      <div className='search-section'>
        <h1 className='search-title'>Filter all Commands</h1>
      </div>

      <div className='cmd-list' aria-busy={isLoadingCommands}>
        {isLoadingCommands ? (
          <p role='status'>Synchronizing commands...</p>
        ) : activeCommandList.length > 0 ? (
          activeCommandList.map((command) => {
            const currentContent = pendingUpdateInput[command._id] ?? command.text;
            return (
              <article
                key={command._id}
                className='card'
                aria-labelledby={`title-${command._id}`}>
                <div className='card-header'>
                  <h2 id={`title-${command._id}`} className='card-title'>
                    {command.name}
                  </h2>
                  <div className='card-actions'>
                    <Button
                      content='Update'
                      disabled={currentContent === command.text}
                      handle={() =>
                        handleCommandUpdate({ commandId: command._id, updatedText: currentContent })
                      }
                      className='btn-primary'
                    />
                  </div>
                </div>
                <div className='card-body'>
                  <span className='command-trigger'>{command.command}</span>
                  <textarea
                    className='command-text'
                    value={currentContent}
                    onChange={(event) =>
                      setPendingUpdateInput((prevPending) => ({
                        ...prevPending,
                        [command._id]: event.target.value,
                      }))
                    }
                    aria-label={`Edit description for ${command.name}`}
                  />
                  <div className='card-footer'>
                    <CopyButton textToCopy={command.text} />
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <p role='status'>
            {isAuthenticated
              ? 'No commands found in your account.'
              : 'No commands yet — go to Create to add your first one!'}
          </p>
        )}
      </div>

      {isAuthenticated && totalPageCount > 1 && (
        <nav className='pagination' aria-label='Pagination Navigation'>
          <button
            className='page-number'
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoadingCommands}>
            Prev
          </button>
          {Array.from({ length: totalPageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
              disabled={isLoadingCommands}>
              {pageNumber}
            </button>
          ))}
          <button
            className='page-number'
            onClick={() => setCurrentPage((prev) => Math.min(totalPageCount, prev + 1))}
            disabled={currentPage === totalPageCount || isLoadingCommands}>
            Next
          </button>
        </nav>
      )}
    </main>
  );
};
