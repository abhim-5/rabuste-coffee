"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

gsap.registerPlugin(ScrollTrigger);

// Helper function to wrap elements
const wrapElements = (elems: Element[], wrapType: string, wrapClass: string) => {
  elems.forEach(char => {
    const wrapper = document.createElement(wrapType);
    wrapper.classList.add(wrapClass);
    if (char.parentNode) {
      char.parentNode.insertBefore(wrapper, char);
      wrapper.appendChild(char);
    }
  });
};

export default function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    if (animationPlayed) return;

    // Dynamically import Splitting to avoid SSR issues
    const initializeSplitting = async () => {
      const Splitting = (await import("splitting")).default;
      
      // Initialize Splitting only if not already split
      if (titleRef.current && titleRef.current.querySelectorAll('.char').length === 0) {
        Splitting({ target: titleRef.current, by: "chars" });
      }
      
      // Select characters created by Splitting (or existing ones)
      const chars = titleRef.current?.querySelectorAll(".char");
      
      if (!chars || chars.length === 0) return;

      // Wrap each character - exactly like typography demo
      // Check if wrapping is needed
      if (!chars[0].parentElement?.classList.contains('char-wrap')) {
          wrapElements(Array.from(chars), "span", "char-wrap");
      }

      // Set initial state IMMEDIATELY to prevent any flash of unstyled text
      gsap.set(chars, {
        opacity: 0,
        xPercent: -250,
        rotationZ: 45,
        scaleX: 6,
        transformOrigin: "100% 50%",
      });

      // Function to run animation
      const runAnimation = () => {
        if (!titleRef.current) return;
        
        // Make h1 visible
        titleRef.current.style.opacity = "1";
        
        gsap.to(
          chars,
          {
            duration: 2.5, // Even slower for maximum smoothness
            ease: "power2.inOut", // InOut for smoother start AND end
            xPercent: 0,
            rotationZ: 0,
            scaleX: 1,
            opacity: 1, 
            stagger: -0.03, // Small stagger for continuous flow
            onComplete: () => setAnimationPlayed(true),
          }
        );
      };

      // Check if video is already ready (e.g. from cache)
      if (videoRef.current && videoRef.current.readyState >= 3) {
        setIsVideoLoaded(true);
        window.dispatchEvent(new Event('video-loaded'));
      }

      // Function to start everything (video + text)
      const startExperience = () => {
         if (videoRef.current) {
            videoRef.current.currentTime = 0; // Reset to start
            videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
         }
         // Small delay for text to start slightly after video begins
         setTimeout(runAnimation, 500); 
      };

      // Check if loader has been seen
      if (sessionStorage.getItem('hasSeenLoader')) {
        // If already seen, run immediately
        startExperience();
      } else {
        // Otherwise wait for loader completion event
        const handleLoaderComplete = () => {
          startExperience();
        };
        
        window.addEventListener('loader-complete', handleLoaderComplete);
        
        return () => {
          window.removeEventListener('loader-complete', handleLoaderComplete);
        };
      }
    };

    initializeSplitting();
  }, [animationPlayed]);

  return (
    <>
      <section className="relative z-30 min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        {/* Background video with optimization */}
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="auto"
          className={`absolute left-0 top-0 h-full w-full object-cover ${
            isVideoLoaded ? "opacity-60" : "opacity-0"
          }`}
          onCanPlay={() => {
            setIsVideoLoaded(true);
            window.dispatchEvent(new Event('video-loaded'));
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

        {/* RABUSTE Typography */}
        <div className="relative z-10 w-full px-2">
          <h1
            ref={titleRef}
            data-splitting
            className="hero-title text-center font-tan-pearl text-[18vw] lg:text-[13vw] leading-[1.4] tracking-tight opacity-0"
            style={{ color: "#fff9eb" }}
          >
            rabuste
          </h1>
        </div>
      </section>
    </>
  );
}
