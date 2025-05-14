import { Link, useMatch, useResolvedPath } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav to="/" className="nav">
      <Link>Home</Link>
      <ul>
       <CustomLink to="/filter"> Filter Commands </CustomLink >
      </ul>
    </nav>
  );
};

const CustomLink = ({ to, children, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
};
