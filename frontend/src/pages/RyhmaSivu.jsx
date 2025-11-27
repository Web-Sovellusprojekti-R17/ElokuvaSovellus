import { useEffect, useState } from "react";
import "./RyhmaSivu.css";
import Navbar from "../components/NavBar";
import { useAuth, accessToken } from "../contexts/AuthContext.js";

function RyhmaSivu(){
    const [luoRyhmaAuki, setLuoRyhmaAuki] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [groups, setGroups] = useState([])
    const { user, accessToken } = useAuth();


    const Groups = () => {
        
        return(
            <div>
                {groups && groups.map(group => (
                    <div>{group.group_name}</div>
                ))}
            </div>
        )
    }

    const haeRyhmat = async () => {
        await fetch(`${process.env.REACT_APP_API_URL}group`, { 
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`},
            credentials: "include"
        })

        .then(response => response.json())
        .then(json => {
            setGroups(json)
        })
        .catch(error => {
            console.log(error)
        })   
    }

    const luoRyhmaPop = () => {
        setLuoRyhmaAuki(true)
    }

    const luoRyhma = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}group`, { 
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}`},
            credentials: "include",
            body: new URLSearchParams({ group_name: groupName })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Ryhmän luominen epäonnistui");
        }
        else{
            setLuoRyhmaAuki(false)
        } 
    }

    useEffect(() => {
        haeRyhmat()
    }, [groups])

    return (
        <>
            {luoRyhmaAuki && (
                <div>
                    <input type="text" placeholder="Ryhmän nimi..." value={groupName} onChange={(e) => setGroupName(e.target.value)} required/>
                    <button id="luoButton" onClick={luoRyhma}>Luo</button>
                </div>
            )}
            <div id="container-ryhmasivu">
                <div id="container-ryhmat">
                    <button id="luoButton" onClick={luoRyhmaPop}>Luo uusi ryhmä</button>
                    <Groups />
                </div>
                <div id="chat">
                    <form id="form-container">
                        <h1>Chat</h1>
                        <div id="viestit">
                            Tähän viestit tietokannasta.
                        </div>
                        <div id="laheta">
                            <textarea placeholder="Type message.." name="msg" required></textarea>
                            <button type="submit" className="btn">Send</button>
                        </div>  
                    </form>
                </div>
            </div> 
        </>   
    );
}

export default RyhmaSivu;