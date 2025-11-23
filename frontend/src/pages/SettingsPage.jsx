import './SettingsPage.css'
import { useState } from "react";
import axios from 'axios'

export default function SettingsPage() {
    const [page, setPage] = useState(1);
    const [passInput1, setPassInput1] = useState('');
    const [passInput2, setPassInput2] = useState('');
    const [removeInput, setRemoveInput] = useState('');
    const [password, setPassword] = useState('');

    function handleRemoveButton() {
        axios.get('http://localhost:3001/user')
        .then(response => {
            setPassword(response.data[0].password);
            console.log(password);
        })
        .catch(error =>{
            console.error('There was an error fetching users', error);
        })
    }

    function SettingScreen() {
        switch (page) {
            case 1: return <UserSettings />;
            case 2: return <PasswordSettings />;
            case 3: return <RemoveUser />;
        }
    }

    function UserSettings() {
        return (
            <div>
                <p>UserSetting</p>
            </div>);
    }

    function PasswordSettings() {
        return (
            <div className="change-password">
                <h3>password setting</h3>
                <div className="change-password-current">
                    <label >Current password: </label> <input className="change-password-current-input" value={passInput1} onChange={e => setPassInput1(e.target.value)}></input>
                </div>
                <div className="change-password-notcurrent">
                    <label >New password: </label> <input className="change-password-notcurrent-input" value={passInput2} onChange={e => setPassInput2(e.target.value)}></input>
                </div>
                <button className="change-password-button" onClick={() => handleButton()}>Change</button>
            </div>
        );
    }

    function RemoveUser() {
        return (
            <div className="remove-user-container">
                <h2>Warning! This will remove your account! Tread this page with extreme caution!</h2>
                <div className="remove-user-box">
                    <label >Password: </label> <input className="remove-user-password-input" value={removeInput} onChange={e => setRemoveInput(e.target.value)}></input>
                </div>
                <button className="remove-user-button" onClick={() => handleRemoveButton()}>Delete</button>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <div className="setting-box">
                <h2 className="header">Settings!</h2>
                <p className={`setting-item ${page === 1 ? "active" : ""}`} onClick={() => setPage(1)} >User information</p>
                <p className={`setting-item ${page === 2 ? "active" : ""}`} onClick={() => setPage(2)}>Change password</p>
                <p className={`setting-item ${page === 3 ? "active" : ""}`} onClick={() => setPage(3)}>Remove user</p>
            </div>
            <div className="setting-screen">
                <SettingScreen />
            </div>
        </div>
    );
}