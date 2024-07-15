import React, { useState, useEffect } from "react";
// import emailTemplates from "../../public/emailTemplates.json";
import { Button, Container, ListGroup } from "react-bootstrap";
import "../styles/templateList.css";

const EmailTemplateLists = ({ onSelectTemplate }) => {
    const [templates, setTemplates] = useState([]);

    // useEffect(() => {
    //     setTemplates(emailTemplates);
    // }, []);
    const fetchTemplates = async () => {
        const response = await fetch("/emailTemplates.json");
        const data = await response.json();
        // console.log(data);
        setTemplates(data);
    };
    fetchTemplates();

    return (
        <Container className="template-list-container">
            <h4>Select an Email Template</h4>
            <ListGroup>
                {templates.map((template) => (
                    <ListGroup.Item key={template.id}>
                        <Button
                            variant="link"
                            onClick={() => onSelectTemplate(template)}
                        >
                            {template.name}
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default EmailTemplateLists;
