import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SettingsPage.css'
import { useAuth } from "../contexts/AuthContext.js";

export default function PasswordSettings() {
    const [passInput1, setPassInput1] = useState('');
    const [passInput2, setPassInput2] = useState('');
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    function changeSite(site) {
        if (site === "user") navigate("/settings/");
        if (site === "remove") navigate("/settings/remove");
    }

    const submitChangePassword = async () => {
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}user/password/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${accessToken}`
                },
                credentials: "include",
                body: new URLSearchParams({ oldPassword: passInput1, newPassword: passInput2 })
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.error?.message || data.error || "Password change failed";
                setMessage(errorMessage);
                return;
            }

            setMessage("Password changed successfully!");
            setPassInput1("");
            setPassInput2("");
        } catch (err) {
            setMessage(err.message || "An error occurred");
        }
    }
    return (

        <div className="settings-container">

            <div className="">
                <div className="setting-box">
                    <h2 className="header">Settings!</h2>
                    <p className={`setting-item`} onClick={() => changeSite("user")}>User information</p>
                    <p className={`setting-item`} style={{ color: "#facc15", textDecoration: "underline" }}>Change password</p>
                    <p className={`setting-item`} onClick={() => changeSite("remove")}>Remove user</p>
                </div>
            </div>

            <div className="setting-screen">
                <h3>password setting</h3>
                {message && <div>{message}</div>}
                <div className="change-password-current">
                    <label >Current password: </label> <input className="change-password-current-input" value={passInput1} onChange={e => setPassInput1(e.target.value)}></input>
                </div>
                <div className="change-password-notcurrent">
                    <label >New password: </label> <input className="change-password-notcurrent-input" value={passInput2} onChange={e => setPassInput2(e.target.value)}></input>
                </div>
                <button className="change-password-button" onClick={submitChangePassword}>Change</button>
            </div>
        </div>
    );
}