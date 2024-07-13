import React, { useState, useEffect } from "react";
import "./App.css";
import EmailTemplate from "./components/EmailTemplate.js";
import "bootstrap/dist/css/bootstrap.min.css";
import AgentInfo from "./components/AgentInfo.js";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                <div className="col-md-15">
                    <EmailTemplate />
                </div>
            </main>
            <footer>
                <p>
                    &copy; 2024 Returns Assistance Project By{" "}
                    <a href="https://www.indexduo.me">JINGY</a>.
                </p>
            </footer>
        </div>
    );
}

export default App;
