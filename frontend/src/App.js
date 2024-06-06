import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import OnboardingFive from "./pages/OnboardingFive"

import Dashboard from "./pages/Dashboard";
import PersonalInfo from "./pages/PersonalInfo";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import EditInterests from "./pages/EditInterests";
import EditInfo from "./pages/EditInfo"
import ProtectedRoute from "./components/ProtectedRoute";
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
          <Route exact path="/profile/" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route exact path="/editinterests/" element={<ProtectedRoute><EditInterests /></ProtectedRoute>} />
          <Route exact path="/editinfo/" element={<ProtectedRoute><EditInfo /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


