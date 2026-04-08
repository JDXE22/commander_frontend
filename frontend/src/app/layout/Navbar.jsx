import { useState } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import buddyLogo from "../../assets/buddy.svg";
import { useAuth } from "../../shared/context/AuthContext";
import "./Navbar.css";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <aside className="sidebar" role="navigation" aria-label="Main Sidebar">
        <div className="logo-group">
          <img src={buddyLogo} alt="Commander Logo" className="logo-img" />
          <span className="logo-text">Commander</span>
        </div>
        <nav className="nav-links">
          <CustomLink to="/terminal">Terminal</CustomLink>
          <CustomLink to="/filter">Templates</CustomLink>
          <CustomLink to="/create">New</CustomLink>
        </nav>

        <div className="nav-links secondary">
          {!isAuthenticated && <CustomLink to="/">Home</CustomLink>}
          {isAuthenticated ? (
            <button className="nav-item logout-btn" onClick={handleLogout}>
              Logout ({user?.email?.split('@')[0]})
            </button>
          ) : (
            <CustomLink to="/auth">Sign In</CustomLink>
          )}
        </div>
      </aside>

      <header className="mobile-header" role="banner">
        <div className="logo-group">
          <img src={buddyLogo} alt="Commander Logo" className="logo-img" />
          <span className="logo-text">Commander</span>
        </div>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close Menu" : "Open Menu"} aria-expanded={isOpen}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </header>

      {isOpen && (
        <nav className="mobile-nav" aria-label="Mobile Navigation">
          <div className="nav-links">
            <CustomLink to="/terminal" onClick={() => setIsOpen(false)}>Terminal</CustomLink>
            <CustomLink to="/filter" onClick={() => setIsOpen(false)}>Templates</CustomLink>
            <CustomLink to="/create" onClick={() => setIsOpen(false)}>New</CustomLink>
            <div className="mobile-nav-divider"></div>
            {!isAuthenticated && <CustomLink to="/" onClick={() => setIsOpen(false)}>Home</CustomLink>}
            {isAuthenticated ? (
              <button className="nav-item logout-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <CustomLink to="/auth" onClick={() => setIsOpen(false)}>Sign In</CustomLink>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

const CustomLink = ({ to, children, onClick, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link 
      to={to} 
      className={`nav-item ${isActive ? "active" : ""}`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
};
