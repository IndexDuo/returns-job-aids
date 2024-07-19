import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

const ReturnsGuide = (selectedTemplate) => {
    const [template, setTemplate] = useState("");

    const Guide = ({ text }) => {
        return <div style={{ whiteSpace: "pre-line" }}>{text}</div>;
    };

    useEffect(() => {
        if (selectedTemplate) {
            const template2 = JSON.parse(selectedTemplate.selectedTemplate);
            setTemplate(template2);
            // console.log(template2);
        }
    }, [selectedTemplate]);

    useEffect(() => {
        const template2 = JSON.parse(selectedTemplate.selectedTemplate);
        setTemplate(template2);
        // console.log(template2);
    }, []);

    // console.log(template);
    return (
        <div className="mt-5 border p-3 rounded">
            <h2>Template Guide</h2>
            <p className="font-weight-bold">{template ? template.name : ""}</p>
            <div className="guide-text">
                {template ? <Guide text={template.guide} /> : ""}
            </div>
        </div>
    );
};

export default ReturnsGuide;
