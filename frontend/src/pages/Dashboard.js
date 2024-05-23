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
  const [paper, setPaper] = useState(null);
  const [abstract, setAbstract] = useState(null);
  const [recommendedPaperId, setRecommendedPaperId] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const { user, loading, error } = useSupabaseUser();
  console.log("dashboard user:", user);
  const name = user?.user_metadata.full_name;
  const email = user?.email;

  useEffect(() => {
    // Fetch the recommended paper ID from your backend
    const fetchRecommendedPaperId = async () => {
      // TODO -- Replace with backend logic
      // const recommendedId = await getRecommendedPaperId();
      const recommendedId = 257038910;
      setRecommendedPaperId(recommendedId);
    };

    fetchRecommendedPaperId();
  }, []);

  useEffect(() => {
    if (recommendedPaperId) {
      const fetchPaperData = async () => {
        const { data, error } = await supabase
          .from('paper_metadata')
          .select('*')
          .eq('corpus_id', recommendedPaperId);

        if (error) {
          console.error('Error fetching paper data:', error);
        } else {
          console.log("paper: ", data[0]);
          setPaper(data[0]);
        }
      };

      fetchPaperData();
    }
  }, [recommendedPaperId]);

  useEffect(() => {
    if (recommendedPaperId) {
      const fetchAbstractData = async () => {
        const { data, error } = await supabase
          .from('paper_abstract')
          .select('*')
          .eq('corpus_id', recommendedPaperId);

        if (error) {
          console.error('Error fetching paper data:', error);
        } else {
          console.log("abstract: ", data[0]);
          setAbstract(data[0]);
        }
      };

      fetchAbstractData();
    }
  }, [recommendedPaperId]);

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
  if (!paper || !abstract) {
    return <p>Loading...</p>;
  }
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
            <PaperContainer loading="lazy" paper={paper} abstract={abstract} user={user} />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
          <SwiperSlide className="h-fit">
            <PaperContainer loading="lazy" paper={paper} abstract={abstract} user={user} />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
          <SwiperSlide className="h-fit">
            <PaperContainer loading="lazy" paper={paper} abstract={abstract} user={user} />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
          <SwiperSlide className="h-fit">
            <PaperContainer loading="lazy" paper={paper} abstract={abstract} user={user} />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
          <SwiperSlide className="h-fit">
            <PaperContainer loading="lazy" paper={paper} abstract={abstract} user={user} />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default Dashboard;
