import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import useSupabaseUser from '../hooks/useSupabaseUser';
import api from "../utils/api";

function Dashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const navigate = useNavigate();
  const { user, loading, error } = useSupabaseUser();
  const name = user?.user_metadata.full_name;
  const email = user?.email;
  const [userRecommendations, setUserRecommendations] = useState([]);

  const fetchUserRecommendations = async () => {
    setIsRecommendationsLoading(true);
    try {
      const response = await api.get("/users/recommend");
      setUserRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsRecommendationsLoading(false);
    }
  };

  const fetchMoreRecommendations = async () => {
    setIsMoreLoading(true);
    try {
      const response = await api.get("/users/recommend");  // Adjust this endpoint as needed for pagination
      setUserRecommendations(prev => [...prev, ...response.data]);
    } catch (error) {
      console.error('Error fetching more recommendations:', error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRecommendations();
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
    if (swiper.activeIndex === swiper.slides.length - 2 && !isMoreLoading && userRecommendations.length > 0) {
      fetchMoreRecommendations();
    }

    // If not is more loading or not last slide, mark the paper as viewed
    if (!isMoreLoading && swiper.activeIndex < userRecommendations.length) {
      markPaperAsViewed(userRecommendations[swiper.activeIndex]);
    }
  };

  if (loading) return <p>Loading user information...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-gradient-to-r from-skyblue-500 via-white-500 to-royal-blue-500 h-screen overflow-hidden">
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Welcome to your feed!</h2>
            <p className="mb-4 font-bold">Here's how you can use this page:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Scroll up or down to navigate through the recommended papers.</li>
              <li>Use the keyboard arrow keys for navigation as well.</li>
              <li>Double-click or press the like button to like a paper (This helps us recommend you better papers!)</li>
              <li>If you need more recommendations, simply swipe to the bottom to load more.</li>
            </ul>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowInstructions(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full">
        <div className="flex-none">
          <NavigationMenu user={{ name, email }} logout={logout}>
            <NavigationMenuList>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex-grow">
        <div className="flex flex-row justify-center items-center mx-2 my-2 md:mx-10 md:my-10">
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
            {userRecommendations.map((paper_id) => (
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

export default Dashboard;
