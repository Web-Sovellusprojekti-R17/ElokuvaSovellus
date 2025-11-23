import React, { useState } from "react";
import "./LoginButt.css";
import { useAuth } from "../contexts/AuthContext.js";

export default function UserIconWithAuth() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const openLogin = () => setIsOpen(true);
  const closeLogin = () => setIsOpen(false);

  const toggleMode = () => setIsSignup((prev) => !prev);
  const { user, login, logout } = useAuth();

  const register = async (name, password) =>{
    const res = await fetch(`${process.env.REACT_APP_API_URL}user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, password })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Registering failed");
    }

    try {
      await login(name, password);
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    //setLoading(true);

    try {
      if(isSignup)
        await register(username, password);
      else  
        await login(username, password);
      
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    } finally {
      closeLogin();
      //setLoading(false);
    }
  };

  const handleLoginButtonClick = async () => {
    if(user){
      try {
        await logout();
      } catch (error) {
        console.log(error.message);
      }
    }
    else
      openLogin();
  }

  return (
    <>
      <button className="user-icon-btn" onClick={handleLoginButtonClick}>
        <img src="../images/usericon.png" alt={user ? "Log out" : "Sign in"} />
      </button>

      {isOpen && (
        <div className="login-overlay" onClick={closeLogin}>
          <div
            className="login"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeLogin}>×</button>

            <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
            {error && <div>{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="logsign-btn">
                {isSignup ? "Create Account" : "Log In"}
              </button>
            </form>

            <div className="toggle-text">
              <button className="logsign-btn" onClick={toggleMode}>
                {isSignup ? "Already have an account? " : "New user? "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
