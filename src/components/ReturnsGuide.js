import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

const ReturnsGuide = (selectedTemplate) => {
    const [template, setTemplate] = useState("");

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
            <p>{template ? template.name : ""}</p>
            <p>{template ? template.guide : ""}</p>
        </div>
    );
};

export default ReturnsGuide;
