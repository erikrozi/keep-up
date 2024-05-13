import {Button} from "../components/ui/button.tsx";
import keepup_text_white from "../assets/keepup_text_white.png"
import { useNavigate } from "react-router-dom";

const landingText = "with the latest breakthroughs in research.";

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/login");
    };

    return ( 
        <div className="min-h-screen bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500">
            <div className="flex flex-col justify-center items-center h-screen">
                <img src={keepup_text_white} alt="KeepUp" className="mb-4" />
                <h1 className="text-3xl font-medium mb-4 text-white">{landingText}</h1>
                <Button onClick={handleGetStarted}>
                    Get started
                </Button>
            </div>
        </div>
     );
}

 
export default LandingPage;