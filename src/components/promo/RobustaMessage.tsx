"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

gsap.registerPlugin(ScrollTrigger);

export default function RobustaMessage() {
  const sectionRef = useRef<HTMLSectionElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !wrapperRef.current) return;

    // Initialize Splitting for text
    const splitResults = Splitting({ target: "[data-splitting]", by: "words" });

    const ctx = gsap.context(() => {
      // 1. Text Color Revealer (Scrub)
      // "Awaken your boldest senses with"
      const firstMsgWords = sectionRef.current?.querySelectorAll(".first-message .word");
      if (firstMsgWords?.length) {
        gsap.to(firstMsgWords, {
          color: "#faeade", // Milk color
          ease: "power1.in",
          stagger: 0.5, // Much slower stagger for distinct word by word feel
          scrollTrigger: {
            trigger: ".first-message",
            start: "top bottom", // Starts immediately when entering viewport
            end: "bottom center",
            scrub: 1, 
          },
        });
      }

      // "intense dark roast for the fearless soul"
      const secMsgWords = sectionRef.current?.querySelectorAll(".second-message .word");
      if (secMsgWords?.length) {
        gsap.to(secMsgWords, {
          color: "#faeade",
          ease: "power1.in",
          stagger: 0.5,
          scrollTrigger: {
            trigger: ".second-message",
            start: "top bottom",
            end: "bottom center",
            scrub: 1, 
          },
        });
      }

      // 2. Center "PURE ROBUSTA" Reveal
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".msg-text-scroll",
          start: "top bottom", // Starts immediately when entering viewport
          end: "top 40%",
          scrub: 1, 
        },
      });

      revealTl.to(".msg-text-scroll", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power2.inOut",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="message-content relative z-20 h-auto w-full overflow-hidden bg-[#7f3b2d] text-[#faeade] py-8 md:py-32 flex flex-col items-center justify-center"
    >
      <div ref={wrapperRef} className="container mx-auto px-2 md:px-4 w-full flex flex-col items-center justify-center relative">
        
        {/* Main Title Group */}
        <div className="flex flex-col items-center justify-center text-center font-['Antonio'] font-bold uppercase leading-[9vw] tracking-[-.35vw] relative w-full">
          
          {/* Top Text */}
          <h1 
            data-splitting 
            className="first-message text-[11.5vw] md:text-[6.5rem] 2xl:text-[8.5rem] w-full max-w-none md:max-w-6xl 2xl:max-w-7xl text-center text-[#faeade10] z-0 px-1 md:px-0 leading-[1.1]" 
          >
           EXPERIENCE SURAT'S FIRST & ONLY
          </h1>

          {/* Center Reveal Box - Relative with Negative Margins for Overlap */}
          <div 
            className="msg-text-scroll relative z-20 rotate-[3deg] border-[.5vw] border-[#7f3b2d] shadow-xl -my-[1vw] md:-my-4"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }} // Initially closed
          >
            <div className="bg-[#e3a458] px-4 md:px-6 pb-2 md:pb-4">
              <h2 className="text-[#7f3b2d] text-[9.5vw] md:text-[6.5rem] 2xl:text-[8.5rem] font-bold uppercase whitespace-normal md:whitespace-nowrap text-center leading-[0.9] md:leading-[1] tracking-[-.2vw] scale-y-[1.1] scale-x-[0.9] origin-center transform">
                BOLD, DARK, AND STRONG
              </h2>
            </div>
          </div>

          {/* Bottom Text */}
          <h1 
            data-splitting 
            className="second-message text-[11.5vw] md:text-[6.5rem] 2xl:text-[8.5rem] w-full max-w-none md:max-w-6xl 2xl:max-w-7xl text-center text-[#faeade10] z-0 px-1 md:px-0 leading-[1.1]"
          >
            ROBUSTA COFFEE THAT WAKES YOU UP INSTANTLY
          </h1>
        </div>

      </div>
    </section>
  );
}
