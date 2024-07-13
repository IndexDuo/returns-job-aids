import React, { useState, useEffect } from "react";
import emailTemplates from "../emailTemplates.json";
import { Button, Container, ListGroup } from "react-bootstrap";

const EmailTemplateLists = ({ onSelectTemplate }) => {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        setTemplates(emailTemplates);
    }, []);

    return (
        <Container>
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
