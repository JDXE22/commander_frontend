import { CopyButton } from '../../../shared/ui/Button/Button';
import "./Command.css";

export const CommandList = ({ command, className = '' }) => {
  return (
    <div className={`command-list-wrapper ${className}`}>
      {command.map((cmd) => (
        <article key={cmd._id} className='card'>
          <div className='card-header'>
            <h2 className='card-title'>{cmd.name || 'Output Result'}</h2>
            {cmd.command && <span className='command-trigger'>{cmd.command}</span>}
          </div>
          
          <div className='card-body'>
            {cmd.description && (
              <div className='cmd-desc'>
                {cmd.description}
              </div>
            )}
            <div className='code-block'>
              <pre className='code-text'>
                {cmd.text}
              </pre>
              <div className='card-footer'>
                <CopyButton textToCopy={cmd.text} />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
