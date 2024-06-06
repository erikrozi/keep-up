import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const useAos = (options = {}) => {
  useEffect(() => {
    console.log("Initializing AOS");
    AOS.init({
      ...options,
    });

    return () => AOS.refresh(); // Refresh when the component unmounts
  }, [options]);

  useEffect(() => {
    console.log("Refreshing AOS on cleanup");
    AOS.refreshHard(); // Refresh AOS to recognize new DOM elements
  });
};

export default useAos;
