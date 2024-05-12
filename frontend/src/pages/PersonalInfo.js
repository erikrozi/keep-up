import React, { useState } from 'react';
import { Checkbox } from "../components/ui/checkbox.tsx"

function PersonalInfo() {
    const [professionalLevel, setProfessionalLevel] = useState({
        levelA: false,
        levelB: false,
        levelC: false
    });

    const [goals, setGoals] = useState({
        goalA: false,
        goalB: false,
        goalC: false
    });

    // Handle professional level checkbox changes
    const handleProfessionalChange = (event) => {
        setProfessionalLevel(prev => ({
            ...prev,
            [event.target.name]: event.target.checked
        }));
    };

    // Handle goals checkbox changes
    const handleGoalsChange = (event) => {
        setGoals(prev => ({
            ...prev,
            [event.target.name]: event.target.checked
        }));
    };

    return (
        <div>
            <h2>What is your professional level?</h2>
            <div>
                <label>
                    <Checkbox checked={professionalLevel.levelA} onChange={handleProfessionalChange} name="levelA" />
                    Level A
                </label>
                <label>
                    <Checkbox checked={professionalLevel.levelB} onChange={handleProfessionalChange} name="levelB" />
                    Level B
                </label>
                <label>
                    <Checkbox checked={professionalLevel.levelC} onChange={handleProfessionalChange} name="levelC" />
                    Level C
                </label>
            </div>

            <h2>What are your goals?</h2>
            <div>
                <label>
                    <Checkbox checked={goals.goalA} onChange={handleGoalsChange} name="goalA" />
                    Goal A
                </label>
                <label>
                    <Checkbox checked={goals.goalB} onChange={handleGoalsChange} name="goalB" />
                    Goal B
                </label>
                <label>
                    <Checkbox checked={goals.goalC} onChange={handleGoalsChange} name="goalC" />
                    Goal C
                </label>
            </div>
        </div>
    );
}

export default PersonalInfo;
