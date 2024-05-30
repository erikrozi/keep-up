import { useEffect, useState } from "react";
import { Button } from "../components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import landingImage from "../assets/rabbit_hopping_flipped.gif";
import landingRocket from "../assets/LandingRocket.png";
import landingLightbulb from "../assets/LandingLightbulb.png";
import landingTarget from "../assets/LandingTarget.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const fullTitle = "One Paper at a Time";

  useEffect(() => {
    if (title.length < fullTitle.length) {
      const timer = setTimeout(() => {
        setTitle(fullTitle.substr(0, title.length + 1));
      }, 100); // Adjust typing speed here
      return () => clearTimeout(timer);
    }
  }, [title]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex flex-col justify-center items-center">
      {/* Navigation Menu */}
      <nav className="absolute top-0 left-0 w-full py-5 px-10 flex justify-between items-center">
        <div className="logo text-white text-lg font-bold">KeepUp</div>
        <div className="menu">
          {/* <a href="#aboutSection" className="text-white pr-5">
            About
          </a> */}
          <a href="#" className="text-white pr-5">
            Login
          </a>
          <Button onClick={() => navigate("/login/")}>Sign up</Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex flex-row justify-center items-center w-full">
        <div className="text-left pl-10 pr-20">
          <h1 className="text-6xl font-bold mb-4 text-white">{title}</h1>
          <h2 className="text-xl font-medium mb-4 text-white">
            KeepUp with the latest breakthroughs in research.
          </h2>
          {/* <Button onClick={() => navigate("/login/")}>Get Started</Button> */}
        </div>
        <div className="flex-1">
          <img
            src={landingImage}
            alt="Individuals studying research"
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* About Section - Permanent */}

      <div
        id="aboutSection"
        className="w-full px-10 py-5 bg-royal-blue-900 text-white flex flex-row justify-around items-center"
        style={{ marginTop: "auto", height: "400px" }}
      >
        <div className="flex-1 text-center">
          <img
            src={landingRocket}
            alt="Emerging Research"
            style={{ maxWidth: "100px", height: "auto" }}
            className="mx-auto mb-2"
          />
          <h3 className="text-2xl font-bold">Emerging Research</h3>
          <p style={{ fontSize: "20px", color: "gray" }}>
            'This just in' is our daily mantra
          </p>
        </div>

        <div className="flex-1 text-center">
          <img
            src={landingLightbulb}
            alt="Personalized Recommendations"
            style={{ maxWidth: "100px", height: "auto" }}
            className="mx-auto mb-2"
          />
          <h3 className="text-2xl font-bold">Personalized Recommendations</h3>
          <p style={{ fontSize: "20px", color: "gray" }}>
            Curating the latest and greatest papers for you
          </p>
        </div>

        <div className="flex-1 text-center">
          <img
            src={landingTarget}
            alt="Digestible Summaries"
            style={{ maxWidth: "100px", height: "auto" }}
            className="mx-auto mb-2"
          />
          <h3 className="text-2xl font-bold">Digestible Summaries</h3>
          <p style={{ fontSize: "20px", color: "gray" }}>
            No more reading between the lines for insights
          </p>
        </div>
      </div>
      {/* Perhaps a footer or other sections */}
    </div>
  );
};

export default LandingPage;
