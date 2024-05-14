import {Button} from "../components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500">
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-8xl font-bold mb-4 text-white">KeepUp</h1>
                <h2 className="text-3xl font-medium mb-4 text-white">with the latest breakthroughs in research.</h2>
                <Button onClick={() => {navigate("/login/")}}>Get Started</Button>
            </div>
        </div>
     );
}

 
export default LandingPage;