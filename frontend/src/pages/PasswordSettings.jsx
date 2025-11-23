import { useState } from "react";
import {useNavigate} from "react-router-dom";
import './SettingsPage.css'


export default function PasswordSettings() {
    const [passInput1, setPassInput1] = useState('');
    const [passInput2, setPassInput2] = useState('');

 const navigate = useNavigate();

function changeSite(site){
        if (site === "user") navigate("/settings/");
        if (site === "remove") navigate("/settings/remove");
    }

        return (

                <div className="settings-container">

                 <div className="">
            <div className="setting-box">
                <h2 className="header">Settings!</h2>
                <p className={`setting-item`}  onClick={()=>changeSite("user")}>User information</p>
                <p className={`setting-item`} style={{ color: "#facc15", textDecoration: "underline"}}>Change password</p>
                <p className={`setting-item`} onClick={()=>changeSite("remove")}>Remove user</p>
            </div>
        </div>

            <div className="setting-screen">
                <h3>password setting</h3>
                <div className="change-password-current">
                    <label >Current password: </label> <input className="change-password-current-input" value={passInput1} onChange={e => setPassInput1(e.target.value)}></input>
                </div>
                <div className="change-password-notcurrent">
                    <label >New password: </label> <input className="change-password-notcurrent-input" value={passInput2} onChange={e => setPassInput2(e.target.value)}></input>
                </div>
                <button className="change-password-button">Change</button>
            </div>
            </div>
        );
    }