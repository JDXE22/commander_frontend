import { CopyButton } from '../../../shared/ui/Button/Button';

export const CommandList = ({ command, className = '' }) => {
  return (
    <div className={className} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {command.map((cmd) => (
        <article key={cmd._id} className='card'>
          <div className='cmd-desc'>
            {cmd.description ||
              'Executes the primary greeting macro for automated terminal responses.'}
          </div>
          <div className='code-block'>
            <span
              className='code-text'
              style={{ color: 'var(--text-primary)' }}>
              {cmd.text}
            </span>
            <CopyButton textToCopy={cmd.text} />
          </div>
        </article>
      ))}
    </div>
  );
};
