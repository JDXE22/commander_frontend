import { useState, useEffect } from 'react';
import { Button, CopyButton } from '../../../shared/ui/Button/Button';
import { useTrial } from '../../../shared/context/TrialContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { getCommands } from '../api/apiCommands';
import { sileo } from 'sileo';
import './FilterCmd.css';

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
          sileo.error({
            title: "Couldn't load templates",
            description: 'Check your connection and try refreshing the page.',
            fill: '#ef4444',
          });
        } finally {
          setIsLoadingCommands(false);
        }
      };
      loadPersistentCommands();
    }
  }, [isAuthenticated, currentPage]);

  const activeCommandList = isAuthenticated
    ? persistentCommands
    : trialCommands;

  const handleCommandUpdate = async ({ commandId, updatedText }) => {
    try {
      await updateTrialCommand(commandId, updatedText);
      sileo.success({
        title: 'Changes saved',
        description: 'Your template has been updated.',
        fill: '#171717',
        styles: {
          title: 'sileo-text-white',
          description: 'sileo-text-white',
          badge: 'sileo-badge-fix',
        },
      });

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
    } catch (error) {
      console.error('Update failed:', error);
      sileo.error({
        title: "Couldn't save changes",
        description: 'Try again in a moment.',
        fill: '#ef4444',
      });
    }
  };

  return (
    <main className='main-content'>
      <div className='page-container'>
        <section className='search-section'>
          <div className='terminal-status-line'>
            <div className='status-left'>
              <span className='status-indicator' />
              <span className='status-path'>~/commander/templates</span>
            </div>
          </div>
        </section>

        <div className='cmd-list' aria-busy={isLoadingCommands}>
          {isLoadingCommands ? (
            <div className='terminal-loader'>
              <span className='loader-text'>SYNCHRONIZING_DATABASE...</span>
            </div>
          ) : activeCommandList.length > 0 ? (
            activeCommandList.map((command) => {
              const currentContent =
                pendingUpdateInput[command._id] ?? command.text;
              return (
                <article
                  key={command._id}
                  className='card edit-card'
                  aria-labelledby={`title-${command._id}`}>
                  <div className='card-header'>
                    <h2 id={`title-${command._id}`} className='card-title'>
                      {command.name}
                    </h2>
                    <div className='card-actions'>
                      <Button
                        content='UPDATE'
                        disabled={currentContent === command.text}
                        handle={() =>
                          handleCommandUpdate({
                            commandId: command._id,
                            updatedText: currentContent,
                          })
                        }
                        className='btn-primary sm'
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
            <div className='terminal-empty-state'>
              <p role='status'>
                _ NO_DATA_FOUND: Create a template to begin initialization.
              </p>
            </div>
          )}
        </div>

        {isAuthenticated && totalPageCount > 1 && (
          <nav className='pagination' aria-label='Pagination Navigation'>
            <button
              className='page-number'
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoadingCommands}>
              PREV
            </button>
            {Array.from(
              { length: totalPageCount },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                disabled={isLoadingCommands}>
                {pageNumber.toString().padStart(2, '0')}
              </button>
            ))}
            <button
              className='page-number'
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPageCount, prev + 1))
              }
              disabled={currentPage === totalPageCount || isLoadingCommands}>
              NEXT
            </button>
          </nav>
        )}
      </div>
    </main>
  );
};
