import { Link } from 'react-router-dom';
import { useTrial } from '../../context/TrialContext';
import './TrialModal.css';

export const TrialModal = () => {
  const { showModal, closeModal } = useTrial();

  if (!showModal) return null;

  return (
    <div className="trial-overlay" onClick={closeModal}>
      <div className="trial-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="trial-title">
        <h2 id="trial-title" className="trial-modal-title">You like it?</h2>
        <p className="trial-modal-text">
          You've reached the free trial limit of 2 templates. Sign up or log in to have all your templates in one place!
        </p>
        <div className="trial-modal-actions">
          <Link to="/auth?mode=register" className="trial-btn-primary" onClick={closeModal}>
            Sign Up
          </Link>
          <Link to="/auth" className="trial-btn-secondary" onClick={closeModal}>
            Log In
          </Link>
        </div>
        <button className="trial-modal-dismiss" onClick={closeModal}>
          Maybe later
        </button>
      </div>
    </div>
  );
};
