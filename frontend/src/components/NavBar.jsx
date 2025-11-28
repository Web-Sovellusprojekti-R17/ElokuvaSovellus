import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./NavBar.css";
import UserIconWithAuth from "./LoginButt";
import { useAuth } from "../contexts/AuthContext.js"; 

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");   
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const handleSearch = () => {
    navigate(`/haku/${searchTerm}`);
  };

  const etusivulle = () => {
    navigate(`/`);
  };

  return (
    <nav className="navbar">
      <h2 onClick={etusivulle}>ElokuvaSovellus</h2>

      <div className="nav-links">
        <UserIconWithAuth />
        {user && (
          <span className="logged-in-user">Tervetuloa, {user.name}!</span>
        )}
        <Link to="/" className="nav-link">Koti</Link>
        <Link to="/movies" className="nav-link">Elokuvat</Link>
        <Link to="/about" className="nav-link">Tietoa</Link>
        {user ? <Link to="/arvostelu" className="nav-link">Arvostelut</Link> : null}
        {user ? <Link to="/ryhma" className="nav-link">Ryhmät</Link> : null}
        {user ? <Link to="/settings" className="nav-link">Asetukset</Link> : null}
        {user ? <Link to="/favorites" className="nav-link">Suosikit</Link> : null}
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
