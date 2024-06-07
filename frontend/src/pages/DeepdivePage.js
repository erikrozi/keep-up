import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PaperContainer } from "../components/ui/paper-container.tsx";
import {
  NavigationMenu,
  NavigationMenuList,
} from "../components/ui/navigation-menu.tsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "swiper/css/navigation";
import { supabase } from "../utils/supabase.ts";
import useSupabaseUser from '../hooks/useSupabaseUser.ts';
import api from "../utils/api.js";

function DeepdivePage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading, error } = useSupabaseUser();
  const name = user?.user_metadata.full_name;
  const email = user?.email;
  const [recommendations, setRecommendations] = useState([]);
  const [paperData, setPaperData] = useState({});

  const { corpus_id } = useParams();

  const fetchRecommendations = async () => {
    setIsRecommendationsLoading(true);
    try {
      // insert corpus id into url
      const response = await api.get(`/users/deepdive/${corpus_id}`);  // Adjust this endpoint as needed
      setRecommendations(response.data.recommendations);
      setPaperData(response.data.paper_data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return <p>Error fetching recommendations: {error.message}</p>;
    } finally {
      setIsRecommendationsLoading(false);
    }
  };

  const fetchMoreRecommendations = async () => {
    setIsMoreLoading(true);
    try {
      const response = await api.get(`/users/deepdive/${corpus_id}`);  // Adjust this endpoint as needed for pagination
      setRecommendations(prev => [...prev, ...response.data.recommendations]);
    } catch (error) {
      console.error('Error fetching more recommendations:', error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [corpus_id]);

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

  // When the user first views a new paper, we want to mark it as viewed
  const markPaperAsViewed = async (paper_id) => {
    try {
      await api.post("/users/viewed", { corpus_id: paper_id });
    } catch (error) {
      console.error('Error marking paper as viewed:', error);
    }
  };

  const handleSlideChange = (swiper) => {
    if (swiper.activeIndex === swiper.slides.length - 2 && !isMoreLoading && recommendations.length > 0) {
      fetchMoreRecommendations();
    }

    // If not is more loading or not last slide, mark the paper as viewed
    if (!isMoreLoading && swiper.activeIndex < recommendations.length) {
      markPaperAsViewed(recommendations[swiper.activeIndex]);
    }
  };

  if (loading) return <p>Loading user information...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 h-screen overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-none">
          <NavigationMenu user={{ name, email }} logout={logout}>
            <NavigationMenuList>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex-grow flex flex-col items-center mx-2 md:mx-10">
          <div className="w-full flex flex-col items-center my-4 bg-white rounded-lg shadow-lg py-4 px-6">
            <h1 className="text-xl md:text-2xl font-bold text-black text-center">Similar papers to: {paperData.title}</h1>
          </div>
          <div className="w-full flex-grow">
            {isRecommendationsLoading ? (
              <div className="flex flex-col align-middle justify-center items-center rounded-lg p-6 h-screen overflow-auto">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
                <p className="text-lg text-black">Loading recommendations...</p>
              </div>
            ) : (
              <Swiper
                direction={"horizontal"}
                slidesPerView={"auto"}
                spaceBetween={50}
                centeredSlides={true}
                navigation={true}
                keyboard={{
                  enabled: true,
                  onlyInViewport: false,
                }}
                pagination={{
                  dynamicBullets: true,
                  clickable: true,
                }}
                modules={[Pagination, Keyboard, Navigation]}
                autoHeight={true}
                onSlideChange={handleSlideChange}
              >
                {recommendations.map((paper_id) => (
                  <SwiperSlide key={paper_id} className="h-fit flex items-center">
                    <PaperContainer corpus_id={paper_id} user={user} />
                  </SwiperSlide>
                ))}
                {isMoreLoading && (
                  <SwiperSlide key="loading" className="h-fit flex justify-center items-center">
                    <div className="flex flex-col align-middle justify-center items-center bg-card border border-gray-200 shadow-lg rounded-lg p-6 h-[80vh] overflow-auto">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
                      <p className="text-lg text-black">Loading recommendations...</p>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeepdivePage;