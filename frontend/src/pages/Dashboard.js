import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Button } from "../components/ui/button.tsx";
import { PaperContainer } from "../components/ui/paper-container.tsx";

function Dashboard() {
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
  return (
    <div className="bg-white min-h-screen">
       <div className="dashboard__container">
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         <Button className="dashboard__btn" onClick={logout}>
          Logout
         </Button>
       </div>

        <PaperContainer />
        <PaperContainer />
        <PaperContainer />
        <PaperContainer />
     </div>
  );
}
export default Dashboard;