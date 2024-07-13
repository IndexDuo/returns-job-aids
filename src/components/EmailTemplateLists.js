import React, { useState, useEffect } from "react";

const EmailTemplateLists = ({ onSelectTemplate }) => {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        fetch("/emailTemplates.json")
            .then((response) => response.json())
            .then((data) => setTemplates(data))
            .catch((error) =>
                console.error("Error fetching templates:", error)
            );
    }, []);

    return (
        <div>
            <h4>Select an Email Template</h4>
            <ul>
                {templates.map((template) => (
                    <li key={template.id}>
                        <button onClick={() => onSelectTemplate(template)}>
                            {template.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmailTemplateLists;
