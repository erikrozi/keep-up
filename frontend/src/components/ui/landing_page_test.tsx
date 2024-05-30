import React from "react";
import ReactDOM from "react-dom";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

interface LandingPageProps {
  title: string;
  description: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ title, description }) => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>{title}</h1>
      <p>{description}</p>
      <Button label="Get Started" onClick={() => alert("Getting Started!")} />
      <Button label="Learn More" onClick={() => alert("Learning More!")} />
    </div>
  );
};

ReactDOM.render(
  <LandingPage
    title="Streamline Your Workflow with Acme Web App"
    description="Acme Web App is a powerful tool that helps you manage your tasks, projects, and team collaboration all in one place."
  />,
  document.getElementById("root")
);
