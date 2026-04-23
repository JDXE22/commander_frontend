import { useState, useEffect } from 'react';
import { Link, useMatch, useResolvedPath, useNavigate } from 'react-router-dom';
import buddyLogo from '../../assets/buddy.svg';
import { useAuth } from '../../shared/context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => {
    setIsOpen(false);
    setIsMobileOpen(false);
  };

  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);

  // Auto-close mobile sidebar when viewport grows beyond the breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const sidebarClasses = [
    'sidebar',
    isOpen ? 'open' : '',
    isMobileOpen ? 'mobile-active open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Mobile hamburger / close toggle — hidden on desktop via CSS */}
      <button
        className='mobile-sidebar-toggle'
        onClick={toggleMobileSidebar}
        aria-label={isMobileOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isMobileOpen}
      >
        <img src={buddyLogo} alt='Commander Logo' className='mobile-buddy-icon' />
      </button>

      <div
        className={`sidebar-overlay ${isOpen || isMobileOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden='true'
      />

      <aside
        className={sidebarClasses}
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
          {(isOpen || isMobileOpen) && <span className='sidebar-title'>Commander</span>}
        </div>

        {(isOpen || isMobileOpen) && (
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
