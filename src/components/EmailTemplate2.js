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

const EmailTemplate = (selectedTemplate) => {
    const [formData, setFormData] = useState({
        greeting: "",
        memberName: "",
        agentFirstName: "",
        agentLastInitial: "",
        phone: "",
        trackingNumber: "",
        orderNumber: "",
        itemNumber: "",
        itemDescription: "",
        timeZone: "Eastern",
        firstContact: "",
        pickupDate: "",
    });

    const [template, setTemplate] = useState("");
    const [copied, setCopied] = useState(false);
    const spanRef = useRef(null);

    // console.log(selectedTemplate);
    // console.log(JSON.parse(selectedTemplate.selectedTemplate).name);
    const templateName = JSON.parse(selectedTemplate.selectedTemplate).name;
    const templateContent = JSON.parse(
        selectedTemplate.selectedTemplate
    ).template;

    useEffect(() => {
        fetch("/emailTemplates.json")
            .then((response) => response.json())
            .then((data) => {
                if (selectedTemplate === null) {
                    setTemplate(data[0].template); // Set the first template as default
                } else {
                    setTemplate(templateContent);
                }
            });
    }, [selectedTemplate]);

    const getAgentInfoFromCookies = () => {
        const savedData = Cookies.get("agentInfo");
        if (savedData) {
            const agentInfo = JSON.parse(savedData);
            return {
                firstName: agentInfo.firstName || "",
                lastName: agentInfo.lastName || "",
            };
        }
        return { firstName: "", lastName: "" };
    };

    useEffect(() => {
        const initialAgentInfo = getAgentInfoFromCookies();
        setFormData((prevData) => ({
            ...prevData,
            agentFirstName: initialAgentInfo.firstName,
            agentLastName: initialAgentInfo.lastName,
        }));

        const intervalId = setInterval(() => {
            const currentAgentInfo = getAgentInfoFromCookies();
            setFormData((prevData) => ({
                ...prevData,
                agentFirstName: currentAgentInfo.firstName,
            }));
            if (currentAgentInfo.lastName) {
                const lastInitial = currentAgentInfo.lastName.charAt(0);
                setFormData((prevData) => ({
                    ...prevData,
                    agentLastInitial: lastInitial,
                }));
            }
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
            input.style.width = `${width - 5}px`;
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

    const inputStyle = {
        border: "none",
        borderBottom: "1px dotted #007bff",
        backgroundColor: "#f8f9fa",
        minWidth: "70px",
        display: "inline-block",
        padding: "0 2px",
        outline: "none",
    };

    const renderTemplate = () => {
        if (!template) return null;

        return template.split("\n").map((line, index) => {
            const parts = line.split(/(\{\{.+?\}\})/).filter(Boolean);

            return (
                <p key={index}>
                    {parts.map((part, i) => {
                        if (part.startsWith("{{") && part.endsWith("}}")) {
                            const field = part.slice(2, -2).trim();
                            return (
                                <input
                                    key={i}
                                    type="text"
                                    placeholder={`<${field}>`}
                                    value={formData[field]}
                                    onChange={(e) => handleInput(e, field)}
                                    onBlur={() => handleBlur(field)}
                                    style={inputStyle}
                                    className="auto-width-input"
                                />
                            );
                        } else {
                            return part;
                        }
                    })}
                </p>
            );
        });
    };

    //console.log("template: " + template); //undefined
    const compiledTemplate = template.replace(
        /\{\{(.+?)\}\}/g,
        (_, field) => formData[field.trim()] || `<${field.trim()}>`
    );

    return (
        <Container className="mt-5">
            <h2
                className="mb-4"
                style={{
                    marginTop: "-40px",
                    fontSize: "20px",
                    textAlign: "center",
                }}
            >
                Email Template
            </h2>
            <Form style={{ marginTop: "-20px" }}>
                <Form.Group className="mb3">
                    <Form.Label>Time Zone:</Form.Label>
                    <Form.Control
                        as="select"
                        value={formData.timeZone}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                timeZone: e.target.value,
                            })
                        }
                    >
                        {Object.keys(timeZoneMap).map((zone) => (
                            <option key={zone} value={zone}>
                                {zone}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Template:</Form.Label>
                    <div
                        className="border p-3 rounded"
                        style={{
                            fontSize: "14px",
                            lineHeight: "1.5",
                        }}
                    >
                        {renderTemplate()}
                    </div>
                </Form.Group>
                <CopyToClipboard text={compiledTemplate} onCopy={handleCopy}>
                    <Button
                        style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                        }}
                        className="mt-3"
                    >
                        Copy to Clipboard
                    </Button>
                </CopyToClipboard>
                {copied && (
                    <Alert
                        variant="success"
                        className="mt-3"
                        onClose={() => setCopied(false)}
                        dismissible
                    >
                        Template copied to clipboard!
                    </Alert>
                )}
            </Form>
            <span
                ref={spanRef}
                style={{
                    position: "absolute",
                    top: "-9999px",
                    left: "-9999px",
                    visibility: "hidden",
                    whiteSpace: "nowrap",
                }}
            ></span>
        </Container>
    );
};

export default EmailTemplate;
