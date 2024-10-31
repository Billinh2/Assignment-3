import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";


function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getData() {
      fetch("http://localhost:3864/user", {method: "GET",  headers: {"content-type": "application/json"}})
    }

    getData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
