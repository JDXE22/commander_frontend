import { CommandList } from '../list/Command';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const hasCommands = commands && commands.length > 0;
  const hasHistory = recentCommands && recentCommands.length > 0;
  const isFirstTime = !hasCommands && !hasHistory;

  return (
    <main className='main-content'>
      <h1 className='visually-hidden'>Terminal Command Center</h1>
      <div className='page-container'>
        <section className='search-section' aria-label='Command Input'>
          <div className='terminal-status-line'>
            <div className='status-left'>
              <span className='status-indicator' />
              <span className='status-path'>~/commander/terminal</span>
            </div>
            {hasCommands && (
              <button
                type='button'
                onClick={handleClear}
                className='btn-clear'
                aria-label='Clear terminal results'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <polyline points='3 6 5 6 21 6' />
                  <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
                </svg>
                <span>Clear</span>
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
              placeholder='Type a trigger (e.g. /h1)'
              className='search-input'
              aria-label='Terminal command input'
              autoComplete='off'
              maxLength={80}
              autoFocus
            />
            <button
              type='submit'
              className='btn-primary'
              disabled={isLoading || !inputText.trim()}
              aria-label='Execute command'>
              {isLoading ? '...' : 'EXECUTE'}
            </button>
          </form>
        </section>

        {hasCommands && (
          <section className='results-area' aria-label='Command results'>
            <CommandList command={commands} />
          </section>
        )}

        {isFirstTime && (
          <section className='welcome-state' aria-label='Getting started'>
            <div className='welcome-content'>
              <div className='terminal-login-header'>
                <span className='login-text'>COMMANDER(8) System Manager COMMANDER(8)</span>
                <span className='login-date'>{new Date().toLocaleDateString()}</span>
              </div>
              <div className='welcome-body'>
                <motion.p 
                  className='welcome-intro'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {">"} Welcome to Commander. Initialization complete. 
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    _
                  </motion.span>
                </motion.p>
                <motion.div 
                  className='usage-box'
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className='usage-label'>SYSTEM_USAGE:</span>
                  <div className='usage-steps'>
                    <div className='usage-step'>1. CREATE → Define raw payload string</div>
                    <div className='usage-step'>2. RUN    → Execute trigger retrieval</div>
                    <div className='usage-step'>3. COPY   → Update local clipboard</div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Link to='/create' className='welcome-cta'>
                    INITIALIZE_FIRST_TEMPLATE
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {!isFirstTime && (
          <section className='recent-activity' aria-labelledby='recent-header'>
            <div className='history-section-header'>
              <span id='recent-header' className='history-header'>
                RECENT_COMMANDS
              </span>
              <div className='header-line' />
            </div>
            {hasHistory ? (
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
                      λ
                    </span>
                    <span className='history-text'>{cmd}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className='history-empty'>
                _ No previous execution data found.
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
};
