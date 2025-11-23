import React, { useState } from "react";
import "./LoginButt.css"; 

export default function UserIconWithAuth() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const openLogin = () => setIsOpen(true);
  const closeLogin = () => setIsOpen(false);

  const toggleMode = () => setIsSignup((prev) => !prev);

  return (
    <>
      <button className="user-icon-btn" onClick={openLogin}>
        <img src="./assets/usericon.png" alt="User Icon" />
      </button>

      {isOpen && (
        <div className="login-overlay" onClick={closeLogin}>
          <div
            className="login"
            onClick={(e) => e.stopPropagation()} 
          >
            <button className="close-btn" onClick={closeLogin}>×</button>

            <h2>{isSignup ? "Sign Up" : "Log In"}</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />

              {isSignup && (
                <input type="text" placeholder="Username (optional)" />
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
