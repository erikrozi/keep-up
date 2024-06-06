import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import useAos from "../hooks/useAos";
import { Button } from "../components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import landingImage from "../assets/rabbit_hopping_flipped.gif";
import landingRocket from "../assets/LandingRocket.png";
import landingLightbulb from "../assets/LandingLightbulb.png";
import landingTarget from "../assets/LandingTarget.png";
import Features from "../components/ui/features.tsx";
import Zigzag from "../components/ui/zigzag.tsx";
import Testimonials from "../components/ui/testimonials.tsx";
import PageIllustration from "../components/ui/page-illustration.tsx";

const LandingPage = () => {
  console.log("Rending Land");
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const fullTitle = "One Paper at a Time";

  // Use custom AOS hook
  useAos({
    disable: "phone",
  });

  useEffect(() => {
    if (title.length < fullTitle.length) {
      const timer = setTimeout(() => {
        setTitle(fullTitle.substr(0, title.length + 1));
      }, 100); // Adjust typing speed here
      return () => clearTimeout(timer);
    }
  }, [title]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-royal-blue-700 via-skyblue-500 to-white flex flex-col justify-center items-center">
      {/* Navigation Menu */}
      <nav className="absolute top-0 left-0 w-full py-5 px-10 flex justify-between items-center">
        <div className="logo text-white text-lg font-bold">KeepUp</div>
        <div className="menu">
          {/* <a href="#aboutSection" className="text-white pr-5">
            About
          </a> */}
          {/* <a href="#" className="text-white pr-5">
            Login
          </a> */}
          <Button
            className="text-white bg-transparent py-2 px-4 rounded hover:bg-transparent hover:text-blue-500"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button onClick={() => navigate("/register")}>Sign Up</Button>
        </div>
      </nav>
      {/* Main Content */}
      <div
        className="flex-grow flex flex-row justify-center items-center w-full"
        style={{ marginTop: "5rem" }}
      >
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

      {/* <Features style={{ backgroundColor: "black" }} /> */}

      {/* About Section - Permanent */}
      <div
        id="aboutSection"
        className="w-full px-10 py-5 text-white flex flex-row justify-around items-center"
        style={{ marginTop: "auto", height: "400px" }}
        data-aos-id-blocks
      >
        <div
          className="flex-1 text-center"
          data-aos="fade-up"
          data-aos-anchor="[data-aos-id-blocks]"
        >
          <img
            src={landingRocket}
            alt="Emerging Research"
            style={{ maxWidth: "100px", height: "auto" }}
            className="mx-auto mb-4"
          />
          <h3 className="text-2xl font-bold mb-2">Emerging Research</h3>
          <p
            className="text-xl text-cornflower-900"
            style={{ fontSize: "20px" }}
          >
            'This just in' is our daily mantra
          </p>
        </div>

        <div
          className="flex-1 text-center"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-anchor="[data-aos-id-blocks]"
        >
          <img
            src={landingLightbulb}
            alt="Personalized Recommendations"
            style={{ maxWidth: "100px", height: "auto" }}
            className="mx-auto mb-4"
          />
          <h3 className="text-2xl font-bold mb-2">
            Personalized Recommendations
          </h3>
          <p
            className="text-xl text-cornflower-900"
            style={{ fontSize: "20px" }}
          >
            Curating the latest and greatest papers for you
          </p>
        </div>

        <div
          className="flex-1 text-center"
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-anchor="[data-aos-id-blocks]"
        >
          <img
            src={landingTarget}
            alt="Digestible Summaries"
            style={{ maxWidth: "100px", height: "auto" }}
            className="mx-auto mb-4"
          />
          <h3 className="text-2xl font-bold mb-2">Digestible Summaries</h3>
          <p
            className="text-xl text-cornflower-900"
            style={{ fontSize: "20px" }}
          >
            No more reading between the lines for insights
          </p>
        </div>
      </div>

      <Zigzag />

      <PageIllustration />
      <Testimonials />

      {/* Footer */}
      {/* Footer */}
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Team 21. The source code is available on GitHub
            <a
              // href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {" "}
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
