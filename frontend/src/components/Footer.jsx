import React from "react";
import {Container, Row, Col,Image,Stack} from "react-bootstrap"

import 'bootstrap/dist/css/bootstrap.min.css';
import "./Footer.css"

const Footer = () => {
    return  (
        <footer>
            <Container fluid>
                <Row className="text-white p-4 justify-content-between">
                    <Col className="text-start">
                    <Stack>
                        <Image
                        src="/images/elokuvasovelluslogoinv.png"
                        alt="some kind of logo"
                        rounded
                        width={150}
                        height={150}
                        />
                        <p>Elokuvasovellus</p>
                    </Stack>
                    </Col>
                    <Col className="text-center">
                    <h2>Tietoa meistä</h2>
                    <p></p>
                    <Link to="/about" className="nav-link">About us sivulle</Link>
                    <p></p>
                    
                    </Col>
                    <Col className="text-end">
                    <h2>Linkkejä</h2>
                    <a href="#top" className="top-link">Takaisin sivun alkuun</a>
                    <p></p>
                    <Link to="https://github.com/Web-Sovellusprojekti-R17/ElokuvaSovellus.git" className="nav-link">Github repositorio</Link>
                    
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;