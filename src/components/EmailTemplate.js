import React, { useState, useEffect, useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cookies from "js-cookie";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
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

const EmailTemplate = () => {
    const [formData, setFormData] = useState({
        memberName: "",
        agentFirstName: "",
        agentLastName: "",
        phone: "",
        trackingNumber: "",
        orderNumber: "",
        itemNumber: "",
        itemDescription: "",
        timeZone: "Eastern",
        firstContact: "",
        pickupDate: "",
    });

    const [copied, setCopied] = useState(false);

    const spanRef = useRef(null);

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
                agentLastName: currentAgentInfo.lastName,
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
            spanRef.current.textContent = input.value;
            const width = spanRef.current.offsetWidth;
            input.style.width = `${width + 5}px`; // Add some padding for better look
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

    const template = `
    <div style="font-family: 'Times New Roman', Times, serif; font-size: 14px;">
        ${getGreeting(formData.timeZone)} ${formData.memberName},
        <br/><br/>
        My name is ${formData.agentFirstName} and I am part of the Costco Logistics Returns team. We attempted to reach you at Phone# ${formData.phone} to schedule your return pickup. Please be advised that your pickup needs to be scheduled by ${formData.pickupDate || "10 business days from First Contact"} to avoid cancellation of your return.
        <br/><br/>
        You have three options to schedule the return:
        <ol>
            <li>Contact us at 1-800-955-2292 to be assisted by one of our agents.</li>
            <li>Self-schedule using the link provided below.</li>
            <li>Return to your local warehouse.</li>
        </ol>
        <br/>
        Your order information:
        <ul>
            <li>Order#: ${formData.orderNumber}</li>
            <li>Item#: ${formData.itemNumber}</li>
            <li>Item Description: ${formData.itemDescription}</li>
        </ul>
        <br/>
        To self-schedule, please visit <a href="https://logistics.costco.com/userselfschedule" target="_blank" rel="noopener noreferrer">https://logistics.costco.com/userselfschedule</a> and enter your tracking number: ${formData.trackingNumber}
        <br/><br/>
        If you have decided to keep your item, please let us know by replying to this email or giving us a call. We would love to hear from you.
        <br/><br/>
        We look forward to hearing from you soon. Have a wonderful day!
        <br/><br/>
        ${formData.agentFirstName} ${formData.agentLastName.charAt(0)}${formData.agentLastName.length > 1 ? "." : ""}
        <br/><br/>
        Costco Logistics Returns Specialist
        <br/>
        Costco Member Service Center | 1-800-955-2292
        <br/>
        <a href="https://www.costco.com" target="_blank" rel="noopener noreferrer">www.costco.com</a>
    </div>
    `;

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
            <Row>
                <Col md={8} className="mx-auto">
                    <h2 className="mb-4">Email Template</h2>
                    <Form>
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
                                    fontFamily: "Times New Roman",
                                    fontSize: "14px",
                                }}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: template,
                                    }}
                                />
                            </div>
                        </Form.Group>
                        <CopyToClipboard text={template} onCopy={handleCopy}>
                            <Button variant="primary">Copy Template</Button>
                        </CopyToClipboard>
                        {copied && (
                            <Alert variant="success" className="mt-3">
                                Template copied to clipboard!
                            </Alert>
                        )}
                    </Form>
                    <span
                        ref={spanRef}
                        style={{ visibility: "hidden", whiteSpace: "pre" }}
                    ></span>
                </Col>
            </Row>
        </Container>
    );
};

export default EmailTemplate;
