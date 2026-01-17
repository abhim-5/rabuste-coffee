'use client';

import { useState } from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '../../../public/loader.json';

interface LottieLoaderProps {
  onComplete: () => void;
}

export default function LottieLoader({ onComplete }: LottieLoaderProps) {
  const [isHiding, setIsHiding] = useState(false);

  const handleAnimationComplete = () => {
    // Start hiding animation
    setIsHiding(true);
    // Call onComplete after fade-out transition
    setTimeout(() => {
      onComplete();
    }, 500); // Match the CSS transition duration
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#1a1311] transition-opacity duration-500 ${
        isHiding ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-64 h-64 md:w-96 md:h-96">
        <Lottie
          animationData={loaderAnimation}
          loop={false}
          autoplay={true}
          onComplete={handleAnimationComplete}
        />
      </div>
    </div>
  );
}
