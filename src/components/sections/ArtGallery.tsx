"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import BlurImage from "@/components/ui/BlurImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import styles from "./ArtGallery.module.css";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger, Flip);

const images = [
  "/home-art/51.jpg", "/home-art/52.jpg", "/home-art/53.jpg", "/home-art/54.jpg",
  "/home-art/55.jpg", "/home-art/56.jpg", "/home-art/57.jpg", "/home-art/58.jpg",
  "/home-art/59.jpg", "/home-art/60.jpg", "/home-art/61.jpg"
];

// Generate diagonal pattern
// Grid is 10 columns. 
// We want ~50 items to fill the grid nicely (5 rows).
const COLS = 10;
const ROWS = 5;
const galleryImages: string[] = [];

for (let i = 0; i < COLS * ROWS; i++) {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  // Diagonal index logic: (col - row) ensures shift. 
  // Add large number to avoid negative modulo.
  const imgIndex = (col - row + images.length * 10) % images.length;
  galleryImages.push(images[imgIndex]);
}

export default function ArtGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!galleryRef.current || !wrapRef.current) return;

    const ctx = gsap.context(() => {
      // Use matchMedia to run animation only on desktop
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 1025px)",
        isMobile: "(max-width: 1024px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
      }, (context) => {
        const { isMobile } = context.conditions as any;
        const galleryEl = galleryRef.current!;
        const galleryCaption = galleryEl.querySelector(`.${styles.caption}`);
        const galleryItems = galleryEl.querySelectorAll(`.${styles.galleryItem}`);

        // Initial state is "zoomed in" (width: 300% or 200% on mobile)

        // Capture "Final" state (Grid/Zoomed Out, width: 100%)
        galleryEl.classList.add(styles.gallerySwitch);
        const flipState = Flip.getState([...Array.from(galleryItems), galleryCaption], { props: "filter, opacity" });
        galleryEl.classList.remove(styles.gallerySwitch);

        Flip.to(flipState, {
          ease: "none",
          absoluteOnLeave: false,
          absolute: false,
          scale: true,
          simple: true,
          scrollTrigger: {
            trigger: galleryEl,
            start: isMobile ? "top 15%" : "center center",
            end: isMobile ? "+=75%" : "+=500%", // Shorter duration for mobile, long for desktop
            pin: wrapRef.current,
            scrub: isMobile ? 1 : 2,
          },
          stagger: 0,
        });
      });

    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full overflow-hidden pt-0 pb-0 lg:pb-24" style={{ backgroundColor: "#D8CBB8" }}>
      {/* Header Content */}
      <div className="flex flex-col items-center mb-0 relative z-10 mx-auto w-full px-4 lg:px-6 pt-0 lg:pt-12">
        <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-center text-[#262626]">
          Art Gallery
        </h2>
        <div className="relative w-32 h-8 lg:w-40 lg:h-10 mb-8">
          <Image
            src="/title-separator.png"
            fill
            alt="Decorative separator"
            className="object-contain"
          />
        </div>
        <p className="max-w-2xl text-center text-lg text-[#575757] font-serif mb-12">
          Art connects the soul to the divine, expressing emotions that words cannot capture.
          Experience the vibrant heritage and rhythm of life through our curated collection.
        </p>
      </div>

      <div ref={wrapRef} className={styles.galleryWrap}>
        <div ref={galleryRef} className={clsx(styles.gallery, styles.galleryGridTiny)} id="gallery-7">
          {galleryImages.map((src, index) => (
            <div
              key={index}
              className={`${styles.galleryItem} relative overflow-hidden`}
            >
              <BlurImage
                src={src}
                fill
                alt={`Gallery image ${index + 1}`}
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 20vw"
              />
            </div>
          ))}
          <div className={clsx(styles.caption, styles.danceTitle)}>
            Experience the Fine Arts →
          </div>
        </div>
      </div>
    </section>
  );
}
