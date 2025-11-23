import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./NavBar.css";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");   // <-- ADD THIS
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/haku/${searchTerm}`);
  };

  return (
    <nav className="navbar">
      <h2>ElokuvaSovellus</h2>

      <div className="nav-links">
        <Link to="/" className="nav-link">Koti</Link>
        <Link to="/movies" className="nav-link">Elokuvat</Link>
        <Link to="/about" className="nav-link">Tietoa</Link>
        <Link to="/arvostelu" className="nav-link">Arvostelut</Link>
        <Link to="/ryhma" className="nav-link">Ryhmät</Link>
        <Link to="/settings" className="nav-link">Asetukset</Link>
      </div>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Hae elokuvia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key=== "Enter"){
                handleSearch();
            }
          }}
        />
        <button onClick={handleSearch}>Hae</button>
      </div>
    </nav>
  );
}
