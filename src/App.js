import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import EmailTemplate from "./components/EmailTemplate.js";
import AgentInfo from "./components/AgentInfo.js";
import EmailTemplateLists from "./components/EmailTemplateLists.js";

function App() {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
    };

    useEffect(() => {
        const storedPassword = localStorage.getItem("password");
        if (storedPassword && storedPassword === "C123") {
            setIsAuthenticated(true);
        } else {
            checkPassword();
        }
    }, []);

    const checkPassword = () => {
        const password = prompt("Please enter the password:", "");
        if (password === "123") {
            setIsAuthenticated(true);
            localStorage.setItem("password", password); // Store password if correct
        } else {
            alert("Incorrect password. Access denied.");
            // Optionally clear stored password if incorrect
            localStorage.removeItem("password");
        }
    };

    if (!isAuthenticated) {
        return <div>Access denied. Please refresh the page to try again.</div>;
    }

    return (
        <div className="container">
            <header>{/* <h1>Email Template Assistance</h1> */}</header>
            <main className="row">
                <div className="col-md-1 d-none d-md-block">
                    {window.innerWidth >= 967 && <AgentInfo />}
                </div>
                <div className="col-md-10">
                    <EmailTemplate />
                    <EmailTemplateLists />
                </div>
            </main>
            <footer style={{ marginTop: "-40px", textAlign: "right" }}>
                <p>
                    &#128008; 2024 Project By{" "}
                    <a href="https://www.indexduo.me">JING</a>.
                </p>
            </footer>
        </div>
    );
}

export default App;
