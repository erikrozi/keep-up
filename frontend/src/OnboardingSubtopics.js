import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

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
  
  const subtopicMap = {
    AI: ['ML', 'NLP', 'CV', 'Multimodal'],
    Cyber: ['Policy', 'Threats', 'Offensive', 'Defensive'],
    HCI: ['VR', 'AR', 'UX', 'Ethics']
  };

  /*const subtopics = selectedTopics.flatMap(topic => subtopicMap[topic]);

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
  };*/

  return (
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
    </div>
  );
};
export default OnboardingSubtopics;