import React, { useState, useEffect } from "react";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import Cookies from "js-cookie";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/AgentInfo.css';

const AgentInfo = () => {
    const [agentInfo, setAgentInfo] = useState({
        firstName: "",
        lastName: "",
    });


    useEffect(() => {
        // saved data should be agentInfo, which is their first and last name
        const savedData = Cookies.get("agentInfo");
        if (savedData) {
            setAgentInfo(JSON.parse(savedData));
        }
    }, []);

    const handleBlur = (field) => {
        let value = agentInfo[field];
        setAgentInfo({ ...agentInfo, [field]: value });
        // cookies does not need to be saved for form data.
        // Cookies.set('userInfo', JSON.stringify({ ...agentInfo, [field]: value }), { expires: 0.375 });
    };


   

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Agent Info</h2>
            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name:</Form.Label>
                            <Form.Control
                                type="text"
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
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name:</Form.Label>
                            <Form.Control
                                type="text"
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

                <Button
                    variant="primary"
                    onClick={() => {
                        Cookies.set("agentInfo", JSON.stringify(agentInfo), {
                            expires: 0.375,
                        });
                    }}
                >
                    Save
                </Button>
            </Form>

        </Container>
    );
};

export default AgentInfo;