import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import EmailTemplate from "./components/EmailTemplate.js";
import EmailTemplate2 from "./components/EmailTemplate2.js";
import AgentInfo from "./components/AgentInfo.js";
import EmailTemplateLists from "./components/EmailTemplateLists.js";
import ReturnsGuide from "./components/ReturnsGuide.js";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [agentInfoSaved, setAgentInfoSaved] = useState(false);

    useEffect(() => {
        const storedPassword = localStorage.getItem("password");
        if (storedPassword && storedPassword === "123") {
            setIsAuthenticated(true);
        } else {
            checkPassword();
        }
    }, []);

    const checkPassword = () => {
        const password = prompt("Please enter the password:", "");
        if (password === "C123") {
            setIsAuthenticated(true);
            localStorage.setItem("password", password); // Store password if correct
        } else {
            alert("Incorrect password. Access denied.");
            // Optionally clear stored password if incorrect
            localStorage.removeItem("password");
        }
    };
    const handleSelectTemplate = (template) => {
        template = JSON.stringify(template);
        setSelectedTemplate(template);
        // console.log(template);
    };

    const handleAgentInfoSaved = (saved) => {
        setAgentInfoSaved(saved);
    };

    if (!isAuthenticated) {
        return <div>Access denied. Please refresh the page to try again.</div>;
    }
    // console.log("selectedTemplate: " + selectedTemplate);

    return (
        <div className="container-fluid">
            <main className="row">
                <div className="col-lg-3 d-none d-lg-block">
                    <ReturnsGuide selectedTemplate={selectedTemplate} />
                </div>
                <div className="col-lg-7">
                    {selectedTemplate && (
                        <EmailTemplate2
                            selectedTemplate={selectedTemplate}
                            agentInfoSaved={agentInfoSaved}
                        />
                    )}
                </div>
                <div className="col-lg-2 d-none d-lg-block">
                    <AgentInfo onAgentInfoSaved={handleAgentInfoSaved} />
                    <div className="ml-6 p-6">
                        <EmailTemplateLists
                            onSelectTemplate={handleSelectTemplate}
                        />
                    </div>
                </div>
            </main>

            <footer style={{ marginTop: "0px", textAlign: "right" }}>
                <p>
                    I hope this helps even just one person. -{" "}
                    <a href="https://www.indexduo.me">Jing</a>
                </p>
            </footer>
        </div>
    );
}

export default App;
