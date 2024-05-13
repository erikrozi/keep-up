import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Button } from "../components/ui/button.tsx";
import { PaperContainer } from "../components/ui/paper-container.tsx";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, Mousewheel, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/keyboard';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';

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
    <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 min-h-screen">
        <div className="flex flex-row justify-between items-center p-4">
        Logged in as
          <div>{name}</div>
          <div>{user?.email}</div>
          <Button className="dashboard__btn" onClick={logout}>
          Logout
          </Button>
        </div>

        <div className="flex flex-row justify-center items-center my-8">
          <h1 className="text-6xl">One paper at a time.</h1>
        </div>

        <div className="flex flex-row justify-center items-center mx-10">

        <Swiper
            direction={'vertical'}
            slidesPerView={'auto'}
            spaceBetween={50}
            centeredSlides={true}
            mousewheel={
              {
                enabled: true,
                forceToAxis: true,
                thresholdDelta: 5,
                thresholdTime: 1000,
                invert: true
              }
            }
            keyboard={{
                enabled: true,
                onlyInViewport: false,
            }}
            pagination={{
                dynamicBullets: true,
                clickable: true,
            }}
            modules={[Pagination, Keyboard, Mousewheel]}
            autoHeight={true}
        >
            <SwiperSlide className="h-fit"><PaperContainer loading="lazy"/><div class="swiper-lazy-preloader"></div></SwiperSlide>
            <SwiperSlide className="h-fit"><PaperContainer loading="lazy"/><div class="swiper-lazy-preloader"></div></SwiperSlide>
            <SwiperSlide className="h-fit"><PaperContainer loading="lazy"/><div class="swiper-lazy-preloader"></div></SwiperSlide>
            <SwiperSlide className="h-fit"><PaperContainer loading="lazy"/><div class="swiper-lazy-preloader"></div></SwiperSlide>
            <SwiperSlide className="h-fit"><PaperContainer loading="lazy"/><div class="swiper-lazy-preloader"></div></SwiperSlide>
        </Swiper>
        </div>
     </div>
  );
}
export default Dashboard;