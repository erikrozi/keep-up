import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Button } from "./components/ui/button.tsx"

function OnboardingSubtopics() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const selectedTopics = location.state.selectedTopics; 

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


  const [selectedSubtopics, setSelectedSubtopics] = useState([]);
  const [customSubtopic, setCustomSubtopic] = useState("");
  const [selectedCustomSubtopics, setSelectedCustomSubtopics] = useState([]);

  const handleCustomSubtopicAdd = () => {
  if (customSubtopic.trim() !== "") {
    setSelectedSubtopics(prevSubtopics => [...prevSubtopics, customSubtopic.trim()]);
    setCustomSubtopic("");
  }
  };
  
  const subtopicMap = {
    "Machine Learning": ['Gradient Descent', 'Momentum', 'Confusion Matrix', 'Regularization'],
    "Cybersecurity": ['Trust and Safety', 'Threats', 'Offensive', 'Defensive'],
    "Human-Computer Interaction": ['VR', 'AR', 'UX', 'Ethics'],
    "Policy": ['AI', 'Security', 'Blockchain', 'Compute'],
    "Systems": ['Databases', 'Operating Systems', 'Networking', 'Compilers'],
    "Computational Biology": ['Genomics', 'Bioinformatics', 'Differential Equations', 'Numerical Analysis'],
    "Natural Language Processing": ['Linguistics', 'ChatGPT', 'Claude', 'Llama'],
    "Theory": ['Cryptography', 'Linear Algebra', 'Discrete Math', 'Optimization'],
    "Data Science": ["Statistics", "Data Engineering", "Python", "R"],
    "Computer Vision": ["Multimodal", "CNNs", "Object Detection", "Segmentation"]
  };

  const subtopics = selectedTopics.flatMap(topic => subtopicMap[topic]);

  const handleSubtopicToggle = (subtopic) => {
    if (selectedSubtopics.includes(subtopic)) {
      setSelectedSubtopics(selectedSubtopics.filter(selectedSubtopic => selectedSubtopic !== subtopic));
    } else {
      if (selectedSubtopics.length < 15) {
        setSelectedSubtopics([...selectedSubtopics, subtopic]);
      } else {
        alert('You can select up to 15 subtopics.');
      }
    }
  };

  const handleTopicSelectionComplete = () => {
    // Redirect to subtopic selection page with selected topics
    navigate("/dashboard", { state: { selectedSubtopics } })
  };

  return (
    <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 flex justify-center items-center min-h-screen">
      <div className="bg-card border border-gray-200 shadow-lg rounded-lg p-6">
    <div>
      <h2>Select Subtopics</h2>
      <div>
        <h3>Selected Topics:</h3>
        <ul>
          {selectedTopics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      </div>
      <div>
      <h3>Selected Topics:</h3>
      <ul>
        {selectedTopics.map((topic, index) => (
          <li key={index}>
            {topic}
            <ul>
              {subtopicMap[topic].map((subtopic, subIndex) => (
                <li key={subIndex}>
                  <Button
                    onClick={() => handleSubtopicToggle(subtopic)}
                    style={{
                      backgroundColor: selectedSubtopics.includes(subtopic)
                        ? 'lightblue'
                        : 'black'
                    }}  
                  >
                    {subtopic}
                  </Button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div>
        <h3>Selected Subtopics:</h3>
        <ul>
          {selectedSubtopics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      </div>
      <div>
      <input
        type="text"
        placeholder="Enter your own subtopic"
        value={customSubtopic}
        onChange={(e) => setCustomSubtopic(e.target.value)}
      />
      <button onClick={handleCustomSubtopicAdd}>Add</button>
    </div>
      <button onClick={handleTopicSelectionComplete}>Continue to Dashboard</button>
    </div>
    </div>
    </div>
    </div>
  );
};
export default OnboardingSubtopics;