import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PaperContainer } from "../components/ui/paper-container.tsx";
import {
  NavigationMenu,
  NavigationMenuList,
} from "../components/ui/navigation-menu.tsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";
import { supabase } from "../utils/supabase.ts";
import useSupabaseUser from '../hooks/useSupabaseUser.ts';
import api from "../utils/api.js";

function SearchPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading, error } = useSupabaseUser();
  const name = user?.user_metadata.full_name;
  const email = user?.email;
  const [recommendations, setRecommendations] = useState([]);
  const [paperData, setPaperData] = useState({});

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get('q')

  if (!query) {
    navigate('/dashboard/');
  }

  const fetchRecommendations = async () => {
    setIsRecommendationsLoading(true);
    try {
      // insert corpus id into url
      const response = await api.get(`/search/${query}`);  // Adjust this endpoint as needed
      setRecommendations(response.data);
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
      const response = await api.get(`/search/${query}`);  // Adjust this endpoint as needed for pagination
      setRecommendations(prev => [...prev, ...response.data]);
    } catch (error) {
      console.error('Error fetching more recommendations:', error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

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
    if (swiper.activeIndex === swiper.slides.length - 2 && !isMoreLoading) {
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
        <div className="flex-grow">
        <div className="flex-none">
          <div className="flex flex-row justify-center items-center my-4 mx-2 md:mx-10">
            <div className="flex justify-center items-center my-4 mx-2">
              <button
                onClick={() => navigate(-1)}
                className="bg-white text-black font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg"
              >
                Back
              </button>
            </div>
            <div className="flex flex-col justify-center items-center my-4 mx-2">
              <h1 className="text-2xl font-bold text-black text-center">Search Results for: {query}</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center mx-2 md:mx-10">
        {isRecommendationsLoading ? (
          <div className="flex flex-col align-middle justify-center items-center rounded-lg p-6 h-screen overflow-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
            <p className="text-lg text-black">Loading recommendations...</p>
          </div>
        ) : (
          <Swiper
            direction={"vertical"}
            slidesPerView={"auto"}
            spaceBetween={50}
            centeredSlides={true}
            mousewheel={{
              enabled: true,
              forceToAxis: true,
              thresholdDelta: 10,
              thresholdTime: 10,
              invert: false,
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

export default SearchPage;
