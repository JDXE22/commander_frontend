import { useState } from 'react';
import { Link, useMatch, useResolvedPath, useNavigate } from 'react-router-dom';
import buddyLogo from '../../assets/buddy.svg';
import { useAuth } from '../../shared/context/AuthContext';
import { useTheme } from '../../shared/context/ThemeContext';
import './Navbar.css';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleUserClick = () => {
    closeSidebar();
    navigate('/settings');
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/');
  };

  const displayName = user?.email?.split('@')[0] ?? 'Account';

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden='true'
      />

      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        role='navigation'
        aria-label='Main Sidebar'>
        <div className='sidebar-header'>
          <button
            className='sidebar-toggle'
            onClick={toggleSidebar}
            aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
            aria-expanded={isOpen}>
            <img src={buddyLogo} alt='Commander Logo' className='buddy-icon' />
          </button>
          {isOpen && <span className='sidebar-title'>Commander</span>}
        </div>

        {isOpen && (
          <>
            <nav className='nav-links'>
              <CustomLink to='/terminal' onClick={closeSidebar}>
                Terminal
              </CustomLink>
              <CustomLink to='/filter' onClick={closeSidebar}>
                Templates
              </CustomLink>
              <CustomLink to='/create' onClick={closeSidebar}>
                New
              </CustomLink>
              {!isAuthenticated && (
                <CustomLink to='/' onClick={closeSidebar}>
                  Home
                </CustomLink>
              )}
            </nav>

            <div className='user-section' role='group' aria-label='User and system controls'>
              <button
                className='theme-toggle'
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-label={`Current theme: ${theme}. Click to switch to ${theme === 'dark' ? 'light' : 'dark'} mode.`}>
                <span className='theme-icon' aria-hidden='true'>
                  {theme === 'dark' ? (
                    <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <circle cx='12' cy='12' r='5' stroke='currentColor' strokeWidth='1.5' />
                      <path d='M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                    </svg>
                  ) : (
                    <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path d='M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  )}
                </span>
                <span className='theme-text'>{theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}</span>
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    className='user-profile'
                    onClick={handleUserClick}
                    aria-label={`User profile: ${displayName}. Open settings.`}>
                    <span className='user-avatar' aria-hidden='true'>
                      <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <circle
                          cx='12'
                          cy='8'
                          r='4'
                          stroke='currentColor'
                          strokeWidth='1.5'
                        />
                        <path
                          d='M4 20c0-4 3.582-7 8-7s8 3 8 7'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                    </span>
                    <span className='user-name'>{displayName}</span>
                  </button>
                  <button
                    className='user-logout'
                    onClick={handleLogout}
                    aria-label='Log out of system'>
                    <span className='logout-icon' aria-hidden='true'>
                      <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M15 12H3m0 0l3-3m-3 3l3 3'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M9 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3H9'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                    </span>
                    <span className='logout-text'>TERMINATE</span>
                  </button>
                </>
              ) : (
                <Link to='/auth' className='user-signin' onClick={closeSidebar} aria-label='Sign in to account'>
                  SIGN_IN
                </Link>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
};

const CustomLink = ({ to, children, onClick, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link
      to={to}
      className={`nav-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      {...props}>
      {children}
    </Link>
  );
};
