import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import buddyLogo from '../../assets/buddy.svg';
import { useAuth } from '../../shared/context/AuthContext';
import { loginUser, registerUser, forgotPassword, resetPassword } from './api/apiAuth';
import { sileo } from 'sileo';
import './Auth.css';

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [authMode, setAuthMode] = useState('login'); 
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modeParam = queryParams.get('mode');
    const tokenParam = queryParams.get('token');

    if (modeParam === 'register') {
      setAuthMode('register');
    } else if (modeParam === 'reset' || tokenParam) {
      setAuthMode('reset');
      if (tokenParam) setRecoveryToken(tokenParam);
    } else if (modeParam === 'forgot') {
      setAuthMode('forgot');
    } else {
      setAuthMode('login');
    }
  }, [location]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let authResponse;
      if (authMode === 'login') {
        authResponse = await loginUser(emailInput, passwordInput);
      } else if (authMode === 'register') {
        authResponse = await registerUser(emailInput, passwordInput);
      } else if (authMode === 'forgot') {
        authResponse = await forgotPassword(emailInput);
      } else if (authMode === 'reset') {
        if (passwordInput !== confirmPasswordInput) {
          sileo.error({ title: 'Validation Error', description: 'Passwords do not match', fill: '#ef4444' });
          setIsSubmitting(false);
          return;
        }
        if (!recoveryToken) {
          sileo.error({ title: 'Invalid Token', description: 'Invalid or missing recovery token', fill: '#ef4444' });
          setIsSubmitting(false);
          return;
        }
        authResponse = await resetPassword(recoveryToken, passwordInput);
      }

      if (authResponse.error) {
        sileo.error({ title: 'Authentication Error', description: authResponse.message, fill: '#ef4444' });
      } else {
        if (authMode === 'forgot') {
          sileo.success({ 
            title: 'Reset Link Sent!', 
            description: 'Check your email to recover your password.',
            fill: '#171717',
            styles: { title: 'sileo-text-white', description: 'sileo-text-white', badge: 'sileo-badge-fix' }
          });
        } else if (authMode === 'reset') {
          sileo.success({ 
            title: 'Recovery Successful!', 
            description: 'Your password has been updated. Redirecting to login...',
            fill: '#171717',
            styles: { title: 'sileo-text-white', description: 'sileo-text-white', badge: 'sileo-badge-fix' }
          });
          setTimeout(() => {
            navigate('/auth?mode=login');
            setAuthMode('login');
          }, 3000);
        } else {
          login(authResponse);
          sileo.success({ 
            title: 'Welcome Back!', 
            description: 'Redirecting to terminal...', 
            fill: '#171717',
            styles: { title: 'sileo-text-white', description: 'sileo-text-white', badge: 'sileo-badge-fix' }
          });
          navigate('/terminal');
        }
      }
    } catch (error) {
      sileo.error({ title: 'System Error', description: 'An unexpected error occurred. Please try again.', fill: '#ef4444' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isForgotPasswordMode = authMode === 'forgot';
  const isResetPasswordMode = authMode === 'reset';

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

          {!isForgotPasswordMode && !isResetPasswordMode && (
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
                type="button"
              >
                Login
              </button>
              <button 
                className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
                type="button"
              >
                Register
              </button>
            </div>
          )}

          {isForgotPasswordMode && (
            <div className="auth-header-special">
              <h2 className="auth-title-special">Recover Password</h2>
              <p className="auth-subtitle-special">We'll send you a link to get back into your account</p>
            </div>
          )}

          {isResetPasswordMode && (
            <div className="auth-header-special">
              <h2 className="auth-title-special">Recovery Section</h2>
              <p className="auth-subtitle-special">Create a new secure password for your account</p>
            </div>
          )}

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {!isResetPasswordMode && (
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-box">
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="auth-input" 
                    value={emailInput}
                    onChange={(event) => setEmailInput(event.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {!isForgotPasswordMode && (
              <div className="auth-field">
                <label className="auth-label">{isResetPasswordMode ? 'New Password' : 'Password'}</label>
                <div className="auth-input-box">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="auth-input" 
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    required
                  />
                </div>
                {authMode === 'login' && (
                  <div className="forgot-pass-container">
                    <span className="forgot-pass" onClick={() => setAuthMode('forgot')}>
                      Forgot password?
                    </span>
                  </div>
                )}
              </div>
            )}

            {isResetPasswordMode && (
              <div className="auth-field">
                <label className="auth-label">Confirm New Password</label>
                <div className="auth-input-box">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="auth-input" 
                    value={confirmPasswordInput}
                    onChange={(event) => setConfirmPasswordInput(event.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn-auth-submit" disabled={isSubmitting}>
              {isSubmitting 
                ? 'Processing...' 
                : isForgotPasswordMode 
                  ? 'Request Recovery Link' 
                  : isResetPasswordMode
                    ? 'Confirm Recovery'
                    : authMode === 'login' 
                      ? 'Continue' 
                      : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            {isForgotPasswordMode || isResetPasswordMode ? (
              <span className="auth-link" onClick={() => {
                setAuthMode('login');
                navigate('/auth?mode=login');
              }}>
                Back to Sign in
              </span>
            ) : (
              <>
                {authMode === 'login' 
                  ? "Don't have an account? " 
                  : "Already have an account? "}
                <span className="auth-link" onClick={() => {
                  const nextMode = authMode === 'login' ? 'register' : 'login';
                  setAuthMode(nextMode);
                  navigate(`/auth?mode=${nextMode}`);
                }}>
                  {authMode === 'login' ? 'Sign up' : 'Sign in'}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
