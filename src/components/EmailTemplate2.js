import React, { useState, useEffect, useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cookies from "js-cookie";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

const timeZoneMap = {
    Hawaii: "Pacific/Honolulu",
    Alaska: "America/Anchorage",
    Pacific: "America/Los_Angeles",
    Mountain: "America/Denver",
    Central: "America/Chicago",
    Eastern: "America/New_York",
    Atlantic: "America/Puerto_Rico",
};

const EmailTemplate2 = () => {
    const [formData, setFormData] = useState({});
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState({});
    const [copied, setCopied] = useState(false);
    const spanRef = useRef(null);

    const fetchTemplates = async () => {
        const response = await fetch("/path-to-your-json-file");
        const data = await response.json();
        setTemplates(data);
        setSelectedTemplate(data[0]); // Default to the first template
    };

    const getAgentInfoFromCookies = () => {
        const savedData = Cookies.get("agentInfo");
        if (savedData) {
            const agentInfo = JSON.parse(savedData);
            return {
                agentFirstName: agentInfo.firstName || "",
                agentLastName: agentInfo.lastName || "",
            };
        }
        return { agentFirstName: "", agentLastName: "" };
    };

    useEffect(() => {
        fetchTemplates();
        const initialAgentInfo = getAgentInfoFromCookies();
        setFormData((prevData) => ({
            ...prevData,
            agentFirstName: initialAgentInfo.agentFirstName,
            agentLastName: initialAgentInfo.agentLastName,
            timeZone: "Eastern",
            pickupDate: "",
        }));

        const intervalId = setInterval(() => {
            const currentAgentInfo = getAgentInfoFromCookies();
            setFormData((prevData) => ({
                ...prevData,
                agentFirstName: currentAgentInfo.agentFirstName,
                agentLastName: currentAgentInfo.agentLastName,
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

    const updateInputWidth = (input) => {
        if (spanRef.current) {
            spanRef.current.textContent = input.value || input.placeholder;
            const width = spanRef.current.offsetWidth;
            input.style.width = `${width - 5}px`; // remove padding for small font change
        }
    };

    useEffect(() => {
        const inputs = document.querySelectorAll(".auto-width-input");
        inputs.forEach((input) => updateInputWidth(input));
    }, [formData]);

    const getGreeting = (timeZone) => {
        const currentHour = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            hour12: false,
            timeZone: timeZoneMap[timeZone],
        });
        return currentHour < 12 ? "Good Morning" : "Good Afternoon";
    };

    const calculatePickupDate = () => {
        let currentDate = new Date();
        let businessDaysCount = 0;
        while (businessDaysCount < 10) {
            currentDate.setDate(currentDate.getDate() + 1);
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                businessDaysCount++;
            }
        }
        const options = { weekday: "long", month: "long", day: "numeric" };
        return currentDate.toLocaleDateString("en-US", options);
    };

    const handlePickupDateCalculation = () => {
        const calculatedDate = calculatePickupDate();
        setFormData({ ...formData, pickupDate: calculatedDate });
    };

    const renderTemplate = () => {
        if (!selectedTemplate.template) return "";

        let template = selectedTemplate.template;
        Object.keys(formData).forEach((key) => {
            template = template.replace(
                `{${key}}`,
                formData[key] || `<${key}>`
            );
        });

        return template;
    };

    const handleTemplateChange = (e) => {
        const selected = templates.find(
            (t) => t.id === parseInt(e.target.value)
        );
        setSelectedTemplate(selected);
        const initialAgentInfo = getAgentInfoFromCookies();
        const initialFormData = selected.inputs.reduce((acc, input) => {
            acc[input] = initialAgentInfo[input] || "";
            return acc;
        }, {});
        setFormData({
            ...initialFormData,
            timeZone: "Eastern",
            pickupDate: "",
        });
    };

    const inputStyle = {
        border: "none",
        borderBottom: "1px dotted #007bff",
        backgroundColor: "#f8f9fa",
        minWidth: "70px",
        display: "inline-block",
        padding: "0 2px",
        outline: "none",
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4" style={{ marginTop: "15px" }}>
                Email Template Filler
            </h2>
            <Form>
                <Form.Group controlId="templateSelect">
                    <Form.Label>Select Template</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={handleTemplateChange}
                        value={selectedTemplate.id || ""}
                    >
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                {selectedTemplate.inputs &&
                    selectedTemplate.inputs.map((input) => (
                        <Form.Group key={input}>
                            <Form.Label>
                                {input.replace(/([A-Z])/g, " $1")}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={formData[input] || ""}
                                onChange={(e) => handleInput(e, input)}
                                onBlur={() => handleBlur(input)}
                                placeholder={`<${input}>`}
                                className="auto-width-input"
                                style={inputStyle}
                            />
                        </Form.Group>
                    ))}

                <Form.Group>
                    <Form.Label>Time Zone</Form.Label>
                    <Form.Control
                        as="select"
                        value={formData.timeZone}
                        onChange={(e) => handleInput(e, "timeZone")}
                    >
                        {Object.keys(timeZoneMap).map((zone) => (
                            <option key={zone} value={zone}>
                                {zone}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Pickup Date</Form.Label>
                    <Button
                        variant="outline-secondary"
                        onClick={handlePickupDateCalculation}
                        className="d-block mb-2"
                    >
                        <FaCalendarAlt /> Calculate Pickup Date
                    </Button>
                    <Form.Control
                        type="text"
                        value={formData.pickupDate}
                        readOnly
                        placeholder="<pickupDate>"
                        className="auto-width-input"
                        style={inputStyle}
                    />
                </Form.Group>

                <CopyToClipboard text={renderTemplate()} onCopy={handleCopy}>
                    <Button variant="primary" className="mt-3">
                        Copy to Clipboard
                    </Button>
                </CopyToClipboard>
                {copied && (
                    <Alert variant="success" className="mt-3">
                        Email template copied to clipboard!
                    </Alert>
                )}
            </Form>

            <div style={{ marginTop: "20px" }}>
                <h4>Generated Email:</h4>
                <div
                    style={{
                        whiteSpace: "pre-wrap",
                        backgroundColor: "#f8f9fa",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #dee2e6",
                    }}
                >
                    {renderTemplate()}
                </div>
                <span
                    ref={spanRef}
                    style={{
                        visibility: "hidden",
                        position: "absolute",
                        whiteSpace: "pre",
                    }}
                ></span>
            </div>
        </Container>
    );
};

export default EmailTemplate2;
