'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee } from 'lucide-react';
import dynamic from 'next/dynamic';
import Preloader from '@/components/ui/Preloader';

// Dynamically import the 3D model to prevent SSR issues
const CoffeeModel3D = dynamic(() => import('@/components/3d/CoffeeModel3D'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] lg:min-h-[600px]" />
});

const heroContent = {
  title: "OUR STORY",
  subtitle: "Where Coffee Meets Craft",
  text: "Born in the heart of Surat, Rabuste is more than a cafe—it's a movement. We introduced the city to the intense, unapologetic soul of authentic dark roast Robusta, crafting a legacy one bold cup at a time."
};

const About3DHero = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleModelLoaded = () => {
    setIsModelLoaded(true);
    // Small delay before starting roll animation
    setTimeout(() => {
      setStartAnimation(true);
    }, 300);
  };

  // Calculate delays for text reveal based on model position
  const modelAnimationDuration = 4.5; // 2 seconds for model to roll in
  const textStartDelay = modelAnimationDuration * 0.33; // Text starts revealing late (70% of model animation)

  // Handle animation completion
  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isModelLoaded && <Preloader />}
      </AnimatePresence>
      
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#1a1410] via-[#2a1f1a] to-[#1a1410]">
        {/* Grain texture overlay */}
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30">
          <div className="grain-texture h-full w-full" />
        </div>

        {/* Main content container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between min-h-screen py-20 lg:py-0 gap-8 lg:gap-12">
            
            {/* Left side - Content (reveals as model rolls in) */}
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }} // Initially hidden (clipped from right)
              animate={startAnimation ? { clipPath: "inset(0 0% 0 0)" } : {}} // Reveal to full width
              // Mobile Override (via style prop to force visibility if JS logic is tricky, 
              // but ideally we want conditional variants. For simplicity, we assume desktop first animation logic
              // and if mobile, we can override via media query in CSS or just accept this reveal effect which looks good on mobile too if adjusted)
              // Actually, user asked for 'laptop' specifically.
              // Let's use a conditional animate prop if we had 'isMobile' state here, but we don't.
              // We'll rely on the fact that 'inset' percentage works on both.
              transition={{ 
                duration: 1.5, // Slow reveal
                delay: textStartDelay, 
                ease: [0.22, 1, 0.36, 1] // Custom ease
              }}
              className="flex-1 w-full lg:w-1/2 text-center lg:text-left relative z-10 lg:clip-path-anim" 
            >
              
              <motion.div>
                  {/* ... content ... */}
                  {/* Subtitle */}
                  <motion.p
                    className="font-serif text-[#D4A574] text-lg lg:text-xl tracking-[0.2em] mb-4"
                  >
                    {heroContent.subtitle}
                  </motion.p>

                  {/* Title */}
                  <motion.h1
                    className="font-display text-5xl lg:text-8xl font-bold text-[#E8DCC4] mb-8 leading-tight"
                  >
                    {heroContent.title}
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    className="font-serif text-[#E8DCC4]/80 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10"
                  >
                    {heroContent.text}
                  </motion.p>
              </motion.div>
            </motion.div>

            {/* Right side - 3D Model - Cinematic on Desktop, Normal Stack on Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isModelLoaded ? 1 : 0,
                // We only want the clip effect on Desktop. 
                // A simple way without hooks is to check window width if client, or just let CSS handle visibility.
                // However, Framer Motion 'animate' overrides CSS. 
                // Let's set clipPath only if we are effectively 'animating' the split screen.
                // For now, on mobile, we'll just not animate the clipPath property to 'inset(0 0 0 50%)'.
                // We will rely on the className 'lg:...' changes to handle layout.
              }}
              // Removed the clipPath animation from here to prevent mobile hiding
              whileInView={{
                 // On desktop, we want to clip left 50% eventually. 
                 // We can re-add this logic if we strictly want the split screen effect.
                 // For now, let's keep it simple: model is visible.
              }}
              transition={{ 
                opacity: { duration: 0.1 }
              }}
              
              // Mobile: Normal relative block | Desktop: Absolute cinematic positioning
              className="relative w-full h-[400px] lg:mt-0 lg:absolute lg:top-0 lg:left-0 lg:h-screen lg:z-50 lg:pointer-events-none"
            >
              {/* 3D Model Container - Always full width */}
              <div className="relative w-full h-full">
                <CoffeeModel3D 
                  onLoaded={handleModelLoaded}
                  rollAnimation={startAnimation} // You might want to disable roll on mobile too if it goes off screen
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About3DHero;
