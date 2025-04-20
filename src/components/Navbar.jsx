import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/sonify.png" alt="Sonify Logo"></img>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink to="/albums" className={({ isActive }) => isActive ? "active" : ""}>
            Albums
          </NavLink>
        </li>
        <li>
          <NavLink to="/artists" className={({ isActive }) => isActive ? "active" : ""}>
            Artistes
          </NavLink>
        </li>
        <li>
          <NavLink to="/genres" className={({ isActive }) => isActive ? "active" : ""}>
            Genres
          </NavLink>
        </li>
        <li>
          <NavLink to="/search" className={({ isActive }) => isActive ? "active" : ""}>
            Recherche
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;