import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import buddyLogo from '../../assets/buddy.svg';
import { useAuth } from '../../shared/context/AuthContext';
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
} from './api/apiAuth';
import { sileo } from 'sileo';
import { GoogleIcon } from '../../shared/ui/Icons/GoogleIcon';
import './Auth.css';

const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT: 'forgot',
  RESET: 'reset',
};

const GOOGLE_OAUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/auth/google`;

const AuthHeader = () => (
  <>
    <Link to='/' className='back-btn' aria-label='Go back to home page'>
      <svg
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'>
        <line x1='19' y1='12' x2='5' y2='12'></line>
        <polyline points='12 19 5 12 12 5'></polyline>
      </svg>
      <span>Back</span>
    </Link>

    <div className='auth-logo'>
      <img src={buddyLogo} alt='Commander Logo' className='logo-icon-img' />
      <span className='logo-text-small'>Commander</span>
    </div>
  </>
);

const AuthTabs = ({ mode, setMode }) => (
  <div className='auth-tabs' role='tablist'>
    <button
      className={`auth-tab ${mode === AUTH_MODES.LOGIN ? 'active' : ''}`}
      onClick={() => setMode(AUTH_MODES.LOGIN)}
      type='button'
      role='tab'
      aria-selected={mode === AUTH_MODES.LOGIN}>
      Sign in
    </button>
    <button
      className={`auth-tab ${mode === AUTH_MODES.REGISTER ? 'active' : ''}`}
      onClick={() => setMode(AUTH_MODES.REGISTER)}
      type='button'
      role='tab'
      aria-selected={mode === AUTH_MODES.REGISTER}>
      Sign up
    </button>
  </div>
);

const SocialAuth = ({ onGoogleSignIn }) => (
  <>
    <button
      type='button'
      className='btn-google'
      onClick={onGoogleSignIn}
      aria-label='Continue with Google'>
      <GoogleIcon />
      Continue with Google
    </button>
    <div className='auth-divider'>
      <span className='auth-divider-line' aria-hidden='true' />
      <span className='auth-divider-text'>or</span>
      <span className='auth-divider-line' aria-hidden='true' />
    </div>
  </>
);

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [authMode, setAuthMode] = useState(AUTH_MODES.LOGIN);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modeParam = queryParams.get('mode');
    const tokenParam = queryParams.get('token');
    const errorParam = queryParams.get('error');

    if (errorParam === 'oauth_failed') {
      sileo.error({
        title: 'Google sign-in failed',
        description:
          'Something went wrong with Google authentication. Please try again.',
        fill: '#ef4444',
      });
    }

    if (modeParam === 'register') {
      setAuthMode(AUTH_MODES.REGISTER);
    } else if (modeParam === 'reset' || tokenParam) {
      setAuthMode(AUTH_MODES.RESET);
      if (tokenParam) setRecoveryToken(tokenParam);
    } else if (modeParam === 'forgot') {
      setAuthMode(AUTH_MODES.FORGOT);
    } else {
      setAuthMode(AUTH_MODES.LOGIN);
    }
  }, [location.search]);

  const showError = useCallback((title, description) => {
    sileo.error({ title, description, fill: '#ef4444' });
  }, []);

  const showSuccess = useCallback((title, description) => {
    sileo.success({
      title,
      description,
      fill: '#171717',
      styles: {
        title: 'sileo-text-white',
        description: 'sileo-text-white',
        badge: 'sileo-badge-fix',
      },
    });
  }, []);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let authResponse;

      switch (authMode) {
        case AUTH_MODES.LOGIN:
          authResponse = await loginUser(emailInput, passwordInput);
          break;
        case AUTH_MODES.REGISTER:
          authResponse = await registerUser(emailInput, passwordInput);
          break;
        case AUTH_MODES.FORGOT:
          authResponse = await forgotPassword(emailInput);
          break;
        case AUTH_MODES.RESET:
          if (passwordInput !== confirmPasswordInput) {
            showError(
              "Passwords don't match",
              'Re-enter your new password in both fields.',
            );
            setIsSubmitting(false);
            return;
          }
          if (!recoveryToken) {
            showError(
              'Link expired',
              'This reset link is no longer valid. Request a new one.',
            );
            setIsSubmitting(false);
            return;
          }
          authResponse = await resetPassword(recoveryToken, passwordInput);
          break;
        default:
          break;
      }

      if (authResponse?.error) {
        showError("Couldn't sign you in", authResponse.message);
      } else if (authResponse) {
        handleSuccessResponse();
      }
    } catch (error) {
      showError(
        'Something went wrong',
        'Try again in a moment. If this keeps happening, refresh the page.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessResponse = () => {
    if (authMode === AUTH_MODES.FORGOT) {
      showSuccess(
        'Reset Link Sent!',
        'Check your email to recover your password.',
      );
    } else if (authMode === AUTH_MODES.RESET) {
      showSuccess('Password updated', 'Taking you to sign in...');
      setTimeout(() => {
        navigate('/auth?mode=login');
        setAuthMode(AUTH_MODES.LOGIN);
      }, 3000);
    } else {
      login();
      showSuccess('Welcome Back!', 'Redirecting to terminal...');
      navigate('/terminal');
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = GOOGLE_OAUTH_URL;
  };

  const changeMode = (newMode) => {
    setAuthMode(newMode);
    navigate(`/auth?mode=${newMode}`);
  };

  const isSpecialMode =
    authMode === AUTH_MODES.FORGOT || authMode === AUTH_MODES.RESET;

  return (
    <div className='auth-page'>
      <div className='auth-wrapper'>
        <AuthHeader />

        <div className='auth-card'>
          {!isSpecialMode && (
            <>
              <AuthTabs mode={authMode} setMode={changeMode} />
              <SocialAuth onGoogleSignIn={handleGoogleSignIn} />
            </>
          )}

          {authMode === AUTH_MODES.FORGOT && (
            <div className='auth-header-special'>
              <h2 className='auth-title-special'>Recover Password</h2>
              <p className='auth-subtitle-special'>
                We'll send you a link to get back into your account
              </p>
            </div>
          )}

          {authMode === AUTH_MODES.RESET && (
            <div className='auth-header-special'>
              <h2 className='auth-title-special'>Set new password</h2>
              <p className='auth-subtitle-special'>
                Choose a new password for your account
              </p>
            </div>
          )}

          <form className='auth-form' onSubmit={handleAuthSubmit}>
            {authMode !== AUTH_MODES.RESET && (
              <div className='auth-field'>
                <label className='auth-label' htmlFor='email'>
                  Email Address
                </label>
                <div className='auth-input-box'>
                  <input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    className='auth-input'
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    autoComplete='email'
                  />
                </div>
              </div>
            )}

            {authMode !== AUTH_MODES.FORGOT && (
              <div className='auth-field'>
                <label className='auth-label' htmlFor='password'>
                  {authMode === AUTH_MODES.RESET ? 'New Password' : 'Password'}
                </label>
                <div className='auth-input-box'>
                  <input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    className='auth-input'
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    autoComplete={
                      authMode === AUTH_MODES.LOGIN
                        ? 'current-password'
                        : 'new-password'
                    }
                  />
                </div>
                {authMode === AUTH_MODES.LOGIN && (
                  <div className='forgot-pass-container'>
                    <button
                      type='button'
                      className='forgot-pass'
                      onClick={() => changeMode(AUTH_MODES.FORGOT)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                      }}>
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            {authMode === AUTH_MODES.RESET && (
              <div className='auth-field'>
                <label className='auth-label' htmlFor='confirm-password'>
                  Confirm New Password
                </label>
                <div className='auth-input-box'>
                  <input
                    id='confirm-password'
                    type='password'
                    placeholder='••••••••'
                    className='auth-input'
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    required
                    autoComplete='new-password'
                  />
                </div>
              </div>
            )}

            <button
              type='submit'
              className='btn-auth-submit'
              disabled={isSubmitting}>
              {isSubmitting
                ? 'Processing...'
                : authMode === AUTH_MODES.FORGOT
                  ? 'Send reset link'
                  : authMode === AUTH_MODES.RESET
                    ? 'Set new password'
                    : authMode === AUTH_MODES.LOGIN
                      ? 'Continue'
                      : 'Create Account'}
            </button>
          </form>

          <div className='auth-footer'>
            {isSpecialMode ? (
              <button
                type='button'
                className='auth-link'
                onClick={() => changeMode(AUTH_MODES.LOGIN)}
                style={{ background: 'none', border: 'none', padding: 0 }}>
                Back to Sign in
              </button>
            ) : (
              <p>
                {authMode === AUTH_MODES.LOGIN
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <button
                  type='button'
                  className='auth-link'
                  onClick={() =>
                    changeMode(
                      authMode === AUTH_MODES.LOGIN
                        ? AUTH_MODES.REGISTER
                        : AUTH_MODES.LOGIN,
                    )
                  }
                  style={{ background: 'none', border: 'none', padding: 0 }}>
                  {authMode === AUTH_MODES.LOGIN ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
