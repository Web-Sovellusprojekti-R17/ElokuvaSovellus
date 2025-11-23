import React, { useState } from "react";
import "./LoginButt.css"; 
import UserIcon from '../assets/freeusericon.png';

export default function UserIconWithAuth() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const openLogin = () => setIsOpen(true);
  const closeLogin = () => setIsOpen(false);

  const toggleMode = () => setIsSignup((prev) => !prev);

  return (
    <>
      <button className="user-icon-btn" onClick={openLogin}>
        <img src={UserIcon} alt="User Icon" />
      </button>

      {isOpen && (
        <div className="login-overlay" onClick={closeLogin}>
          <div
            className="login"
            onClick={(e) => e.stopPropagation()} 
          >
            <button className="close-btn" onClick={closeLogin}>×</button>

            <h2>{isSignup ? "Rekisteröidy" : "Kirjaudu sisään"}</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input type="email" placeholder="Sähköposti" required />
              <input type="password" placeholder="Salasana" required />

              {isSignup && (
                <input type="text" placeholder="Käyttäjänimi (valinnainen)" />
              )}

              <button type="submit" className="logsign-btn">
                {isSignup ? "Luo tunnus" : "Kirjaudu sisään"}
              </button>
            </form>

            <div className="toggle-text">
              {isSignup ? "Onko sinulla jo tili? " : "Uusi käyttäjä? "}
              <button className="logsign-btn" onClick={toggleMode}>
                {isSignup ? "Kirjaudu sisään" : "Luo tunnus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
