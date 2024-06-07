import React, { useRef, useEffect, useState } from "react";

const VideoAutoPlay = ({ src, width, height, alt }) => {
  const videoRef = useRef(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleUserInteraction = () => setUserInteracted(true);
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && userInteracted) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handlePlay, {
      threshold: 0.5,
    });

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, [userInteracted]);

  return (
    <video
      ref={videoRef}
      className="max-w-full mx-auto md:max-w-none h-auto"
      src={src}
      width={width}
      height={height}
      controls
      muted
      alt={alt}
    />
  );
};

export default VideoAutoPlay;
