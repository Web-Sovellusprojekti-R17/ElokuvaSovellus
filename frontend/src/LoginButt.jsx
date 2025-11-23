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
                {isSignup ? "Create Account" : "Log In"}
              </button>
            </form>

            <div className="toggle-text">
              {isSignup ? "Already have an account? " : "New user? "}
              <button className="logsign-btn" onClick={toggleMode}>
                {isSignup ? "Log In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
