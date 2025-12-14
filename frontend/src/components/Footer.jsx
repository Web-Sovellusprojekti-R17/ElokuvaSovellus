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
                        src="/images/elokuvasovelluslogoinvis.png"
                        alt="some kind of logo"
                        rounded
                        width={150}
                        height={150}
                        />
                        <p>Elokuvasovellus 2025</p>
                    </Stack>
                    </Col>
                    <Col className="text-center">
                    <h2>About us</h2>
                    <p>Information</p>
                    <p>More information</p>
                    <p>More information</p>
                    </Col>
                    <Col className="text-end">
                    <h2>Links</h2>
                    <a href="#top" className="top-link">Back to top of page</a>
                    <p>Link</p>
                    <p>Link</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;