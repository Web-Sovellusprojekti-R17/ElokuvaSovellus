import { useEffect, useState, useRef } from "react";
import "./RyhmaSivu.css";
import Navbar from "../components/NavBar";
import { useAuth, accessToken } from "../contexts/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../components/ShowMessages.css"


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
    const [chatState, setChatState] = useState(0)
    const [currentGroup, setCurrentGroup] = useState('')
    const [lisaaJasenAuki, setLisaaJasenAuki] = useState(false)
    const [lisattava, setLisattava] = useState('')
    const [kayttajatListaLisays, setKayttajatListaLisays] = useState([])
    const [paivitaJasenet, setPaivitaJasenet] = useState(true)

    const containerRef = useRef();
    const bottomRef = useRef();

    const Groups = () => {
        const navigate = useNavigate()


        const ryhmasivulle = (id, nimi) => async () => {

            setNykRyhmNim(nimi)
            setGroupID(id)
            setJasenet([])
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
            setJasenet([])
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
            throw new Error(data.error || "Failed to create group");
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
            body: new URLSearchParams({ group_id: data.group_id, user_id: user.id, role: "Admin" })
        });

        if (!res2.ok) {
            const error = await res2.json();
            throw new Error(error.error || "Failed to add member");
        }
    }

    async function liityRyhmaan() {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/members`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}` },
            credentials: "include",
            body: new URLSearchParams({ group_id: groupID, user_id: user.id, role: "Pending" })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to join group");
        } else {
            if (paivitaChat) {
                setPaivitaChat(false)

            }
            else {
                setPaivitaChat(true)

            }
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
            throw new Error(error.error || "Failed to send message");
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
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}` },
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to delete group");
        }
        else {
            setPoistaRyhmaAuki(false)
            if (paivitaRyhmat) {
                setPaivitaRyhmat(false)
            }
            else {
                setPaivitaRyhmat(true)
            }
        }
    }

    const haeJasenet = async () => {
        await fetch(`${process.env.REACT_APP_API_URL}api/members/${groupID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
            credentials: "include"
        })

            .then(response => response.json())
            .then(json => {
                setJasenet(Array.isArray(json) ? json : [])
            })
            .catch(error => {
                console.log(error)
            })
    }

    const luoRooli = async (rID, kID, rooli) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/members`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}` },
            credentials: "include",
            body: new URLSearchParams({ group_id: rID, user_id: kID, role: rooli })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to set role");
        }
        else {
            if (paivitaJasenet) {
                setPaivitaJasenet(false)
            }
            else {
                setPaivitaJasenet(true)
            }
        }
    }

    const asetaRooli = async (rID, kID, rooli) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/members/${rID}/${kID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}` },
            credentials: "include",
            body: new URLSearchParams({ role: rooli })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to set role");
        }
    }

    const haeOikeudet = async (rID, kID) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}api/members/${groupID}/${user.id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
                credentials: "include",
            })

            const json = await res.json();
            setOikeudet(json.role);
            return json;
        }
        catch (err) {
            console.error("haeOikeudet error: ", err);
            return null;
        }
    }

    function getUserColor(userId) {
        const colors = [
            "#F87171", "#FBBF24", "#34D399",
            "#60A5FA", "#A78BFA", "#F472B6"
        ];
        return colors[userId % colors.length];
    }

    function ShowMessages() {
        const [roleData, setRoleData] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            async function fetchRole() {
                console.log("joo");
                const data = await haeOikeudet(groupID, user.username);
                setRoleData(data);
                setLoading(false);
            }
            if (groupID) fetchRole();
        }, [groupID]);

        if (loading) return <p>Loading...</p>;
        if (!roleData) return <p>Error loading role</p>;

        const role = roleData.role;
        setOikeudet(role);

        if (role === "Admin" || role === "Member") {
            return (
                <>
                    <h1>Chat</h1>
                    <h3 id="ryhman-nimi-otsikko">{nykRyhmNim}</h3>
                    <div id="viestit" ref={containerRef}
                        style={{
                            width: "100%",
                            height: "100%",
                            overflowY: "scroll",
                            scrollBehavior: "smooth",
                        }}>


                        <p>Hello {role.toLowerCase()}!</p>

                        {messages?.map(message => {
                            const avatarColor = getUserColor(message.user_id);

                            return (
                                <div key={message.message_id} className="message-bubble">

                                    <div
                                        className="message-avatar"
                                        style={{ backgroundColor: avatarColor }}>

                                    </div>

                                    <div className="message-content">
                                        <span className="message-username">
                                            User {message.username}
                                        </span>
                                        <span className="message-text">{message.text}</span>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                </>
            );
        }

        if (role === "Pending") {
            return (
                <div className="chat-notice">
                    <h2>Your status is pending</h2>
                </div>
            );
        }

        return (
            <div className="chat-notice">
                <p>Join this group?</p>
                <button id="joinButton" onClick={liityRyhmaan}>Yes</button>
            </div>
        );
    }




    const poistaJasen = async (rID, kID) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/members/${rID}/${kID}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}` },
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to remove member");
        }
        else {
            if (paivitaJasenet) {
                setPaivitaJasenet(false)

            }
            else {
                setPaivitaJasenet(true)

            }
        }
    }

    const lisaaJasenPop = () => {
        setLisaaJasenAuki(true)
    }

    const lisaaJasen = async () => {
        await fetch(`${process.env.REACT_APP_API_URL}user`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
            credentials: "include"
        })

            .then(response => response.json())
            .then(json => {
                setKayttajatListaLisays(json)
                setLisaaJasenAuki(false)
            })
            .catch(error => {
                console.log(error)
            })

        kayttajatListaLisays.forEach(kayttaja => {
            if (kayttaja.username == lisattava) {
                luoRooli(groupID, kayttaja.user_id, "Member")
            }
        });
    }

    const updateJasen = async (userID) => {
        console.log("updatejasenesta " + userID, groupID)
        const res = await fetch(`${process.env.REACT_APP_API_URL}api/members/${groupID}/${userID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Bearer ${accessToken}` },
            credentials: "include",
            body: new URLSearchParams({ role: "Member" })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Failed to set role");
        }  else {
            if (paivitaJasenet) {
                setPaivitaJasenet(false)

            }
            else {
                setPaivitaJasenet(true)

            }
        }
    }

    useEffect(() => {
        if (user) {
            console.log("jooRyhmat");
            haeRyhmat()
        }
    }, [user, paivitaRyhmat])

    useEffect(() => {
        if (user) {
            console.log("jooViestit+Jasenet");
            haeViestit()
            setViesti('')
            haeJasenet()
        }
    }, [groupID, paivitaChat])

    useEffect(() => {
        console.log("ScrollToBottom");
        scrollToBottom();
    }, [messages])

    useEffect(() => {
        console.log("jooJasenet");
        if (user)
            haeJasenet()
    }, [paivitaJasenet])



    return (
        <>
            {luoRyhmaAuki && (
                <div>
                    <input type="text" placeholder="Ryhmän nimi..." value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
                    <button id="luoButton" onClick={luoRyhma}>Create</button>
                </div>
            )}

            <div id="container-ryhmasivu">
                <div id="container-ryhmat">
                    <h3>Your groups</h3>
                    <button id="luoButton" onClick={luoRyhmaPop}>Create a new group</button>
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
                    <ShowMessages />
                    <div ref={bottomRef} />
                    {(oikeudet === "Admin" || oikeudet === "Member") && (<div id="laheta" >
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
                    </div>)}
                </div>



                <div id="jasenlista-container">

                    {oikeudet === "Admin" && (
                        <>
                            <button id="luoButton" onClick={varmistusPop}>Delete group</button>

                            {poistaRyhmaAuki && (
                                <>
                                    <p>Are you sure you want to delete the group?</p>
                                    <div>
                                        <button id="luoButton" onClick={poistaRyhma}>Yes</button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {oikeudet === "Admin" && (<button id="luoButton" onClick={lisaaJasenPop}>Add member</button>)}
                    {lisaaJasenAuki && (
                        <>
                            <input type="text" placeholder="Member name..." value={lisattava} onChange={(e) => setLisattava(e.target.value)} required />
                            <button id="luoButton" onClick={lisaaJasen}>Add</button>
                        </>

                    )}
                    <div>
                        {groupID && jasenet && jasenet.map(jasen => (
                            <div key={jasen.user_id + jasen.group_id} id="jasen">
                                <p id="jasen_nimi"><strong>{jasen.username}</strong></p>
                                <p id="jasen_rooli">{jasen.role}</p>
                                {oikeudet === "Admin" && jasen.role === "Pending" && (
                                    <div className="jasen-napit">
                                    <button onClick={() => updateJasen(jasen.user_id)}>Add</button>
                                     <button onClick={() => poistaJasen(jasen.group_id, jasen.user_id)} id="poista-jasen-button">Remove member</button>
                                    </div>
                                )}
                                {oikeudet === "Admin" && jasen.role === "Member" && (
                                    <div className="jasen-napit">
                                        <button onClick={() => poistaJasen(jasen.group_id, jasen.user_id)} id="poista-jasen-button">Remove member</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </>
    );
}

export default RyhmaSivu;

