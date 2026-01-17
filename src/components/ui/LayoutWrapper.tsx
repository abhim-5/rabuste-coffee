"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LottieLoader from './LottieLoader';
import SmoothScroll from './SmoothScroll';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  // State to track if Lottie animation is done
  const [lottieFinished, setLottieFinished] = useState(false);
  // State to track if video is ready (default true for non-home pages)
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    // Check if user has already seen the loader in this session
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
    
    if (hasSeenLoader) {
      setIsLoading(false);
      setShowContent(true);
      return;
    }

    // Logic for first visit
    const isHomePage = pathname === '/';
    
    // If not home page, video is considered "ready" immediately
    if (!isHomePage) {
      setVideoReady(true);
    } else {
      // For home page, listen for video-loaded event
      const handleVideoLoaded = () => setVideoReady(true);
      window.addEventListener('video-loaded', handleVideoLoaded);
      
      // Safety timeout: if video takes too long (> 5s), proceed anyway
      const timeoutId = setTimeout(() => {
        setVideoReady(true);
      }, 5000);

      return () => {
        window.removeEventListener('video-loaded', handleVideoLoaded);
        clearTimeout(timeoutId);
      };
    }
  }, [pathname]);

  // Effect to handle transition when both constraints are met
  useEffect(() => {
    if (lottieFinished && videoReady) {
      // Both ready -> Hide loader and show content
      sessionStorage.setItem('hasSeenLoader', 'true');
      setIsLoading(false);
      
      setTimeout(() => {
        setShowContent(true);
        // Signal to Hero that loader is gone (starts text animation)
        window.dispatchEvent(new Event('loader-complete'));
      }, 10);
    }
  }, [lottieFinished, videoReady]);

  const handleLoaderComplete = () => {
    setLottieFinished(true);
  };

  return (
    <>
      {isLoading && <LottieLoader onComplete={handleLoaderComplete} />}
      <SmoothScroll>
        <div>
          {children}
        </div>
      </SmoothScroll>
    </>
  );
}
