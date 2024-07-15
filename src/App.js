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
        console.log(template);
    };

    if (!isAuthenticated) {
        return <div>Access denied. Please refresh the page to try again.</div>;
    }
    // console.log("selectedTemplate: " + selectedTemplate);

    return (
        <div className="container-fluid">
            <header>{/* <h1>Email Template Assistance</h1> */}</header>
            <main className="row">
                <div className="col-lg-4 col-md-10">
                    <ReturnsGuide />
                </div>
                <div className="col-lg-6">
                    {window.innerWidth < 967 && (
                        <EmailTemplateLists
                            onSelectTemplate={handleSelectTemplate}
                        />
                    )}
                    {selectedTemplate && (
                        <EmailTemplate2 selectedTemplate={selectedTemplate} />
                    )}
                </div>
                <div className="col-lg-2 col-md-2 d-none d-md-block">
                    {window.innerWidth >= 967 && <AgentInfo />}
                    {window.innerWidth >= 967 && (
                        <EmailTemplateLists
                            onSelectTemplate={handleSelectTemplate}
                        />
                    )}
                </div>
            </main>

            {/* <footer style={{ marginTop: "-40px", textAlign: "right" }}>
                <p>
                    &#128008; 2024 Project By{" "}
                    <a href="https://www.indexduo.me">JING</a>.
                </p>
            </footer> */}
        </div>
    );
}

export default App;
