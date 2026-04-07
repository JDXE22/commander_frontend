import { CommandList } from '../list/Command';
import "./Home.css";

export const Home = ({
  handleInput,
  inputText,
  handleFormSubmit,
  commands,
  isLoading,
  handleClear,
  handleRecentClick,
  recentCommands,
}) => {
  return (
    <main className='main-content'>
      <div className='page-container'>
        <section className='search-section' aria-labelledby='terminal-title'>
          <div className='terminal-header'>
            <h1 id='terminal-title' className='search-title'>
              Terminal
            </h1>
            {commands && commands.length > 0 && (
              <button
                type='button'
                onClick={handleClear}
                className='btn-clear'
                aria-label='Clear terminal results'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <polyline points='3 6 5 6 21 6' />
                  <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
                </svg>
                Clear
              </button>
            )}
          </div>
          <form
            onSubmit={handleFormSubmit}
            className='input-wrapper'
            role='search'>
            <span className='prompt-char' aria-hidden='true'>
              $
            </span>
            <input
              type='text'
              value={inputText}
              onChange={handleInput}
              placeholder='Type a command (e.g. /h1)'
              className='search-input'
              aria-label='Terminal command input'
              autoComplete='off'
              autoFocus
            />
            <button
              type='submit'
              className='btn-primary'
              disabled={isLoading || !inputText.trim()}
              aria-label='Execute command'>
              {isLoading ? '...' : 'Run'}
            </button>
          </form>
        </section>

        {commands && commands.length > 0 && (
          <section className='results-area' aria-label='Command results'>
            <CommandList command={commands} />
          </section>
        )}

        <section className='recent-activity' aria-labelledby='recent-header'>
          <span id='recent-header' className='history-header'>
            RECENT COMMANDS
          </span>
          <div
            className='history-grid'
            role='group'
            aria-label='Recent command history'>
            {recentCommands.map((cmd, index) => (
              <button
                key={`${cmd}-${index}`}
                className='history-item'
                onClick={() => handleRecentClick(cmd)}
                aria-label={`Run recent command: ${cmd}`}>
                <span className='history-icon' aria-hidden='true'>
                  $
                </span>
                <span className='history-text'>{cmd}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
