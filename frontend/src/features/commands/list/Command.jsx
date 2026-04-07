import { CopyButton } from '../../../shared/ui/Button/Button';
import "./Command.css";

export const CommandList = ({ command, className = '' }) => {
  return (
    <div className={`command-list-wrapper ${className}`}>
      {command.map((cmd) => (
        <article key={cmd._id} className='card'>
          <div className='cmd-desc'>
            {cmd.description ||
              'Executes the primary greeting macro for automated terminal responses.'}
          </div>
          <div className='code-block'>
            <span className='code-text'>
              {cmd.text}
            </span>
            <CopyButton textToCopy={cmd.text} />
          </div>
        </article>
      ))}
    </div>
  );
};
