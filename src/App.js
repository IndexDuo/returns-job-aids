import logo from './logo.svg';
import './App.css';
import EmailTemplate from './components/EmailTemplate.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <header>
        <h1>Returns Assistance</h1>
      </header>
      <main>
        <EmailTemplate />
      </main>
      <footer>
        <p>&copy; 2024 Returns Assistance</p>
      </footer>
    </div>
  );
}

export default App;
