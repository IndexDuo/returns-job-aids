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
    const [placeholder, setPlaceholder] = useState("");
    const [copied, setCopied] = useState(false);
    const spanRef = useRef(null);

    useEffect(() => {
        setFormData({
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
    }, [selectedTemplate]);

    // console.log(JSON.parse(selectedTemplate.selectedTemplate).name);

    // useEffect(() => {
    //     fetch("/emailTemplates.json")
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (!selectedTemplate) {
    //                 let templateContent = JSON.parse(data[0].template);
    //                 setTemplate(data[0].template); // Set the first template as default
    //                 console.log("templateContent: " + templateContent);
    //             }
    //         });
    // }, []);

    useEffect(() => {
        const templateName = JSON.parse(selectedTemplate.selectedTemplate).name;
        const templateContent = JSON.parse(
            selectedTemplate.selectedTemplate
        ).template;
        const templateInputs = JSON.parse(
            selectedTemplate.selectedTemplate
        ).inputs;

        if (selectedTemplate) {
            setTemplate(templateContent);
            setPlaceholder(templateInputs);
        }
    }, [selectedTemplate]);

    const getAgentInfoFromCookies = () => {
        const savedData = Cookies.get("agentInfo");
        // console.log(formData["agentFirstName"]);
        if (savedData) {
            const agentInfo = JSON.parse(savedData);
            console.log(agentInfo);
            return {
                firstName: agentInfo.firstName || formData["agentFirstName"],
                lastName: agentInfo.lastName || "",
            };
        }
        return { firstName: formData["agentFirstName"], lastName: "" };
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
            //console.log(formData["agentFirstName"]);
            setFormData((prevData) => ({
                ...prevData,
                agentFirstName:
                    currentAgentInfo.firstName || formData["agentFirstName"],
            }));
            if (currentAgentInfo.lastName) {
                const lastInitial = currentAgentInfo.lastName.charAt(0);
                setFormData((prevData) => ({
                    ...prevData,
                    agentLastInitial: lastInitial,
                }));
            }
        }, 6000);

        return () => clearInterval(intervalId);
    }, []);

    const handleBlur = (field) => {
        let value = formData[field];
        if (field === "phone") {
            value = value.replace(/\D/g, "");
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        } else if (field === "pickupDate") {
            const dateParts = formData.pickupDate.split("/");
            const month = new Date(
                dateParts[2],
                dateParts[0] - 1,
                dateParts[1]
            ).toLocaleString("en-US", { month: "long" });
            const day = new Date(
                dateParts[2],
                dateParts[0] - 1,
                dateParts[1]
            ).toLocaleString("en-US", { day: "numeric" });
            const weekday = new Date(
                dateParts[2],
                dateParts[0] - 1,
                dateParts[1]
            ).toLocaleString("en-US", { weekday: "long" });
            if ((month || day || weekday) === "Invalid Date") {
                value = "";
            } else {
                value = `${weekday}, ${month} ${day}`;
            }
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
    }, [template, formData]);

    const getGreeting = (timeZone) => {
        const currentHour = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            hour12: false,
            timeZone: timeZoneMap[timeZone],
        });
        formData["greeting"] =
            currentHour < 12 ? "Good Morning" : "Good Afternoon";
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

        // Replace double newline with a unique placeholder
        const doubleNewlinePlaceholder = "___DOUBLE_NEWLINE___";
        const singleNewlinePlaceholder = "___SINGLE_NEWLINE___";

        let processedTemplate = template.replace(
            /\n\n/g,
            doubleNewlinePlaceholder
        );
        processedTemplate = processedTemplate.replace(
            /\n/g,
            singleNewlinePlaceholder
        );

        return processedTemplate
            .split(doubleNewlinePlaceholder)
            .map((paragraph, index) => {
                return (
                    <p key={index}>
                        {paragraph
                            .split(singleNewlinePlaceholder)
                            .map((line, i) => {
                                const parts = line
                                    .split(/(\{\{.+?\}\})/)
                                    .filter(Boolean);

                                return (
                                    <React.Fragment key={i}>
                                        {parts.map((part, j) => {
                                            if (
                                                part.startsWith("{{") &&
                                                part.endsWith("}}")
                                            ) {
                                                const field = part
                                                    .slice(2, -2)
                                                    .trim();
                                                if (field === "greeting") {
                                                    return (
                                                        <span key={j}>
                                                            {getGreeting(
                                                                formData.timeZone
                                                            )}{" "}
                                                        </span>
                                                    );
                                                } else if (
                                                    field === "pickupDate"
                                                ) {
                                                    return (
                                                        <span key={j}>
                                                            <input
                                                                type="text"
                                                                placeholder="<10 business days from First Contact>"
                                                                value={
                                                                    formData.pickupDate
                                                                }
                                                                onChange={(e) =>
                                                                    handleInput(
                                                                        e,
                                                                        "pickupDate"
                                                                    )
                                                                }
                                                                onBlur={() =>
                                                                    handleBlur(
                                                                        "pickupDate"
                                                                    )
                                                                }
                                                                style={
                                                                    inputStyle
                                                                }
                                                                className="auto-width-input"
                                                            ></input>
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                style={{
                                                                    padding:
                                                                        "0",
                                                                    verticalAlign:
                                                                        "middle",
                                                                }}
                                                                onClick={
                                                                    handlePickupDateCalculation
                                                                }
                                                            >
                                                                <FaCalendarAlt />
                                                            </Button>
                                                        </span>
                                                    );
                                                } else {
                                                    return (
                                                        <input
                                                            key={j}
                                                            type="text"
                                                            placeholder={
                                                                placeholder.find(
                                                                    (p) =>
                                                                        p.name ===
                                                                        field
                                                                )
                                                                    ?.placeholder ||
                                                                `<${field}>`
                                                            }
                                                            value={
                                                                formData[field]
                                                            }
                                                            onChange={(e) =>
                                                                handleInput(
                                                                    e,
                                                                    field
                                                                )
                                                            }
                                                            onBlur={() =>
                                                                handleBlur(
                                                                    field
                                                                )
                                                            }
                                                            style={inputStyle}
                                                            className="auto-width-input"
                                                        />
                                                    );
                                                }
                                            } else {
                                                return part;
                                            }
                                        })}
                                        {i !==
                                            paragraph.split(
                                                singleNewlinePlaceholder
                                            ).length -
                                                1 && <br />}
                                    </React.Fragment>
                                );
                            })}
                    </p>
                );
            });
    };

    //console.log("template: " + template); //undefined
    const compiledTemplate = template.replace(
        /\{\{(.+?)\}\}/g,
        (_, field) =>
            formData[field.trim()] ||
            placeholder.find((p) => p.name === field.trim())?.placeholder ||
            `<${field}>`
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
                            fontSize: "14.5px",
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
