import { useEffect, useState } from "react";
import "./RyhmaSivu.css";
import Navbar from "../components/NavBar";
import { useAuth, accessToken } from "../contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function RyhmaSivu(){
    const [luoRyhmaAuki, setLuoRyhmaAuki] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [groups, setGroups] = useState([])
    const [messages, setMessages] = useState([])
    const [viesti, setViesti] = useState('')
    const { user, accessToken } = useAuth();
    let params = useParams()
    const [groupID, setGroupID] = useState('')
    const [paivitaChat, setPaivitaChat] = useState(true)
    const [paivitaRyhmat, setPaivitaRyhmat] = useState(true)
    const [nykRyhmNim, setNykRyhmNim] = useState('')

    

    const Groups = () => {
        const navigate = useNavigate()

        const ryhmasivulle = (id, nimi) => () => {
            setNykRyhmNim(nimi)
            setGroupID(id)
            navigate(`/ryhma/${id}`)
        }

        return(
            <div>
                {groups && groups.map(group => (
                    <div key={group.group_id} id="ryhma-kontti" onClick={ryhmasivulle(group.group_id, group.group_name)}><p id="ryhman_nimi">{group.group_name}</p></div>
                ))}
            </div>
        )
    }

    // const Messages = () => {
    //     return (
    //         <div id="chat">
    //             <form id="form-container">
    //                 <h1>Chat</h1>
    //                 <div id="viestit">
    //                     Tähän viestit tietokannasta.
    //                 </div>
    //                 <div id="laheta">
    //                     <textarea placeholder="Type message.." name="msg" required></textarea>
    //                     <button type="submit" className="btn">Send</button>
    //                 </div>  
    //             </form>
    //         </div>
    //     )
    // }

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
            
            if(paivitaRyhmat){
                setPaivitaRyhmat(false)
            }
            else{
                setPaivitaRyhmat(true)
            }
        } 
    }

    const haeViestit = async () => {
        await fetch(`${process.env.REACT_APP_API_URL}api/messages/${groupID}`, { 
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`},
            credentials: "include"
        })

        .then(response => response.json())
        .then(json => {
            setMessages(json)
        })
        .catch(error => {
            console.log(error)
        })   
    }

    const lisaa_viesti = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/messages`, { 
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}`},
            credentials: "include",
            body: new URLSearchParams({ text: viesti, user_id: user.id, group_id: groupID})
        });
         if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Viestin lisääminen epäonnistui");
        }
        else{
            if(paivitaChat){
                setPaivitaChat(false)
            }
            else{
                setPaivitaChat(true)
            }
        }
    }

    useEffect(() => {
        haeRyhmat()
    }, [paivitaRyhmat])

    useEffect(() => {
        haeViestit()
        setViesti('')
    }, [groupID, paivitaChat])
    


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
                {/* <Messages /> */}
                <div id="chat">
                    <h1>Chat</h1>
                    <h3 id="ryhman-nimi-otsikko">{nykRyhmNim}</h3>
                    <div id="viestit">
                        {groupID && messages && messages.map(message => (
                            <div key={message.message_id} id="viesti">
                                <p>{message.user_id}</p>
                                <p>{message.text}</p>
                            </div>
                        ))}
                    </div>
                    <div id="laheta">
                        <textarea 
                        placeholder="Type message.." 
                        name="msg" 
                        value={viesti} 
                        onChange={e => setViesti(e.target.value)}
                        onKeyDown={(e)=>{
                            if(e.key=== "Enter"){
                                lisaa_viesti();
                            }
                        }}
                        required
                        ></textarea>
                        <button className="btn" onClick={lisaa_viesti}>Send</button>
                    </div>  
                </div>
            </div> 
        </>   
    );
}

export default RyhmaSivu;

