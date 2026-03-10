import { CopyButton } from '../../../shared/ui/Button/Button';

export const CommandList = ({ command, className = '' }) => {
  return (
    <div className={`results-area ${className}`}>
      {command.map((cmd) => (
        <div key={cmd._id} className='card'>
          <div className='cmd-desc'>
            {cmd.description ||
              'Executes the command macro for automated terminal responses.'}
          </div>
          <div className='code-block'>
            <span
              className='code-text'
              style={{ color: 'var(--text-primary)' }}>
              {cmd.text}
            </span>
            <CopyButton textToCopy={cmd.text} />
          </div>
        </div>
      ))}
    </div>
  );
};
