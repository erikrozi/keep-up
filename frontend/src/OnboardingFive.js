import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

import { Checkbox } from "./components/ui/checkbox.tsx"
import { useForm } from "react-hook-form"
import ProgressBar from './components/ui/progressbar.js';
import { Button } from "./components/ui/button.tsx"


function OnboardingFive() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    };
    fetchUserName();
  }, [user, loading, navigate]);


  const [selectedTopics, setSelectedTopics] = useState([]);
  
  const topics = [
    'Machine Learning', 'Cybersecurity', 'Human-Computer Interaction', 'Policy', 'Systems', 
    'Computational Biology', 'Natural Language Processing', 'Theory', 'Data Science', 'Computer Vision'
  ];

  const handleTopicToggle = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(selectedTopic => selectedTopic !== topic));
    } else {
      if (selectedTopics.length < 5) {
        setSelectedTopics([...selectedTopics, topic]);
      } else {
        alert('You can only select up to 5 topics.');
      }
    }
  };

  const handleTopicSelectionComplete = () => {
    // Redirect to subtopic selection page with selected topics
    navigate("/onboardingsubtopics", { state: { selectedTopics } })
  };

  return (
    <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
      <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6">
        <div className="dashboard">
           <div className="dashboard__container">
      
             <p> Indicate up to 5 topic areas of interest. </p>


             <div>
          <h2>Select Topics</h2>
          <div>
            {topics.map((topic, index) => (
              <Button 
                key={index} 
                onClick={() => handleTopicToggle(topic)} 
                className={selectedTopics.includes(topic) ? 'selected' : ''}
              >
                {topic}
              </Button>
            ))}
          </div>
          <div>
            <h3>Selected Topics:</h3>
            <ul>
              {selectedTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
          <button onClick={handleTopicSelectionComplete}>Continue to Subtopics</button>
        </div>

           </div>
         </div>
      </div>
    </div>
  );
}
export default OnboardingFive;