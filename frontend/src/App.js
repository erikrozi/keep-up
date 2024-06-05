import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import OnboardingFive from "./pages/OnboardingFive"

import Dashboard from "./pages/Dashboard";
import PersonalInfo from "./pages/PersonalInfo";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DeepdivePage from "./pages/DeepdivePage";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login/" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
          <Route exact path="/register/" element={<RedirectIfAuthenticated><RegisterPage /></RedirectIfAuthenticated>} />
          <Route exact path="/dashboard/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route exact path="/onboardingfive/" element={<ProtectedRoute><OnboardingFive /></ProtectedRoute>} />
          <Route exact path="/personalInfo/" element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>} />
          <Route path="/deepdive/:corpus_id" element={<ProtectedRoute><DeepdivePage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
