import { CopyButton } from '../../../shared/ui/Button/Button';
import { motion } from 'framer-motion';
import "./Command.css";

export const CommandList = ({ command, className = '' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200
      }
    }
  };

  return (
    <motion.div 
      className={`command-list-wrapper ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {command.map((cmd) => (
        <motion.article 
          key={cmd._id} 
          className='card'
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
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
        </motion.article>
      ))}
    </motion.div>
  );
};
