import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SettingsPage.css'
import { useAuth, accessToken } from "../contexts/AuthContext.js";

export default function UserSettings() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(user?.name || "");
  function changeSite(site) {
    if (site === "password") navigate("/settings/password");
    if (site === "remove") navigate("/settings/remove");
  }

  const submitChangeName = async () => {
        setMessage("");
        if (!user.id) {
            setMessage("User ID not found. Please log in again.");
            return;
        }

        if (!accessToken) {
            setMessage("Access token not found. Please log in again.");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}user/name/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${accessToken}`
                },
                credentials: "include",
                body: new URLSearchParams({ name: username })
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.error?.message || data.error || "Name change failed";
                setMessage(errorMessage);
                return;
            }

            setMessage("Name changed successfully!");
        } catch (err) {
            setMessage(err.message || "An error occurred");
        }
    }

  return (
    <div className="settings-container">
      <div className="">
        <div className="setting-box">
    <div className="setting-buttons">
    <h2 className="header">Settings!</h2>

    <button
      className="setting-item"
      type="button"
      style={{ backgroundColor: "#ff6600", textDecoration: "underline" }}
    >
      User information
    </button>

    <button
      className="setting-item"
      onClick={() => changeSite("password")}
      type="button"
    >
      Change password
    </button>

    <button
      className="setting-item"
      type="button"
      onClick={() => changeSite("remove")}
    >
      Remove user
    </button>
    </div>
  </div>
      </div>

      <div className="setting-screen">
        <div className="user-settings">
        <h2>User Information</h2>
        <div className="user-settings-input">
        <label>Username:</label>
        {message && <div>{message}</div>}
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <button onClick={submitChangeName}>Save</button>
        </div>
        </div>
      </div>
    </div>
  );
}