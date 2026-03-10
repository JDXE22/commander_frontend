import { CommandList } from '../list/Command';

export const Home = ({
  handleInput,
  inputText,
  handleFormSubmit,
  commands,
}) => {
  return (
    <div className='main-content'>
      <div className='search-section'>
        <h1 className='search-title'>Terminal</h1>
        <form onSubmit={handleFormSubmit} className='input-wrapper'>
          <span className='prompt-char'>$</span>
          <input
            type='text'
            value={inputText}
            onChange={handleInput}
            placeholder='/command'
            className='search-input'
          />
          <button type='submit' className='btn-primary'>
            Run
          </button>
        </form>
      </div>

      {commands && commands.length > 0 && (
        <div className='results-area'>
          <CommandList command={commands} />
        </div>
      )}

      <div className='recent-activity'>
        <span className='history-header'>RECENT COMMANDS</span>
        <div className='history-grid'>
          <div className='history-item'>
            <span className='history-icon'>$</span>
            <span className='history-text'>/log -v</span>
          </div>
          <div className='history-item'>
            <span className='history-icon'>$</span>
            <span className='history-text'>/status</span>
          </div>
        </div>
      </div>
    </div>
  );
};
