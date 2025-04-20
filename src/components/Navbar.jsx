import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Spotify Clone</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" activeClassName="active">
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink to="/albums" activeClassName="active">
            Albums
          </NavLink>
        </li>
        <li>
          <NavLink to="/artists" activeClassName="active">
            Artistes
          </NavLink>
        </li>
        <li>
          <NavLink to="/genres" activeClassName="active">
            Genres
          </NavLink>
        </li>
        <li>
          <NavLink to="/search" activeClassName="active">
            Recherche
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
