import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">BrewFlow</div>

      <nav className="navbar-links">
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <Link to="/login" className="btn btn-outline">
          Login
        </Link>
      </nav>
    </header>
  );
}
