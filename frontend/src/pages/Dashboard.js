import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaperContainer } from "../components/ui/paper-container.tsx";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../components/ui/navigation-menu.tsx";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";
import "swiper/css/navigation";

import { supabase } from "../utils/supabase.ts";
import useSupabaseUser from '../hooks/useSupabaseUser'

function Dashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const { user, loading, error } = useSupabaseUser();
  const name = user?.user_metadata.full_name;
  const email = user?.email;

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      navigate('/');  // Ensure the navigation happens immediately after signOut
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 min-h-screen">
      <NavigationMenu user={{ name, email }} logout={logout}>
        <NavigationMenuList>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex flex-row justify-center items-center my-8">
        <h1 className="text-6xl">One paper at a time.</h1>
      </div>

      <div className="flex flex-row justify-center items-center mx-10">
        <Swiper
          direction={"vertical"}
          slidesPerView={"auto"}
          spaceBetween={50}
          centeredSlides={true}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
            thresholdDelta: 10,
            thresholdTime: 4,
            invert: true,
          }}
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
          <SwiperSlide className="h-fit">
            <PaperContainer loading="lazy" />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
          <SwiperSlide className="h-fit">
            <PaperContainer loading="lazy" />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
          <SwiperSlide className="h-fit">
            <PaperContainer loading="lazy" />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
          <SwiperSlide className="h-fit">
            <PaperContainer loading="lazy" />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
          <SwiperSlide className="h-fit">
            <PaperContainer loading="lazy" />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default Dashboard;
