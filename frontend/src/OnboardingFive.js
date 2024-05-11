import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

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
        alert('You can only select up to 10 topics.');
      }
    }
  };

  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
         <p> Indicate up to 5 topic areas of interest. </p>


         <div>
      <h2>Select Topics</h2>
      <div>
        {topics.map((topic, index) => (
          <button 
            key={index} 
            onClick={() => handleTopicToggle(topic)} 
            className={selectedTopics.includes(topic) ? 'selected' : ''}
          >
            {topic}
          </button>
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
    </div>

       </div>
     </div>
  );
}
export default OnboardingFive;