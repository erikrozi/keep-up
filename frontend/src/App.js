import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import Reset from "./authentication/Reset";
import Dashboard from "./pages/Dashboard";
import PersonalInfo from "./pages/PersonalInfo";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/personalInfo" element={<PersonalInfo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
