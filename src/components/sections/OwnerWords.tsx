"use client";

import BlurImage from "@/components/ui/BlurImage";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export function OwnerWords() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    let pfoldInstance: any = null;
    let isInitialized = false;

    // Load a script and wait for it
    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (document.getElementById(id)) {
          console.log(`${id} already exists`);
          resolve();
          return;
        }

        // Check if script is already in window
        if (id === 'jquery-lib' && (window as any).jQuery) {
          console.log('jQuery already in window');
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = false;

        script.onload = () => {
          console.log(`${id} loaded successfully`);
          resolve();
        };

        script.onerror = () => {
          console.error(`Failed to load ${id}`);
          reject(new Error(`Failed to load ${src}`));
        };

        document.head.appendChild(script);
      });
    };

    // Load all scripts in sequence
    const loadAllScripts = async () => {
      try {
        console.log('Starting script loading...');

        // Load jQuery
        await loadScript('https://code.jquery.com/jquery-1.8.2.min.js', 'jquery-lib');

        // Small delay for jQuery to initialize
        await new Promise(resolve => setTimeout(resolve, 50));

        // Load Modernizr
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js', 'modernizr-lib');

        // Load PFold
        await loadScript('https://cdn.jsdelivr.net/gh/codrops/PFold/js/jquery.pfold.js', 'pfold-lib');

        // Small delay for PFold to initialize
        await new Promise(resolve => setTimeout(resolve, 50));

        console.log('All scripts loaded successfully');
        return true;
      } catch (error) {
        console.error('Error loading scripts:', error);
        return false;
      }
    };

    // Initialize PFold
    const initializePFold = async () => {
      // Prevent double initialization
      if (isInitialized) {
        console.log('Already initialized, skipping');
        return;
      }

      console.log('Loading scripts...');
      const scriptsReady = await loadAllScripts();

      if (!scriptsReady) {
        console.log('Script loading encountered errors, but attempting to continue...');
      }

      // Small delay to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if jQuery and PFold are now available
      if (!(window as any).jQuery || !(window as any).jQuery.fn.pfold) {
        console.error('Scripts still not available after loading attempts');
        return;
      }

      const $ = (window as any).jQuery;
      console.log('jQuery available:', !!$);
      console.log('PFold available:', !!$.fn.pfold);

      const $container = $('#owner-pfold-container');
      console.log('Container found:', $container.length);

      if ($container.length > 0 && $.fn.pfold && !isInitialized) {
        isInitialized = true;
        console.log('Initializing PFold now...');
        const pfold = $container.pfold({
          easing: 'ease-in-out',
          folds: 3,
          folddirection: ['left', 'bottom', 'right'],
          speed: 500,
          perspective: 1200,
          centered: false,
          onEndUnfolding: function () {
            // Hide the initial content and all parts
            $container.find('.uc-initial').hide();
            $container.find('.uc-part').remove();

            // Reset container position for mobile
            $container.css({
              'left': '0',
              'top': '0',
              'transform': 'none'
            });

            // Show and keep the final content visible
            $container.find('.uc-final-wrapper').css({
              'display': 'block',
              'visibility': 'visible',
              'opacity': '1',
              'z-index': '10'
            }).show();

            // Make sure final content children are visible
            $container.find('.uc-final-wrapper > *').css('visibility', 'visible').show();
            $container.find('.scrollwrap').show();
            $container.find('.close').show();
          },
          onEndFolding: function () {
            // Show the initial content only after folding is complete
            $container.find('.uc-initial').show();
            $container.find('.uc-initial-content').css('visibility', 'visible').show();
            $container.find('span.clickme').show();

            // Make sure final wrapper is hidden
            $container.find('.uc-final-wrapper').hide();
          }
        });

        pfoldInstance = pfold;
        console.log('PFold initialized:', !!pfold);

        // Ensure clickme has proper CSS for clicking
        $container.find('span.clickme').css({
          'cursor': 'pointer',
          'pointer-events': 'auto',
          'position': 'relative',
          'z-index': '100'
        });

        $container.find('.uc-initial-content').css({
          'cursor': 'pointer',
          'pointer-events': 'auto'
        });

        // Bind click events with more robust handling
        const clickHandler = function (e: any) {
          console.log('Click detected on:', e.target);
          e.preventDefault();
          e.stopPropagation();
          // Hide initial content immediately when clicked
          $container.find('.uc-initial-content').css('visibility', 'hidden');
          console.log('Calling unfold...');
          pfold.unfold();
        };

        $container.find('span.clickme').on('click', clickHandler);
        $container.find('.uc-initial-content').on('click', clickHandler);

        console.log('Click handlers bound. Clickme elements:', $container.find('span.clickme').length);

        $container.find('span.close').on('click', function () {
          console.log('Close clicked');
          $container.find('.uc-final-wrapper').css('visibility', 'hidden');
          pfold.fold();
        });
      } else {
        console.error('Container or PFold not available');
      }
    };

    initializePFold();

    return () => {
      // Cleanup
      isInitialized = false;
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery;
        const $container = $('#owner-pfold-container');
        $container.off();
        // Try to destroy pfold instance if it exists
        if (pfoldInstance && typeof pfoldInstance.destroy === 'function') {
          pfoldInstance.destroy();
        }
      }
    };
  }, []); // Remove isInView dependency

  return (
    <>
      <section
        ref={ref}
        className="relative w-full overflow-hidden py-10 lg:py-8 pb-[120px] md:pb-12 lg:pb-8 xl:pb-16 bg-[#D8CBB8] z-10"
      >
        {/* Enhanced Cinematic Background Effects */}
        {/* Deep vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.08)_50%,_rgba(0,0,0,0.25)_100%)] pointer-events-none" />

        {/* Subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-multiply" />

        {/* Coffee bean pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 20c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 2c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8z" fill="%23404040" fill-opacity="0.5"%3E%3C/path%3E%3C/svg%3E')`,
          backgroundSize: '60px 60px'
        }} />

        {/* Warm ambient light from top */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#E8DCC8]/30 to-transparent pointer-events-none" />

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#8B6F47]/10 to-transparent pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#404040]/10 to-transparent pointer-events-none blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1500px] px-4 lg:px-8 xl:px-12">
          {/* The "Rectangle Outside" - Visible only on Laptop (lg+) */}
          <div className="relative w-full lg:bg-[#DDCFBC] lg:rounded-[2.5rem] lg:py-8 lg:px-10 lg:border lg:border-[#C8BBA8] lg:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] lg:overflow-hidden">

            {/* Inner texture (Laptop only) */}
            <div className="hidden lg:block absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center mb-8 lg:mb-6 relative z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-[#8B6F47]/40"></div>
                <span className="font-serif text-[#8B6F47] text-sm lg:text-base tracking-[0.2em] uppercase">The Vision</span>
                <div className="w-8 h-[1px] bg-[#8B6F47]/40"></div>
              </div>
              <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-[#404040] my-2 text-center drop-shadow-sm leading-tight">
                Words from the Owner
              </h2>

              {/* Title Separator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-28 h-6 lg:w-40 lg:h-10 mt-4"
              >
                <Image
                  src="/title-separator.png"
                  fill
                  alt="Decorative separator"
                  className="object-contain opacity-80"
                />
              </motion.div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center relative z-10">
              {/* Left: Owner Picture */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center lg:items-center justify-center w-full"
              >
                {/* Owner Image */}
                <div className="relative w-full max-w-[240px] lg:max-w-xs aspect-square mx-auto lg:mx-0 shadow-2xl rounded-2xl overflow-hidden border-4 border-[#fff1d0]">
                  <BlurImage
                    src="/about us/owner_pic.png"
                    alt="Rabuste Founder"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-[#404040]">
                    Vaibhav Sutaria
                  </h3>
                  <p className="font-serif text-[#8B6F47] text-base lg:text-xl italic tracking-wide mt-1">Founder & Curator</p>
                </div>
              </motion.div>

              {/* Right: Paper Fold Effect */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center lg:justify-start demo-1 w-full lg:-ml-32 lg:-mt-28"
              >
                <div id="owner-pfold-container" className="uc-container shadow-xl">
                  <div className="uc-initial-content">
                    <span className="clickme"></span>
                  </div>
                  <div className="uc-final-content">
                    <div className="scrollwrap">
                      <h3 className="">Dear visitor,</h3>
                      <p className="">
                        Welcome to Rabuste Coffee. What started as a passion for the bold, robust flavors of coffee
                        has grown into a mission to share the finest Robusta experience with coffee lovers everywhere.
                      </p>
                      <p className="">
                        We believe that great coffee should be bold, uncompromising, and memorable just like your experience with us.
                      </p>
                      <p className="signature">- Vaibhav Sutaria</p>
                    </div>
                    <span className="close">x</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <style jsx global>{`
        /* PFold Styles */
        .uc-container {
          position: relative;
          width: 400px;
          height: 400px;
          top: 0;
          left: 0;
          perspective: 1200px;
        }

        /* Laptop specific adjustment */
        @media (min-width: 1024px) and (max-width: 1280px) {
          .uc-container {
            width: 110px;
            height: 110px;
          }
        }

        @media (max-width: 768px) {
          .uc-container {
            width: 90px !important;
            height: 140px !important;
            margin: 0 0 0 -25% !important;
            position: relative !important;
            left: 0px !important;
            transform: none !important;
          }
          
          .uc-container.uc-current {
            transform: none !important;
            left: 0px !important;
            top: 0 !important;
            margin: 0 0 0 -25% !important;
          }
          
          /* Make clickme button proportional */
          .demo-1 span.clickme {
            width: 85px !important;
            height: 120px !important;
            margin: 20px 0 0 0px !important;
            background-size: contain !important;
          }
        }

        .uc-single, 
        .uc-final-wrapper,
        .uc-initial-content,
        .uc-back,
        .uc-front {
          background: #fff;
        }

        .uc-final,
        .uc-initial, 
        .uc-final-wrapper {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .uc-initial-content,
        .uc-final-content {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .uc-final,
        .uc-final-content {
          display: none;
        }

        .uc-initial-content {
          backface-visibility: hidden;
        }

        .uc-part {
          top: 0;
          left: 0;
          position: absolute;
          transform-style: preserve-3d;
        }

        .uc-part > div {
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .uc-part .uc-back {
          transform: rotateY(-180deg);
        }

        /* Transformation-origin classes */
        .uc-unfold-left {
          transform-origin: 0 50%;
        }

        .uc-unfold-right {
          transform-origin: 100% 50%;
        }

        .uc-unfold-top {
          transform-origin: 50% 0%;
        }

        .uc-unfold-bottom {
          transform-origin: 50% 100%;
        }

        /* Unfolding classes */
        .uc-unfold-left.uc-unfold {
          transform: rotateY(-180deg);
        }

        .uc-unfold-right.uc-unfold {
          transform: rotateY(180deg);
        }

        .uc-unfold-top.uc-unfold {
          transform: rotateX(180deg);
        }

        .uc-unfold-bottom.uc-unfold {
          transform: rotateX(-180deg);
        }

        .uc-overlay {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(0,0,0,0.3);
          opacity: 0;
          pointer-events: none;
        }

        .scrollwrap {
          overflow: hidden;
          font-family: 'Satisfy', cursive;
        }

        @media (max-width: 768px) {
          .scrollwrap {
            overflow: hidden;
            font-size: 12px !important;
            padding: 8px 8px 8px 10px !important;
            line-height: 1.5 !important;
          }
          
          .scrollwrap h3 {
            font-size: 20px !important;
            margin-bottom: 6px !important;
            padding: 10px 0 5px 15px !important;
          }
          
          .scrollwrap p {
            font-size:  15px !important;
            line-height: 1.3 !important;
            margin-bottom: 4px !important;
            padding: 0 15px !important;
          }
          
          .scrollwrap p.signature {
            font-size: 16px !important;
            margin-top: 6px !important;
            padding: 5px 12px 0 12px !important;
            word-wrap: break-word;
            white-space: normal;
          }
          
          .close {
            top: 6px !important;
            right: 6px !important;
            font-size: 14px !important;
            width: 20px !important;
            height: 20px !important;
            line-height: 16px !important;
            border-width: 2px !important;
          }
        }



        .scrollwrap h3 {
           /* Inherit Satisfy */
        }

        .scrollwrap p, .scrollwrap .signature {
           /* Inherit Satisfy */
        }

        .scrollwrap p {
          line-height: 1.6;
        }

        .clickme {
          cursor: pointer;
          display: block;
          width: 100%;
          height: 100%;
        }

        .close {
          z-index: 10;
        }
      `}</style>
    </>
  );
}

export default OwnerWords;
