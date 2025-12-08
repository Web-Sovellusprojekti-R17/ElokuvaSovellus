import { useEffect, useState, useRef } from "react";

function ShowMessages({
    groupID,
    messages,
    nykRyhmNim,
    viesti,
    setViesti,
    lisaa_viesti,
    user,
    haeOikeudet
}) {
    const [roleData, setRoleData] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        async function fetchRole() {
            setLoadingRole(true);
            const data = await haeOikeudet(groupID, user.username);
            setRoleData(data);
            setLoadingRole(false);
        }

        if (groupID) {
            fetchRole();
        }
    }, [groupID, user.username, haeOikeudet]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    if (loadingRole) return null;
    if (!roleData) return <p>Error loading role</p>;

    const role = roleData.role;


    if (role === "Admin" || role === "Member") {
        return (
            <>
                <h1>Chat</h1>
                <h3 id="ryhman-nimi-otsikko">{nykRyhmNim}</h3>

                <div
                    id="viestit"
                    ref={containerRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        overflowY: "scroll",
                        scrollBehavior: "smooth",
                    }}
                >
                    {messages?.map(message => (
                        <div key={message.message_id} id="viesti">
                            <p>{message.user_id}</p>
                            <p>{message.text}</p>
                        </div>
                    ))}
                </div>

                <div id="laheta">
                    <textarea
                        placeholder="Type message..."
                        value={viesti}
                        onChange={e => setViesti(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); 
                                lisaa_viesti();
                            }
                        }}
                    ></textarea>

                    <button className="btn" onClick={lisaa_viesti}>Send</button>
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
            <button id="joinButton">Join</button>
        </div>
    );
}

export default React.memo(ShowMessages);