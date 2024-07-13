import logo from "./logo.svg";
import "./App.css";
import EmailTemplate from "./components/EmailTemplate.js";
import "bootstrap/dist/css/bootstrap.min.css";
import AgentInfo from "./components/AgentInfo.js";

function App() {
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
                <p>&copy; 2024 Returns Assistance Project By JINGY</p>
            </footer>
        </div>
    );
}

export default App;
