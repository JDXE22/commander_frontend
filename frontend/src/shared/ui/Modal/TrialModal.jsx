import { Link } from 'react-router-dom';
import { useTrial } from '../../context/TrialContext';
import './TrialModal.css';

export const TrialModal = () => {
  const { showModal, closeModal } = useTrial();

  if (!showModal) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeModal();
    }
  };

  return (
    <div 
      className='trial-overlay' 
      onClick={closeModal}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex='0'
      aria-label='Close modal'
    >
      <div
        className='trial-modal'
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby='trial-title'
        tabIndex='-1'>
        <div className='trial-modal-icon'>
          <svg
            width='40'
            height='40'
            viewBox='0 0 24 24'
            fill='none'
            stroke='var(--terminal-green)'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path>
          </svg>
        </div>
        <h2 id='trial-title' className='trial-modal-title'>
          Unlock Full Potential
        </h2>
        <p className='trial-modal-text'>
          You've reached the free trial limit. Sign up or log in to have all
          your templates in one place!
        </p>
        <div className='trial-modal-actions'>
          <Link
            to='/auth?mode=register'
            className='trial-btn-primary'
            onClick={closeModal}>
            Create Free Account
          </Link>
          <Link to='/auth' className='trial-btn-secondary' onClick={closeModal}>
            Log In
          </Link>
        </div>
        <button className='trial-modal-dismiss' onClick={closeModal}>
          Maybe later, I'll stick to 2 for now
        </button>
      </div>
    </div>
  );
};
