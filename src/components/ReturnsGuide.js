import React from "react";
import { Container } from "react-bootstrap";

const ReturnsGuide = (selectedTemplate) => {
    const template = JSON.parse(selectedTemplate.selectedTemplate);
    //console.log(template.guide);
    return (
        <div className="mt-5 border p-3 rounded">
            <h2>Template Guide</h2>
            <p>{template.name}</p>
            <p>{template.guide}</p>
        </div>
    );
};

export default ReturnsGuide;
