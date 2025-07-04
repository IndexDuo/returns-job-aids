import React, { useState, useEffect } from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import "../styles/templateList.css";

const EmailTemplateLists = ({ onSelectTemplate }) => {
    const [templates, setTemplates] = useState([]);

    // const fetchTemplates = async () => {
    //     try {
    //         const response = await fetch("/emailTemplates.json");
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch templates");
    //         }
    //         const data = await response.json();
    //         setTemplates(data);
    //     } catch (error) {
    //         console.error("Error fetching templates:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetch("/emailTemplates.json")
    //         .then((response) => response.json())
    //         .then((data) => {
    //             setTemplates(data);
    //         })
    //         .then(() => {
    //             onSelectTemplate(templates[0]);
    //             console.log(templates[0]);
    //         });
    // }, []);

    useEffect(() => {
        fetch("/emailTemplates.json")
            .then((response) => response.json())
            .then((data) => {
                setTemplates(data);
            });
    }, []);

    useEffect(() => {
        if (templates.length > 0) {
            onSelectTemplate(templates[0]);
            //console.log(templates[0]);
        }
    }, [templates]);

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
