import { NavLink } from "react-router-dom"
import "./../App.css";

export default function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-left">
        <h2 className="navbar-logo">Tester umiejętności programowania</h2>
      </div>

      <div className="navbar-right">
        <NavLink to="/" className="nav-link">
            Piaskownica
        </NavLink>

        <NavLink to="/exercises" className="nav-link">
            Zadania
        </NavLink>
      </div>

    </nav>
  )
}