import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AgentInfo.css";

const AgentInfo = ({onAgentInfoSaved}) => {
    const [agentInfo, setAgentInfo] = useState({
        firstName: "",
        lastName: "",
    });
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        // Load saved data from cookies
        const savedData = Cookies.get("agentInfo");
        if (savedData) {
            setAgentInfo(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        // Save agentInfo to cookies with 8 hours expiration time
        Cookies.set("agentInfo", JSON.stringify(agentInfo), { expires: 1 / 3 }); // 8 hours
        setShowMessage(true);
        onAgentInfoSaved(true);
        setTimeout(() => setShowMessage(false), 10000); // Hide message after 10 seconds
    };

    return (
        <Container className="agent-info-container">
            <h2 className="custom-heading">Agent Info</h2>
            {showMessage && (
                <Alert
                    variant="success"
                    onClose={() => setShowMessage(false)}
                    dismissible
                >
                    Hello, {agentInfo.firstName}!
                </Alert>
            )}
            <Form>
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name:</Form.Label>
                            <Form.Control
                                type="text"
                                className="custom-form-control"
                                value={agentInfo.firstName}
                                onChange={(e) =>
                                    setAgentInfo({
                                        ...agentInfo,
                                        firstName: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name:</Form.Label>
                            <Form.Control
                                type="text"
                                className="custom-form-control"
                                value={agentInfo.lastName}
                                onChange={(e) =>
                                    setAgentInfo({
                                        ...agentInfo,
                                        lastName: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Form>
        </Container>
    );
};

export default AgentInfo;
