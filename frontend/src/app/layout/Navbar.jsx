import { useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import buddyLogo from "../../assets/buddy.svg";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside className="sidebar" role="navigation" aria-label="Main Sidebar">
        <div className="logo-group">
          <img src={buddyLogo} alt="Commander Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
          <span className="logo-text">Commander</span>
        </div>
        <nav className="nav-links">
          <CustomLink to="/terminal">Home</CustomLink>
          <CustomLink to="/filter">Filter</CustomLink>
          <CustomLink to="/create">Create</CustomLink>
        </nav>
      </aside>

      <header className="mobile-header" role="banner">
        <div className="logo-group">
          <img src={buddyLogo} alt="Commander Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
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
            <CustomLink to="/terminal" onClick={() => setIsOpen(false)}>Home</CustomLink>
            <CustomLink to="/filter" onClick={() => setIsOpen(false)}>Filter</CustomLink>
            <CustomLink to="/create" onClick={() => setIsOpen(false)}>Create</CustomLink>
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
