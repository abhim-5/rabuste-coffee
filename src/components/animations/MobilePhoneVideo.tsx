"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";

export default function MobilePhoneVideo() {
    const containerRef = useRef(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Detect if the component is in view (10% visible - resets only when mostly out)
    const isInView = useInView(containerRef, { amount: 0.1 });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isInView) {
            // Play when visible
            video.play().catch(() => { });
        } else {
            // Pause and Reset when out of view (so it plays again next time)
            video.pause();
            video.currentTime = 0;
        }
    }, [isInView]);

    return (
        // Visible only on Mobile/Tablet (hidden on lg and up)
        <div
            ref={containerRef}
            className="relative w-full h-screen bg-[#D8CBB8] flex items-center justify-center overflow-hidden lg:hidden"
        >

            {/* PHONE CONTAINER
          Adjust width to control phone size.
      */}
            <div className="relative w-[350px] h-[700px] flex items-center justify-center">

                {/* 1. LAYER BEHIND: THE VIDEO 
            Positioned absolutely to fit within the phone frame's screen area.
            You may need to adjust top/left/width/height percentages to align perfectly with the transparent part of your image.
        */}
                <div className="absolute top-[6%] left-[8%] w-[85%] h-[85%] overflow-hidden rounded-[3rem] bg-black z-0">
                    <video
                        ref={videoRef}
                        src="/rabuste-video2.mp4"
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        loop={false}
                    />
                </div>

                {/* 2. LAYER FRONT: THE IPHONE IMAGE
            This should be a PNG with a TRANSPARENT screen area.
            It sits on top (z-10) to frame the video.
        */}
                <div className="relative z-10 w-full h-full pointer-events-none scale-[1.2]">
                    <Image
                        src="/iphone-img.png"
                        alt="iPhone Frame"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

            </div>
        </div>
    );
}
