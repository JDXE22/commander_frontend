import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import buddyLogo from '../../assets/buddy.svg';
import { useAuth } from '../../shared/context/AuthContext';
import { loginUser, registerUser } from './api/apiAuth';
import './Auth.css';

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get('mode');
    if (m === 'register') {
      setMode('register');
    } else {
      setMode('login');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await loginUser(email, password);
      } else {
        result = await registerUser(email, password);
      }

      if (result.error) {
        setError(result.message);
      } else {
        login(result);
        navigate('/terminal');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <Link to="/" className="back-btn">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back</span>
        </Link>

        <div className="auth-card">
          <div className="auth-logo">
            <img src={buddyLogo} alt="Commander Logo" className="logo-icon-img" />
            <span className="logo-text-small">Commander</span>
          </div>

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
              type="button"
            >
              Login
            </button>
            <button 
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
              type="button"
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error-msg">{error}</div>}
            
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-box">
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="auth-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-box">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="auth-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {mode === 'login' && (
                <div className="forgot-pass-container">
                  <span className="forgot-pass">Forgot password?</span>
                </div>
              )}
            </div>

            <button type="submit" className="btn-auth-submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : mode === 'login' ? 'Continue' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            {mode === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <span className="auth-link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
