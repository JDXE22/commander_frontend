import { useEffect, useState } from 'react';
import { getCommands, updateCommand } from '../api/apiCommands';
import { Button, CopyButton } from '../../../shared/ui/Button/Button';

export const FilterCmd = () => {
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatedInput, setUpdatedInput] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCommands = async () => {
    setLoading(true);
    try {
      const commands = await getCommands({ page });
      if (commands) {
        setFilteredCommands(commands.commands);
        setTotalPages(commands.totalPages);
      } else {
        setFilteredCommands([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching commands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, [page]);

  const handlePageChange = (delta) => {
    setPage((p) => {
      const next = p + delta;
      return next < 1 || next > totalPages ? p : next;
    });
  };

  const handleUpdate = async ({ id, updatedData }) => {
    await updateCommand({ updatedData, id });
    setUpdatedInput((prev) => {
      const newInput = { ...prev };
      delete newInput[id];
      return newInput;
    });
    fetchCommands();
  };

  return (
    <main className='main-content cmd-list-view'>
      <div className='search-section' style={{ marginBottom: '32px' }}>
        <h1 className='search-title'>Filter all Commands</h1>
      </div>

      <div className='cmd-list' aria-busy={loading}>
        {loading ? (
          <p role="status">Loading commands...</p>
        ) : filteredCommands.length > 0 ? (
          filteredCommands.map((command) => {
            const currentText = updatedInput[command._id] ?? command.text;
            return (
              <article key={command._id} className='card' aria-labelledby={`title-${command._id}`}>
                <div className='entry-header'>
                  <span id={`title-${command._id}`} className='entry-title'>{command.command}</span>
                  <div className='entry-buttons'>
                    <CopyButton textToCopy={command.text} />
                    <Button
                      content='Update'
                      disabled={currentText === command.text}
                      handle={() =>
                        handleUpdate({
                          id: command._id,
                          updatedData: { text: currentText },
                        })
                      }
                      className='btn-primary'
                    />
                  </div>
                </div>
                <div className='entry-edit'>
                  <textarea
                    rows={4}
                    value={currentText}
                    onChange={(e) =>
                      setUpdatedInput((prev) => ({
                        ...prev,
                        [command._id]: e.target.value,
                      }))
                    }
                    className='entry-textarea'
                    placeholder="Enter the command response..."
                    aria-label={`Edit response for command ${command.command}`}
                  />
                </div>
              </article>
            );
          })
        ) : (
          <p role="status">No commands found</p>
        )}
      </div>

      <nav className='pagination' aria-label="Pagination Navigation">
        <button 
          className='page-number' 
          onClick={() => handlePageChange(-1)}
          disabled={page === 1 || loading}
          aria-label="Go to previous page"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => setPage(number)}
            className={`page-number ${page === number ? 'active' : ''}`}
            disabled={loading}
            aria-label={`Go to page ${number}`}
            aria-current={page === number ? 'page' : undefined}
          >
            {number}
          </button>
        ))}
        <button 
          className='page-number' 
          onClick={() => handlePageChange(1)}
          disabled={page === totalPages || loading}
          aria-label="Go to next page"
        >
          Next
        </button>
      </nav>
    </main>
  );
};
