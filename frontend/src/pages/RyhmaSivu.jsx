import { useEffect, useState } from "react";
import "./RyhmaSivu.css";
import Navbar from "../components/NavBar";

function RyhmaSivu(){


    return (
        <>
            <div id="container-ryhmasivu">
                <div id="container-ryhmat">
                    <div>
                        ryhma 1
                    </div>
                    <div>
                        ryhma 2
                    </div>
                </div>
                <div id="chat">
                    <form id="form-container">
                        <h1>Chat</h1>
                        <div id="viestit">
                            Tähän viestit tietokannasta.
                        </div>
                        <div id="laheta">
                            <textarea placeholder="Type message.." name="msg" required></textarea>
                            <button type="submit" class="btn">Send</button>
                        </div>  
                    </form>
                </div>
            </div> 
        </>   
    );
}

export default RyhmaSivu;