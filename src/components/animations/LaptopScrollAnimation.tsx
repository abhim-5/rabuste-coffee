"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Counter from "@/components/ui/Counter";

export default function LaptopScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- SCROLL SETUP ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start start": animation starts when top of container hits top of viewport
    // "end end": animation ends when bottom of container hits bottom of viewport
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 40,
    mass: 2, // Heavier feel for smoother momentum
    restDelta: 0.001,
  });

  // --- ANIMATION CONTROLS ---

  // 1. Lid Opening: 0% -> 25% of scroll
  // Closed (-90deg) to Open (0deg)
  const lidRotateX = useTransform(smoothProgress, [0, 0.25], [-117, -10]);

  // 2. Zoom Scale: 15% -> 80% of scroll
  // Ends early (0.8) so it stays static while the next section slides over it
  const scale = useTransform(smoothProgress, [0.15, 0.8], [1, 3]);

  // 3. Text Reveal - Marquee Animation (scrolls from right to left)
  // Double Layer Parallax: Two speeds for depth effect

  // Ghost Layer (Background) - Moves faster/slower for depth
  const textGhostX = useTransform(smoothProgress, [0, 0.8], [1800, -1800]);

  // Main Layer (Foreground)
  const textMainX = useTransform(smoothProgress, [0, 0.8], [1400, -1400]);

  const textOpacity = useTransform(smoothProgress, [0, 0.05, 0.6, 0.7], [0, 1, 1, 0]);

  // Video Playback Logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const unsubscribe = smoothProgress.on("change", (latest) => {
      // TRIGGER_THRESHOLD: How far the lid opens before video starts.
      // 0.03 means 3% through the animation.
      const TRIGGER_THRESHOLD = 0.03;

      if (latest > TRIGGER_THRESHOLD) {
        if (video.paused && !isPlaying) {
          video.play().catch(() => { });
          setIsPlaying(true);
        }
      } else {
        // Reset if scrolled back top
        if (!video.paused || video.currentTime > 0) {
          video.pause();
          video.currentTime = 0;
          setIsPlaying(false);
        }
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, isPlaying]);

  // --- DIMENSIONS & CONFIG ---
  // Adjust these to change the size of the laptop
  const SCREEN_WIDTH = 600;  // Width of the laptop body
  const SCREEN_HEIGHT = 380; // Height of the screen part

  // Independent Keyboard Size Control
  // Change this value to resize ONLY the keyboard image
  const KEYBOARD_WIDTH = 600;

  // Pivot point calculation (Center Zoom anchor)
  const HINGE_Y_OFFSET = SCREEN_HEIGHT / 1.2;

  return (
    // Main Container Area (height determines scroll length, e.g. 400vh = 4 screens long)
    <div
      ref={containerRef}
      className="relative hidden h-[400vh] w-full bg-[#D8CBB8] lg:block"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden perspective-[2000px]">

        {/* --- BACKGROUND ART --- 
            Hand-drawn sketches blending subtly with the background.
        */}
        <img
          src="/coffee-sketch-pattern.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.06] select-none pointer-events-none z-0 mix-blend-multiply"
        />

        {/* --- CINEMATIC TEXT MARQUEE ---
            Single Layer, Huge, Smooth.
        */}
        <motion.div
          style={{
            opacity: 0.1, // Very subtle
            x: textGhostX,
          }}
          className="absolute z-0 flex flex-col items-center justify-center text-center select-none top-[12%] pointer-events-none whitespace-nowrap blur-[1px]"
        >
          <h1 className="text-[280px] font-black leading-[0.8] tracking-tighter text-black">
            EXPERIENCE THE BOLDNESS
          </h1>
        </motion.div>

        {/* Layer 2: Main (Front) */}
        <motion.div
          style={{
            opacity: textOpacity,
            x: textMainX,
          }}
          className="absolute z-0 flex flex-col items-center justify-center text-center select-none top-[15%] pointer-events-none whitespace-nowrap"
        >
          <h1 className="text-[280px] font-black leading-[0.8] tracking-tighter text-[#1a1a1a] drop-shadow-2xl">
            EXPERIENCE THE BOLDNESS
          </h1>
        </motion.div>

        {/* --- ROOT GROUP --- 
            Controls the position of the whole system.
        */}
        <motion.div
          style={{
            scale,
            // ZOOM ANCHOR POINT
            // "center center" -> Zooms into the middle of the screen
            // "center top" -> Zooms into the top edge
            // "center bottom" -> Zooms into the bottom edge
            transformOrigin: "center 60%", // Lowered slightly from center
            transformStyle: "preserve-3d",
            // VERTICAL SHIFT: Changes the starting vertical position.
            // Negative numbers move it UP, Positive move it DOWN.
            y: -200,
            rotateX: 27, // TILT: Look down at the laptop to see the keyboard
          }}
          className="relative flex items-center justify-center w-0 h-0 z-10"
        >

          {/* 3D Wrapper */}
          <div className="relative" style={{ transformStyle: "preserve-3d" }}>

            {/* --- LID (SCREEN) --- */}
            <motion.div
              style={{
                rotateX: lidRotateX,
                transformOrigin: "bottom",
                transformStyle: "preserve-3d",
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
                bottom: -HINGE_Y_OFFSET, // Attaches bottom of lid to hinge line
                left: -SCREEN_WIDTH / 2, // Centers horizontally
              }}
              className="absolute bg-black rounded-t-[32px] flex flex-col items-center justify-start shadow-xl origin-bottom"
            >
              {/* Bezel */}
              <div className="absolute inset-0 bg-[#0d0d0d] rounded-t-[32px] border-[1px] border-[#333]" />

              {/* Screen Area (Video Container) */}
              <div className="relative z-10 w-[96%] h-[92%] mt-[2%] bg-black overflow-hidden rounded-t-[16px] border border-white/5">
                <video
                  ref={videoRef}
                  src="/rabuste-video2.mp4"
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              </div>

              {/* Visuals: Camera & Reflection */}
              <div className="absolute top-[8px] bg-[#222] w-2 h-2 rounded-full z-20" />
              <div className="absolute inset-0 z-20 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-t-[28px]" />

              {/* Back of Lid (MacBook Silver) */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#e3e3e3] to-[#d6d6d6] rounded-t-[28px] flex items-center justify-center border-[1px] border-[#cecece] shadow-sm"
                style={{
                  transform: "rotateY(180deg) translateZ(1px)", // Adjusted thickness spacing
                  backfaceVisibility: "hidden"
                }}
              >
                {/* Apple Logo */}
                <div className="opacity-90">
                  <svg viewBox="0 0 24 24" fill="#333" className="w-16 h-16 drop-shadow-sm">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.79-1.31.02-2.3-1.23-3.17-2.59C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.5 1.3 0 2.22.88 2.91.88.7 0 1.95-.92 3.23-.92 1.09 0 2.15.52 2.93 1.36-2.61 1.55-2.18 5.7.53 6.94-.48 1.44-1.12 2.87-1.71 4.35zM13 3.5c.57-1.48 2.65-2.19 3.93-1.2.62 1.48-.68 3.52-1.95 3.56-.99.09-2.28-1.25-1.98-2.36z" />
                  </svg>
                </div>
              </div>
            </motion.div>


            {/* --- BASE (KEYBOARD) --- */}
            <div
              className="absolute"
              style={{
                top: HINGE_Y_OFFSET, // Starts at hinge line
                left: -SCREEN_WIDTH / 1.6,
                width: 749,
                transformOrigin: "top",
                transform: "rotateX(-90deg)", // Rotated flat (90 degrees relative to upright)
                transformStyle: "preserve-3d"
              }}
            >
              {/* The Image Asset */}
              <img
                src="/only-keyboard.png"
                alt="Keyboard"
                className="w-full h-auto"
              />
            </div>

            {/* --- HINGE CYLINDER --- 
                Hides the gap between Screen and Base
            */}
            <div
              className="absolute w-[95%] h-[16px] bg-[#1a1a1a] rounded-full"
              style={{
                top: HINGE_Y_OFFSET - 8,
                left: -(SCREEN_WIDTH * 0.95) / 2,
                transform: "rotateX(90deg)",
              }}
            />

          </div>
        </motion.div>

        {/* --- STATS SECTION (STATIC - Does NOT Zoom) --- 
            Positioned "below" the keyboard. 
            Z-Index 0 so the laptop (Z-10) grows OVER it.
        */}
        <div className="absolute z-0 w-full flex justify-center items-start top-[68%]">
          <div className="grid grid-cols-3 gap-56 text-center w-[1200px]">
            {[
              { value: 250, title: "VARIETIES OF COFFEE", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit aenean" },
              { value: 123, title: "HOURS OF TESTING", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit aenean" },
              { value: 321, title: "COFFEE MARKETS", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit aenean" }
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="font-display text-8xl text-[#A67C52] mb-4">
                  <Counter value={stat.value} />
                </div>
                <h3 className="font-display text-2xl tracking-wider text-[#262626] uppercase mb-3 font-semibold whitespace-nowrap">
                  {stat.title}
                </h3>
                <p className="font-serif text-[#444] max-w-sm mx-auto leading-relaxed text-lg">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
