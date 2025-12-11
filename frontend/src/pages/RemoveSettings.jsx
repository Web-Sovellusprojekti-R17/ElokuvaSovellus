import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import './SettingsPage.css'
import { useAuth, accessToken } from "../contexts/AuthContext.js";

export default function RemoveSettings() {
    const [removeInput, setRemoveInput] = useState('');
    const [password, setPassword] = useState('');
    const { user, accessToken } = useAuth();
    const [isVisible,setIsVisible] = useState(false);

    const navigate = useNavigate();

    function changeSite(site) {

        if (site === "user") navigate("/settings/");
        if (site === "password") navigate("/settings/password");
    }

    

    function handleRemoveButton() {
        const newPut = {
         headers:{
                "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${accessToken}`
            },
            password: removeInput
        };
        
        axios.put(`http://localhost:3001/user/date/${user.id}`,newPut)
            .then(response => {
                //setPassword(response.data[0].password);
                 //setResponseMessage("Post created successfully!");
                console.log("toimii");
                setIsVisible(false);
            })
            .catch(error => {
                console.error('There was an error fetching users', error);
                setIsVisible(true);
            })
    }

    return (
        <div className="settings-container">

            <div className="">
                <div className="setting-box">
                    <h2 className="header">Settings!</h2>
                    <p className={`setting-item`} onClick={() => changeSite("user")} >User information</p>
                    <p className={`setting-item`} onClick={() => changeSite("password")}>Change password</p>
                    <p className={`setting-item`} style={{ color: "#facc15", textDecoration: "underline"}}>Remove user</p>
                </div>
            </div>

            <div className="setting-screen">
                <h2>Warning! This will remove your account! Tread carefully!</h2>
                <div className="remove-user-box">
                    <label >Password: </label> <input type="password" className="remove-user-password-input" value={removeInput} onChange={e => setRemoveInput(e.target.value)}></input>
                </div>
                <button className="remove-user-button" onClick={() => handleRemoveButton()}>Delete</button>
                <label style={{display: isVisible ? "block" : "none"}}>Wrong password!</label>
            </div>
        </div>
    );
}
