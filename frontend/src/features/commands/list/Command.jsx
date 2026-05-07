import { CopyButton } from '../../../shared/ui/Button/Button';
import { LazyMotion, domAnimation, m } from 'motion/react';
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
        type: 'spring',
        damping: 25,
        stiffness: 200
      }
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={`command-result-container ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {command.map((cmd) => (
          <m.div
            key={cmd._id}
            className='terminal-result-item'
            variants={itemVariants}
          >
            <div className='result-content'>
              <pre className='result-text'>
                {cmd.text}
              </pre>
              <div className='result-actions'>
                <CopyButton textToCopy={cmd.text} />
              </div>
            </div>
          </m.div>
        ))}
      </m.div>
    </LazyMotion>
  );
};
