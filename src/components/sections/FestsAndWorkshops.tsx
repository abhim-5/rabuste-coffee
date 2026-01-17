"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const workshopCards = [
    { src: "/workshops/1.jpg", rotation: "rotate-z-[-10deg]", title: "Pottery", translation: "translate-y-[-5%]" },
    { src: "/workshops/2.jpg", rotation: "rotate-z-[4deg]", title: "Coffee Brewing", translation: "translate-y-0" },
    { src: "/workshops/3.jpg", rotation: "rotate-z-[-4deg]", title: "Latte Art", translation: "translate-y-[-5%]" },
    { src: "/workshops/4.jpg", rotation: "rotate-z-[4deg]", title: "Pastry Baking", translation: "translate-y-[5%]" },
    { src: "/workshops/5.jpg", rotation: "rotate-z-[-10deg]", title: "Coffee Tasting", translation: "translate-y-0" },
    { src: "/workshops/6.jpg", rotation: "rotate-z-[4deg]", title: "Live Music", translation: "translate-y-[5%]" },
];

export default function FestsAndWorkshops() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [enableInteraction, setEnableInteraction] = useState(false);

    useGSAP(() => {
        if (!containerRef.current) return;

        // 1. Heading Horizontal Motion (Exact Prototype Offsets)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "200% top",
                scrub: true,
            },
        });

        tl.to(".first-title", { xPercent: 70 })
          .to(".sec-title", { xPercent: 25 }, "<")
          .to(".third-title", { xPercent: -50 }, "<");

        // 2. Pinning & Card Stagger (Exact Prototype Logic)
        const pinTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "10% top",
                end: "200% top",
                scrub: 1.5,
                pin: true,
                onLeave: () => setEnableInteraction(true),
                onEnterBack: () => setEnableInteraction(true),
                onEnter: () => setEnableInteraction(false),
                onLeaveBack: () => setEnableInteraction(false),
            },
        });

        pinTl.from(".workshop-card", {
            yPercent: 150,
            stagger: 0.2,
            ease: "power1.inOut",
        });

        // 3. Button Fade-in
        pinTl.from(".action-buttons", {
            opacity: 0,
            y: 50,
            duration: 0.5
        }, "-=0.2");

    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="testimonials-section relative w-full h-[120dvh] bg-[#e3a458] overflow-hidden"
        >
            {/* Exactly as per prototype: Absolute Title Stack */}
            <div className="absolute size-full flex flex-col items-center pt-[5vw] pointer-events-none select-none z-0">
                <h1 className="first-title uppercase text-[20.5vw] leading-[125%] tracking-[-.4vw] ml-[2vw] font-bold text-black no-dark-mode">
                    Our
                </h1>
                <h1 className="sec-title uppercase text-[20.5vw] leading-[125%] tracking-[-.4vw] ml-[2vw] font-bold text-[#faeade] no-dark-mode">
                    Workshop
                </h1>
                <h1 className="third-title uppercase text-[20.5vw] leading-[125%] tracking-[-.4vw] ml-[2vw] font-bold text-black no-dark-mode">
                    Diaries
                </h1>
            </div>

            {/* Exactly as per prototype: Pinned Box with -ms-44 overlap */}
            <div className={`pin-box flex items-center justify-center w-full ps-52 absolute 2xl:bottom-32 bottom-[50vh] z-10 no-dark-mode ${enableInteraction ? 'interaction-enabled' : ''}`}>
                {workshopCards.map((card, index) => (
                    <div
                        key={index}
                        className={`workshop-card md:w-96 w-80 flex-none md:rounded-[2vw] rounded-3xl -ms-44 overflow-hidden 2xl:relative absolute border-[.5vw] border-[#faeade] bg-[#faeade] shadow-2xl transition-transform duration-300 ${card.rotation} ${card.translation}`}
                    >
                        <div className="relative aspect-square md:aspect-[3/4] w-full">
                            <Image
                                src={card.src}
                                fill
                                alt={card.title}
                                className="object-cover"
                            />
                            {/* Label box embedded in card */}
                            <div className="absolute bottom-4 left-4 right-4 bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                <p className="text-[#faeade] font-antonio text-center text-sm md:text-xl uppercase tracking-tighter font-bold">
                                    {card.title}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons: Unified Bottom Center */}
            <div className="action-buttons absolute bottom-0 pb-4 left-0 right-0 z-50 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-4 no-dark-mode">
                <Link href="/workshops?target=upcoming">
                    <button className="group relative">
                        <div className="absolute inset-0 bg-black/20 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative font-tan-pearl text-xl md:text-3xl text-[#faeade] bg-[#7f3b2d] px-8 md:px-12 py-3 md:py-5 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl leading-none">
                            Register for Workshop
                        </div>
                    </button>
                </Link>
                <Link href="/workshops?target=request-custom-workshop">
                    <button className="group relative">
                        <div className="absolute inset-0 bg-black/20 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative font-tan-pearl text-xl md:text-3xl text-[#7f3b2d] bg-[#faeade] px-8 md:px-12 py-3 md:py-5 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl leading-none">
                            Request for Workshop
                        </div>
                    </button>
                </Link>
            </div>
            <style jsx>{`
                .workshop-card {
                    transition: transform 0.3s ease-out;
                }
                :global(.interaction-enabled) .workshop-card:hover {
                    transform: scale(1.05) translateY(-10px) rotate(0deg) !important;
                    z-index: 100 !important;
                }
            `}</style>
        </section>
    );
}
