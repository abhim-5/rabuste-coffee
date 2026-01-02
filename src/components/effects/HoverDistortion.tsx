"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

interface HoverDistortionProps {
  image1: string;
  image2: string;
  displacementImage: string;
  intensity?: number;
  speedIn?: number;
  speedOut?: number;
  className?: string;
  disableAutoTrigger?: boolean; // New prop to disable auto-trigger on scroll
}

export interface HoverDistortionRef {
  next: () => void;
  previous: () => void;
}

export const HoverDistortion = forwardRef<HoverDistortionRef, HoverDistortionProps>(({
  image1,
  image2,
  displacementImage,
  intensity = 0.5,
  speedIn = 1.6,
  speedOut = 1.2,
  className = "",
  disableAutoTrigger = false,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Expose next and previous methods to parent components
  useImperativeHandle(ref, () => ({
    next: () => {
      if (effectRef.current && effectRef.current.next) {
        effectRef.current.next();
      }
    },
    previous: () => {
      if (effectRef.current && effectRef.current.previous) {
        effectRef.current.previous();
      }
    },
  }));

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (!containerRef.current) return;

    const initEffect = async () => {
      try {
        // Dynamically import the libraries only on client side
        const [THREE, { TweenMax }, HoverEffect] = await Promise.all([
          import('three'),
          import('gsap'),
          import('hover-effect').then(mod => mod.default || mod)
        ]);

        // Make Three.js available globally for hover-effect
        if (typeof window !== 'undefined') {
          (window as any).THREE = THREE;
          (window as any).TweenMax = TweenMax;
        }

        if (containerRef.current) {
          // Suppress console.log and console.warn for this library instantiation
          const originalLog = console.log;
          const originalWarn = console.warn;
          console.log = () => {};
          console.warn = () => {};
          
          effectRef.current = new HoverEffect({
            parent: containerRef.current,
            intensity: intensity,
            image1: image1,
            image2: image2,
            displacementImage: displacementImage,
            speedIn: speedIn,
            speedOut: speedOut,
            hover: !disableAutoTrigger, // Disable hover when using manual triggers
            easing: "easeOutExpo",
            imagesRatio: 0.75, // Adjust aspect ratio to show more vertical content
          });

          // Restore console functions
          console.log = originalLog;
          console.warn = originalWarn;

          setIsLoaded(true);

          // Apply transform to shift WebGL viewport
          setTimeout(() => {
            const canvas = containerRef.current?.querySelector('canvas');
            if (canvas) {
              (canvas as HTMLCanvasElement).style.transform = 'scale(1.15) translateY(-8%)';
              (canvas as HTMLCanvasElement).style.transformOrigin = 'center center';
            }
          }, 100);

          // Set up Intersection Observer for mobile auto-trigger (only if not disabled)
          if (!disableAutoTrigger && window.innerWidth < 1024 && containerRef.current) {
            const observer = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  // Trigger when element reaches middle (50%) of the viewport
                  if (entry.isIntersecting && !hasTriggeredRef.current) {
                    hasTriggeredRef.current = true;
                    // Simulate hover effect
                    if (effectRef.current && effectRef.current.next) {
                      effectRef.current.next();
                      // Switch back after delay
                      setTimeout(() => {
                        if (effectRef.current && effectRef.current.previous) {
                          effectRef.current.previous();
                        }
                        // Reset trigger after animation completes
                        setTimeout(() => {
                          hasTriggeredRef.current = false;
                        }, 2000);
                      }, 2000);
                    }
                  }
                });
              },
              {
                threshold: 0, // Trigger when any part is visible
                rootMargin: '-50% 0px -50% 0px', // Trigger when element reaches center of viewport (50% from top)
              }
            );

            observer.observe(containerRef.current);

            // Cleanup observer
            return () => {
              observer.disconnect();
            };
          }
        }
      } catch (error) {
        // Error loading hover effect, skip initialization
      }
    };

    initEffect();

    return () => {
      // Cleanup
      window.removeEventListener('resize', checkMobile);
      if (effectRef.current && effectRef.current.renderer) {
        // Properly dispose of Three.js resources
        effectRef.current.renderer.dispose();
        effectRef.current = null;
      }
    };
  }, [image1, image2, displacementImage, intensity, speedIn, speedOut, disableAutoTrigger]);

  return <div ref={containerRef} className={className} />;
});

HoverDistortion.displayName = 'HoverDistortion';
