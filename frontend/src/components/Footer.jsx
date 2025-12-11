import React from "react";
import {Container, Row, Col,Image,Stack} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Footer.css"
import { Link } from "react-router-dom";

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
                    <p>Tietoa</p>
                    <p>Lisää tietoa</p>
                    <p>Lisää tietoa</p>
                    </Col>
                    <Col className="text-end">
                    <h2>Linkkejä</h2>
                    <a href="#top" className="top-link">Takaisin sivun alkuun</a>
                    <p>Linkki</p>
                    <p>Linkki</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;