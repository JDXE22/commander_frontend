import { CopyButton } from '../../../shared/ui/Button/Button';
import { LazyMotion, domAnimation, m as M } from 'motion/react';
import "./Command.css";

export const CommandList = ({ command, className = '' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { 
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <M.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`command-list ${className}`}
      >
        {command.map((cmd) => (
          <M.article 
            key={cmd._id} 
            variants={itemVariants}
            className='card terminal-card'
          >
            <div className='card-header'>
              <div className='card-meta'>
                <span className='status-dot green' />
                <span className='card-title'>{cmd.name}</span>
              </div>
              <span className='command-trigger'>{cmd.command}</span>
            </div>
            <div className='card-body'>
              <p className='command-text'>{cmd.text}</p>
              <div className='card-footer'>
                <CopyButton textToCopy={cmd.text} />
              </div>
            </div>
          </M.article>
        ))}
      </M.div>
    </LazyMotion>
  );
};
