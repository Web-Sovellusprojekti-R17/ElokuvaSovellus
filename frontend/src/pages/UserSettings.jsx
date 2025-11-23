import { useState } from "react";
import {useNavigate} from "react-router-dom";
import './SettingsPage.css'

export default function UserSettings() {
  const [username, setUsername] = useState("Bob");
    const navigate = useNavigate();

    function changeSite(site){
        if (site === "password") navigate("/settings/password");
        if (site === "remove") navigate("/settings/remove");
    }

     return (
        <div className="settings-container">
        <div className="">
            <div className="setting-box">
                <h2 className="header">Settings!</h2>
                <p className={`setting-item`}  style={{ color: "#facc15", textDecoration: "underline"}}>User information</p>
                <p className={`setting-item`} onClick={()=>changeSite("password")}>Change password</p>
                <p className={`setting-item`} onClick={()=>changeSite("remove")}>Remove user</p>
            </div>
        </div>

        <div className="setting-screen">
      <h2>User Information</h2>
      <label>Username:</label>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <button>Save</button>
    </div>
    </div>
    );

  
    
  
}