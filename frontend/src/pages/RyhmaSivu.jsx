import { useEffect, useState, useRef } from "react";
import "./RyhmaSivu.css";
import Navbar from "../components/NavBar";
import { useAuth, accessToken } from "../contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


function RyhmaSivu() {
    const [luoRyhmaAuki, setLuoRyhmaAuki] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [groups, setGroups] = useState([])
    const [ownGroups, setOwnGroups] = useState([])
    const [messages, setMessages] = useState([])
    const [viesti, setViesti] = useState('')
    const { user, accessToken } = useAuth();
    let params = useParams()
    const [groupID, setGroupID] = useState('')
    const [paivitaChat, setPaivitaChat] = useState(true)
    const [paivitaRyhmat, setPaivitaRyhmat] = useState(true)
    const [nykRyhmNim, setNykRyhmNim] = useState('')
    const [poistaRyhmaAuki, setPoistaRyhmaAuki] = useState(false)
    const [oikeudet, setOikeudet] = useState('')
    const [jasenet, setJasenet] = useState([])

    const containerRef = useRef();
    const bottomRef = useRef();

    const Groups = () => {
        const navigate = useNavigate()

        const ryhmasivulle = (id, nimi) => () => {
            setNykRyhmNim(nimi)
            setGroupID(id)
            navigate(`/ryhma/${id}`)
        }

        return (
            <div>
  {groups && groups.map(group => (
    <div
      key={group.group_id}
      className={`ryhma-kontti ${groupID === group.group_id ? "active" : ""}`}
      onClick={ryhmasivulle(group.group_id, group.group_name)}
    >
      <p className="ryhman-nimi">{group.group_name}</p>
    </div>
  ))}
</div>
        )
    }

    const OwnGroups = () => {
        const navigate = useNavigate()

        const ryhmasivulle = (id, nimi) => () => {
            setNykRyhmNim(nimi)
            setGroupID(id)
            navigate(`/ryhma/${id}`)
        }

        return (
            <div>
                {ownGroups && ownGroups.map(group => (
                    <div key={group.group_id} className={`ryhma-kontti ${groupID === group.group_id ? "active" : ""}`} onClick={ryhmasivulle(group.group_id, group.group_name)}><p id="ryhman_nimi">{group.group_name}</p></div>
                ))}
            </div>
        )
    }


    const haeRyhmat = async () => {
        await fetch(`${process.env.REACT_APP_API_URL}group`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
            credentials: "include"
        })

            .then(response => response.json())
            .then(json => {
                setGroups(Array.isArray(json) ? json : [])
            })
            .catch(error => {
                console.log(error)
            })

            await fetch(`${process.env.REACT_APP_API_URL}group/own/${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
            credentials: "include"
        })

            .then(response => response.json())
            .then(json => {
                setOwnGroups(Array.isArray(json) ? json : [])
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
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}` },
            credentials: "include",
            body: new URLSearchParams({ group_name: groupName })
        })


        const data = await res.json();
        console.log(data);
        if (!res.ok) {
            throw new Error(data.error || "Ryhmän luominen epäonnistui");
        }
        else {
            
            setLuoRyhmaAuki(false)

            if (paivitaRyhmat) {
                setPaivitaRyhmat(false)
            }
            else {
                setPaivitaRyhmat(true)
            }
        }

        const res2 = await fetch(`${process.env.REACT_APP_API_URL}api/members`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}` },
            credentials: "include",
            body: new URLSearchParams({ group_id: data.group_id, user_id:user.id, role:"Admin" })
        }); 

        if (!res2.ok) {
            const error = await res2.json();
            throw new Error(error.error || "memberin luominen epäonnistui");
        }
    }

    const haeViestit = async () => {
        await fetch(`${process.env.REACT_APP_API_URL}api/messages/${groupID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
            credentials: "include"
        })

            .then(response => response.json())
            .then(json => {
                setMessages(Array.isArray(json) ? json : [])
            })
            .catch(error => {
                console.log(error)
            })
    }

    const lisaa_viesti = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}` },
            credentials: "include",
            body: new URLSearchParams({ text: viesti, user_id: user.id, group_id: groupID })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Viestin lisääminen epäonnistui");
        }
        else {
            if (paivitaChat) {
                setPaivitaChat(false)
                
            }
            else {
                setPaivitaChat(true)
                
            }
        }
    }

    function scrollToBottom() {
        const el = containerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }

    const varmistusPop = () => {
        setPoistaRyhmaAuki(true)
    }

    const poistaRyhma = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}group/${groupID}`, { 
            method: "DELETE",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}`},
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Ryhmän poistaminen epäonnistui");
        }
        else{
            setPoistaRyhmaAuki(false)
            if(paivitaRyhmat){
                setPaivitaRyhmat(false)
            }
            else{
                setPaivitaRyhmat(true)
            }
        }
    }

    const haeJasenet = async () => {
        await fetch(`${process.env.REACT_APP_API_URL}api/members/${groupID}`, { 
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`},
            credentials: "include"
        })

        .then(response => response.json())
        .then(json => {
            setJasenet(json)
            console.log(groupID)
            console.log(jasenet)
        })
        .catch(error => {
            console.log(error)
        }) 
    }

    const luoRooli = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/members`, { 
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}`},
            credentials: "include",
            body: new URLSearchParams({ group_id: groupID, user_id: user.id, role: oikeudet })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Roolin asettaminen epäonnistui");
        }
    }

    const asetaRooli = async (rID, kID, rooli) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/members/${rID}/${kID}`, { 
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}`},
            credentials: "include",
            body: new URLSearchParams({ role: rooli })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Roolin asettaminen epäonnistui");
        }
    }

    const haeOikeudet = async (rID, kID) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/members/${rID}/${kID}`, { 
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}`},
            credentials: "include",
        })

        .then(response => response.json())
        .then(json => {
            setOikeudet(json.role)
            return oikeudet
        })
        .catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        if(user){
        haeRyhmat()
        }
    }, [user, paivitaRyhmat])

    useEffect(() => {
        haeViestit()
        setViesti('')
        haeJasenet()
    }, [groupID, paivitaChat])

    useEffect(() => {
        scrollToBottom();
    }, [messages])




    return (
        <>
            {luoRyhmaAuki && (
                <div>
                    <input type="text" placeholder="Ryhmän nimi..." value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
                    <button id="luoButton" onClick={luoRyhma}>Luo</button>
                </div>
            )}
            
            <div id="container-ryhmasivu">
                <div id="container-ryhmat">
                    <h3>Your groups</h3>
                    <button id="luoButton" onClick={luoRyhmaPop}>Luo uusi ryhmä</button>
                <div id="container-kaikki-ryhmat">
                    <OwnGroups />
                </div>
                <h3>Find groups</h3>
            <div id="container-omat-ryhmat">
                <Groups />
            </div>
            </div>
                {/* <Messages /> */}
                <div id="chat" >
                    <h1>Chat</h1>
                    <h3 id="ryhman-nimi-otsikko">{nykRyhmNim}</h3>
                    <div id="viestit" ref={containerRef}
                        style={{
                            width: "100%",
                            height: "100%",
                            overflowY: "scroll",
                            scrollBehavior: "smooth",
                        }}>
                        {groupID && messages && messages.map(message => (
                            <div key={message.message_id} id="viesti">
                                <p>{message.user_id}</p>
                                <p>{message.text}</p>
                            </div>
                        ))}
                    </div>
                    <div ref={bottomRef} />
                    <div id="laheta">
                        <textarea
                            placeholder="Type message.."
                            name="msg"
                            value={viesti}
                            onChange={e => setViesti(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
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
                <div id="jasenlista-container">
                    <button id="luoButton" onClick={varmistusPop}>Poista Ryhmä</button>
                    {poistaRyhmaAuki && (
                        <>
                            <p>Haluatko varmasti poistaa ryhmän?</p>
                            <div>
                                <button id="luoButton" onClick={poistaRyhma}>Kyllä</button>
                                {/* <button>Ei</button> */}
                            </div>
                        </>    
                    )}
                    <div>
                        {groupID && jasenet && jasenet.map(jasen => (
                            <div key={jasen.user_id + jasen.group_id} id="jasen">
                                <p id="jasen_nimi"><strong>{jasen.username}</strong></p>
                                <p id="jasen_rooli">{jasen.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div> 
        </>   
    );
}

export default RyhmaSivu;

