import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Reset from "./authentication/Reset";

import OnboardingFive from "./OnboardingFive"
import OnboardingSubtopics from "./OnboardingSubtopics"

import Dashboard from "./pages/Dashboard";
import PersonalInfo from "./pages/PersonalInfo";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/onboardingfive" element={<OnboardingFive />} />
          <Route exact path="/onboardingsubtopics" element={<OnboardingSubtopics />} />
          <Route exact path="/personalInfo" element={<PersonalInfo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
