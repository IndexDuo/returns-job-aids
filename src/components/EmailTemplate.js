import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cookies from "js-cookie";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const EmailTemplate = () => {
    const [agentInfo, setAgentInfo] = useState({
        firstName: "",
        lastName: "",
    });

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        trackingNumber: "",
    });

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // saved data should be agentInfo, which is their first and last name
        const savedData = Cookies.get("agentInfo");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleBlur = (field) => {
        let value = formData[field];
        if (field === "phone") {
            value = value.replace(/\D/g, "");
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        }
        setFormData({ ...formData, [field]: value });
        // cookies does not need to be saved for form data.
        // Cookies.set('userInfo', JSON.stringify({ ...formData, [field]: value }), { expires: 0.375 });
    };

    const handleInput = (e, field) => {
        setFormData({ [field]: e.target.innerText, ...formData });
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };


    const template = `
Dear [Customer],

My name is ${formData.name}. I am contacting you regarding the return of the item with the tracking number ${formData.trackingNumber}. Please contact me at ${formData.phone} if you need any further information.

Thank you,
${formData.name}
  `;

    return (
        
        <Container className="mt-5">
            <Row>
                <Col md={8} className="mx-auto">
                    <h2 className="mb-4">Agent Info</h2>
                    <Form>
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
                </Col>
            </Row>
        </Container>
    );
};

export default EmailTemplate;
