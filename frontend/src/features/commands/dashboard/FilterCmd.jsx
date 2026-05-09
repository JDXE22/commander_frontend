import { useReducer, useEffect } from 'react';
import { Button, CopyButton } from '../../../shared/ui/Button/Button';
import { useTrial } from '../../../shared/context/TrialContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { getCommands, searchCommands } from '../api/apiCommands';
import { sileo } from 'sileo';
import { LazyMotion, domAnimation, M, AnimatePresence } from 'motion/react';
import './FilterCmd.css';

const initialState = {
  persistentCommands: [],
  currentPage: 1,
  totalPageCount: 1,
  isLoadingCommands: false,
  pendingUpdateInput: {},
  searchQuery: '',
  searchResults: [],
  isSearching: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoadingCommands: action.payload };
    case 'SET_SEARCHING':
      return { ...state, isSearching: action.payload };
    case 'SET_DATA':
      return {
        ...state,
        persistentCommands: action.payload.commands,
        totalPageCount: action.payload.totalPages,
      };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'UPDATE_PENDING_INPUT':
      return {
        ...state,
        pendingUpdateInput: {
          ...state.pendingUpdateInput,
          ...action.payload,
        },
      };
    case 'CLEAR_PENDING_INPUT': {
      const newPending = { ...state.pendingUpdateInput };
      delete newPending[action.payload];
      return { ...state, pendingUpdateInput: newPending };
    }
    default:
      return state;
  }
}

export const FilterCmd = () => {
  const { trialCommands, updateTrialCommand } = useTrial();
  const { isAuthenticated } = useAuth();

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    isLoadingCommands: isAuthenticated,
  });
  const {
    persistentCommands,
    currentPage,
    totalPageCount,
    isLoadingCommands,
    pendingUpdateInput,
    searchQuery,
    searchResults,
    isSearching,
  } = state;

  useEffect(() => {
    if (isAuthenticated && !searchQuery) {
      const loadPersistentCommands = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const fetchResponse = await getCommands({ page: currentPage });
          if (fetchResponse && !fetchResponse.error) {
            dispatch({ type: 'SET_DATA', payload: fetchResponse });
          }
        } catch (fetchError) {
          console.error('Error loading account commands:', fetchError);
          sileo.error({
            title: "Couldn't load templates",
            description: 'Check your connection and try refreshing the page.',
            fill: '#ef4444',
            styles: {
              title: 'sileo-text-white',
              description: 'sileo-text-white',
              badge: 'sileo-badge-fill sileo-badge-fix',
            },
          });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      };
      loadPersistentCommands();
    }
  }, [isAuthenticated, currentPage, searchQuery]);

  useEffect(() => {
    const trimmedSearchQuery = searchQuery.trim();
    if (!trimmedSearchQuery) {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
      dispatch({ type: 'SET_SEARCHING', payload: false });
      return;
    }

    if (!isAuthenticated) {
      const normalizedQuery = trimmedSearchQuery.toLowerCase();
      const localMatches = trialCommands.filter((commandItem) => {
        const nameValue = commandItem?.name?.toLowerCase() || '';
        const triggerValue = commandItem?.command?.toLowerCase() || '';
        const textValue = commandItem?.text?.toLowerCase() || '';

        return (
          nameValue.includes(normalizedQuery) ||
          triggerValue.includes(normalizedQuery) ||
          textValue.includes(normalizedQuery)
        );
      });

      dispatch({ type: 'SET_SEARCH_RESULTS', payload: localMatches });
      dispatch({ type: 'SET_SEARCHING', payload: false });
      return;
    }

    const handler = setTimeout(async () => {
      dispatch({ type: 'SET_SEARCHING', payload: true });
      try {
        const response = await searchCommands({ query: searchQuery });
        if (response && !response.error) {
          dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.commands || [] });
        } else {
          dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        dispatch({ type: 'SET_SEARCHING', payload: false });
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery, isAuthenticated, trialCommands]);

  const activeCommandList = searchQuery.trim()
    ? searchResults
    : isAuthenticated
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
          description: 'sileo-text-white',
          badge: 'sileo-badge-fix',
        },
      });

      dispatch({ type: 'CLEAR_PENDING_INPUT', payload: commandId });

      if (isAuthenticated) {
        const refreshResponse = await getCommands({ page: currentPage });
        if (refreshResponse && !refreshResponse.error) {
          dispatch({ type: 'SET_DATA', payload: refreshResponse });
        }
      }
    } catch (error) {
      console.error('Update failed:', error);
      sileo.error({
        title: "Couldn't save changes",
        description: 'Try again in a moment.',
        fill: '#ef4444',
        styles: {
          title: 'sileo-text-white',
          description: 'sileo-text-white',
          badge: 'sileo-badge-fill sileo-badge-fix',
        },
      });
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <main className='main-content'>
        <h1 className='visually-hidden'>Manage Template Records</h1>
        <div className='page-container'>
          <section className='search-section'>
            <div className='terminal-status-line'>
              <div className='status-left'>
                <span className='status-indicator' />
                <span className='status-path'>~/commander/templates</span>
              </div>
              {searchQuery && (
                <div className='status-right'>
                  <span className='loader-text' style={{ fontSize: '0.75rem' }}>
                    {isSearching
                      ? 'SEARCHING...'
                      : `MATCHES: ${searchResults.length}`}
                  </span>
                </div>
              )}
            </div>

            <div className='search-bar-wrapper'>
              <label htmlFor='search-templates' className='search-prompt'>
                SEARCH &gt;
              </label>
              <input
                id='search-templates'
                type='text'
                className='search-input-field'
                placeholder='Filter by name, trigger or content...'
                value={searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                aria-label='Search templates'
              />
            </div>
          </section>

          <div className='cmd-list' aria-busy={isLoadingCommands || isSearching}>
            <AnimatePresence mode='popLayout'>
              {isLoadingCommands || (isSearching && searchQuery) ? (
                <M.div
                  key='loader'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='terminal-loader'>
                  <span className='loader-text'>
                    {isSearching
                      ? 'FILTERING_RECORDS...'
                      : 'SYNCHRONIZING_DATABASE...'}
                  </span>
                </M.div>
              ) : activeCommandList.length > 0 ? (
                activeCommandList.map((command) => {
                  const currentContent =
                    pendingUpdateInput[command._id] ?? command.text;
                  return (
                    <M.article
                      key={command._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className='card edit-card'
                      aria-labelledby={`title-${command._id}`}>
                      <div className='card-header'>
                        <div className='title-group'>
                          <h2 id={`title-${command._id}`} className='card-title'>
                            {command.name}
                          </h2>
                          {command.match && (
                            <span className='match-badge'>
                              {command.match.toUpperCase()}
                            </span>
                          )}
                        </div>
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
                            dispatch({
                              type: 'UPDATE_PENDING_INPUT',
                              payload: { [command._id]: event.target.value },
                            })
                          }
                          aria-label={`Edit description for ${command.name}`}
                        />
                        <div className='card-footer'>
                          <CopyButton textToCopy={command.text} />
                        </div>
                      </div>
                    </M.article>
                  );
                })
              ) : (
                <M.div
                  key='empty'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='terminal-empty-state'>
                  <p role='status'>
                    {searchQuery
                      ? `_ NO_MATCHES_FOUND: "${searchQuery}" yielded no results.`
                      : '_ NO_DATA_FOUND: Create a template to begin initialization.'}
                  </p>
                </M.div>
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated && totalPageCount > 1 && !searchQuery && (
            <nav className='pagination' aria-label='Pagination Navigation'>
              <button
                className='page-number'
                onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.max(1, currentPage - 1) })}
                disabled={currentPage === 1 || isLoadingCommands}>
                PREV
              </button>
              {Array.from(
                { length: totalPageCount },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: pageNumber })}
                  className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                  disabled={isLoadingCommands}>
                  {pageNumber.toString().padStart(2, '0')}
                </button>
              ))}
              <button
                className='page-number'
                onClick={() =>
                  dispatch({ type: 'SET_PAGE', payload: Math.min(totalPageCount, currentPage + 1) })
                }
                disabled={currentPage === totalPageCount || isLoadingCommands}>
                NEXT
              </button>
            </nav>
          )}
        </div>
      </main>
    </LazyMotion>
  );
};
