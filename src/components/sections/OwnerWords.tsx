"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export function OwnerWords() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    // Load PFold scripts after component mounts
    const loadPFold = async () => {
      // Wait for component to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery;

        // Initialize PFold
        const $container = $('#owner-pfold-container');
        if ($container.length > 0 && $.fn.pfold) {
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

          // Bind click events
          $container.find('span.clickme').on('click', function () {
            // Hide initial content immediately when clicked
            $container.find('.uc-initial-content').css('visibility', 'hidden');
            pfold.unfold();
          });

          $container.find('span.close').on('click', function () {
            // Hide final content wrapper immediately when close is clicked
            $container.find('.uc-final-wrapper').css('visibility', 'hidden');
            pfold.fold();
          });
        }
      }
    };

    loadPFold();

    return () => {
      // Cleanup
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery;
        $('#owner-pfold-container').off();
      }
    };
  }, [isInView]);

  return (
    <>
      <section
        ref={ref}
        className="relative w-full overflow-hidden py-20 lg:py-32 bg-[#D8CBB8]"
      >
        {/* Cinematic Vignette & Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.15)_100%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply" />

        <div className="relative z-10 mx-auto max-w-7xl lg:px-8">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-16 lg:mb-24 px-4"
          >
            <span className="font-serif text-[#8B6F47] text-sm lg:text-base tracking-[0.3em] uppercase mb-4">The Vision</span>
            <h2 className="font-display text-5xl lg:text-7xl font-bold text-[#404040] mb-8 text-center drop-shadow-sm leading-tight">
              Words from <br className="lg:hidden" /> the Owner
            </h2>

            {/* Title Separator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-32 h-8 lg:w-48 lg:h-12"
            >
              <Image
                src="/title-separator.png"
                fill
                alt="Decorative separator"
                className="object-contain opacity-80"
              />
            </motion.div>
          </motion.div>

          {/* Content Grid - Mobile: Stacked, Desktop: Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center px-4 lg:px-8">
            {/* Left: Owner Picture */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center w-full"
            >
              <div className="relative w-full max-w-lg aspect-square p-4 bg-white/40 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/about us/owner-pic.png"
                    fill
                    alt="Owner"
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="font-display text-3xl lg:text-4xl font-bold text-[#404040]">
                  Vaibhav Sutaria
                </h3>
                <p className="font-serif text-[#8B6F47] text-lg italic mt-2">Founder & Curator</p>
              </div>
            </motion.div>

            {/* Right: Paper Fold Effect - Using exact PFold structure */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center demo-1 w-full"
            >
              <div id="owner-pfold-container" className="uc-container shadow-2xl">
                <div className="uc-initial-content">
                  <span className="clickme">Click me</span>
                </div>
                <div className="uc-final-content">
                  <div className="scrollwrap">
                    <h3>Dear visitor,</h3>
                    <p>
                      Welcome to Rabuste Coffee. What started as a passion for the bold, robust flavors of coffee
                      has grown into a mission to share the finest Robusta experience with coffee lovers everywhere.
                    </p>
                    <p>
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

        @media (max-width: 768px) {
          .uc-container {
            width: 150px !important;
            height: 150px !important;
            margin: 0 auto;
            position: relative !important;
            left: 0px !important;
            transform: none !important;
          }
          
          .uc-container.uc-current {
            transform: none !important;
            left: 0px !important;
            top: 0 !important;
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
        }

        @media (max-width: 768px) {
          .scrollwrap {
            overflow: hidden;
            font-size: 8px;
            padding: 4px 4px 4px 2px;
          }
          
          .scrollwrap h3 {
            font-size: 10px;
            margin-bottom: 4px;
          }
          
          .scrollwrap p {
            font-size: 7px;
            line-height: 1.3;
            margin-bottom: 3px;
          }
          
          .scrollwrap p.signature {
            font-size: 8px;
            margin-top: 4px;
            word-wrap: break-word;
            white-space: normal;
          }
          
          .close {
            top: 4px;
            right: 4px;
            font-size: 12px;
            width: 14px;
            height: 14px;
          }
        }

        .scrollwrap h3 {
          font-family: inherit;
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
