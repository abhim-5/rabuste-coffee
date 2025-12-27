"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Preloader from "@/components/ui/Preloader";

export function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if video is already ready (e.g. from cache)
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true);
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isVideoLoaded && <Preloader />}
      </AnimatePresence>
      <section className="relative z-30 min-h-[92vh] w-full overflow-hidden bg-black">
        {/* Background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          onCanPlayThrough={() => setIsVideoLoaded(true)}
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40" aria-hidden>
          <div className="grain-texture h-full w-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 pt-36 pb-28 text-center lg:px-8 lg:pt-44">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display tracking-wide text-white text-[clamp(2rem,10vw,5.5rem)] leading-tight drop-shadow-2xl"
          >
            RABUSTE COFFEE
          </motion.h1>

          {/* Divider with icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(15px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 mb-8 flex items-center gap-4 text-white/90"
          >
            <span className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <Coffee className="h-6 w-6" />
            <span className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(15px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif mx-auto max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl"
          >
            Experience Surat's 1st & Only Dark Roast Robusta Cafe. The boldest coffee in town,
            crafted for those who demand intensity and flavor. Your premium grab-and-go destination
            for authentic dark roast excellence.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12"
          >
            <Link href="/" className="group">
              <span className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/5 px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-white/95 backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/10">
                Shop Here
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Hero;
