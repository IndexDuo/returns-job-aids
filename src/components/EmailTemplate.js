import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cookies from "js-cookie";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const EmailTemplate = () => {
    const [formData, setFormData] = useState({
        memberName: "",
        agentFirstName: "",
        agentLastName: "",
        phone: "",
        trackingNumber: "",
    });

    const [copied, setCopied] = useState(false);

    const getAgentInfoFromCookies = () => {
        const savedData = Cookies.get("agentInfo");
        if (savedData) {
            const agentInfo = JSON.parse(savedData);
            return {
                firstName: agentInfo.firstName || "",
                lastName: agentInfo.lastName || ""
            };
        }
        return { firstName: "", lastName: "" };
    };

    useEffect(() => {
        const initialAgentInfo = getAgentInfoFromCookies();
        setFormData((prevData) => ({
            ...prevData,
            agentFirstName: initialAgentInfo.firstName,
            agentLastName: initialAgentInfo.lastName
        }));

        const intervalId = setInterval(() => {
            const currentAgentInfo = getAgentInfoFromCookies();
            setFormData((prevData) => ({
                ...prevData,
                agentFirstName: currentAgentInfo.firstName,
                agentLastName: currentAgentInfo.lastName
            }));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleBlur = (field) => {
        let value = formData[field];
        if (field === "phone") {
            value = value.replace(/\D/g, "");
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        }
        setFormData({ ...formData, [field]: value });
    };

    const handleInput = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const template = `
Dear [Customer],

My name is ${formData.agentFirstName}. I am contacting you regarding the return of the item with the tracking number ${formData.trackingNumber}. Please contact me at ${formData.phone} if you need any further information.

Thank you,
${formData.agentFirstName} ${formData.agentLastName.charAt(0)}${formData.agentLastName.length > 1 ? "." : ""}
  `;

    const inputStyle = {
        border: "none",
        borderBottom: "1px dotted #007bff",
        backgroundColor: "#f8f9fa",
        minWidth: "50px",
        display: "inline-block",
        padding: "0 2px",
        outline: "none",
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={8} className="mx-auto">
                    <h2 className="mb-4">Email Template</h2>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Template:</Form.Label>
                            <div className="border p-3 rounded">
                                <p>Dear [Customer],</p>
                                <p>
                                    My name is{" "}
                                    <input
                                        type="text"
                                        value={formData.agentFirstName}
                                        onChange={(e) => handleInput(e, "agentFirstName")}
                                        onBlur={() => handleBlur("agentFirstName")}
                                        style={inputStyle}
                                    />
                                    . I am contacting you regarding the return
                                    of the item with the tracking number{" "}
                                    <input
                                        type="text"
                                        value={formData.trackingNumber}
                                        onChange={(e) => handleInput(e, "trackingNumber")}
                                        onBlur={() => handleBlur("trackingNumber")}
                                        style={inputStyle}
                                    />
                                    . Please contact me at{" "}
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => handleInput(e, "phone")}
                                        onBlur={() => handleBlur("phone")}
                                        style={inputStyle}
                                    />{" "}
                                    if you need any further information.
                                </p>
                                <p>
                                    Thank you,
                                    <br />
                                    <span>
                                        {formData.agentFirstName}{" "}
                                        {formData.agentLastName &&
                                            formData.agentLastName.charAt(0) + "."}
                                    </span>
                                </p>
                            </div>
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <CopyToClipboard
                                text={template}
                                onCopy={handleCopy}
                            >
                                <Button variant="primary">Copy Template</Button>
                            </CopyToClipboard>
                            {copied && (
                                <Alert variant="success" className="m-0 py-1">
                                    Copied!
                                </Alert>
                            )}
                        </div>
                        <Form.Group>
                            <Form.Label>Preview:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                value={template}
                                readOnly
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EmailTemplate;
