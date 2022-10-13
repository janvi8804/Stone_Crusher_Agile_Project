import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Routes, 
  Route,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import cookie from "react-cookies";

import RouteController from "./components/controller/RouteController";
import LoginPage from "./components/page/LoginPage"
import RegisterPage from "./components/page/RegisterPage"
import HomePage from "./components/Home/HomePage";

function App() {
  const is_login = parseInt(cookie.load("is_login")) === 1;
  console.log(is_login);

  return (
    <div className="text_font_css">
      <Router>
        <Routes>
          <Route path="/" element={<RouteController />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/home" element={<HomePage ActiveItem={1} />} /> */}
          <Route path="/my-project" element={<HomePage ActiveItem={2} />} />
          <Route path="/shared" element={<HomePage ActiveItem={3} />} />
          {/* <Route path="/profile" element={<HomePage ActiveItem={4} />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

{/* <div className="App">
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
</div> */}