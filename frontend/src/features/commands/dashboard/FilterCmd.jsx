import { useState, useEffect } from 'react';
import { Button, CopyButton } from '../../../shared/ui/Button/Button';
import { useTrial } from '../../../shared/context/TrialContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { getCommands } from '../api/apiCommands';

export const FilterCmd = () => {
  const { trialCommands, updateTrialCommand } = useTrial();
  const { isAuthenticated } = useAuth();
  const [apiCommands, setApiCommands] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updatedInput, setUpdatedInput] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      const fetchApiCommands = async () => {
        setLoading(true);
        try {
          const res = await getCommands({ page });
          if (res && !res.error) {
            setApiCommands(res.commands);
            setTotalPages(res.totalPages);
          }
        } catch (err) {
          console.error('Error fetching API commands:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchApiCommands();
    }
  }, [isAuthenticated, page]);

  const displayCommands = isAuthenticated ? apiCommands : trialCommands;

  const handleUpdate = async ({ id, text }) => {
    await updateTrialCommand(id, text);
    setUpdatedInput((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (isAuthenticated) {
      const res = await getCommands({ page });
      if (res && !res.error) {
        setApiCommands(res.commands);
      }
    }
  };

  return (
    <main className='main-content'>
      <div className='page-container'>
      <div className='search-section'>
        <h1 className='search-title'>Filter all Commands</h1>
      </div>

      <div className='cmd-list' aria-busy={loading}>
        {loading ? (
          <p role='status'>Loading commands...</p>
        ) : displayCommands.length > 0 ? (
          displayCommands.map((command) => {
            const currentText = updatedInput[command._id] ?? command.text;
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
                      disabled={currentText === command.text}
                      handle={() =>
                        handleUpdate({ id: command._id, text: currentText })
                      }
                      className='btn-primary'
                    />
                  </div>
                </div>
                <div className='card-body'>
                  <span className='command-trigger'>{command.command}</span>
                  <textarea
                    className='command-text'
                    value={currentText}
                    onChange={(e) =>
                      setUpdatedInput((prev) => ({
                        ...prev,
                        [command._id]: e.target.value,
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

      {isAuthenticated && totalPages > 1 && (
        <nav className='pagination' aria-label='Pagination Navigation'>
          <button
            className='page-number'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}>
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => setPage(number)}
              className={`page-number ${page === number ? 'active' : ''}`}
              disabled={loading}>
              {number}
            </button>
          ))}
          <button
            className='page-number'
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}>
            Next
          </button>
        </nav>
      )}
      </div>
    </main>
  );
};
