"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const reviews = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Coffee Enthusiast",
        image: "/reviews/customer1.jpg",
        rating: 5,
        review: "Rabuste has completely transformed my morning routine. The robust flavor of their dark roast is unmatched. Every cup feels like a premium experience.",
        date: "December 2024",
        location: "Surat, Gujarat"
    },
    {
        id: 2,
        name: "Arjun Patel",
        role: "Regular Customer",
        image: "/reviews/customer2.jpg",
        rating: 5,
        review: "The ambiance is incredible, and the coffee? Simply perfect. The baristas are true artists, and you can taste the passion in every sip.",
        date: "November 2024",
        location: "Mumbai, Maharashtra"
    },
    {
        id: 3,
        name: "Ananya Desai",
        role: "Coffee Connoisseur",
        image: "/reviews/customer3.jpg",
        rating: 5,
        review: "I've traveled the world for coffee, but Rabuste's unique Robusta blend stands out. The bold, chocolatey notes with that smooth finish - absolutely divine.",
        date: "December 2024",
        location: "Bangalore, Karnataka"
    },
    {
        id: 4,
        name: "Rahul Mehta",
        role: "Daily Visitor",
        image: "/reviews/customer4.jpg",
        rating: 5,
        review: "Not just a café, but an experience. The attention to detail, from the brewing process to the presentation, shows true dedication to craft.",
        date: "November 2024",
        location: "Delhi NCR"
    },
    {
        id: 5,
        name: "Sneha Iyer",
        role: "Food Blogger",
        image: "/reviews/customer5.jpg",
        rating: 5,
        review: "Rabuste redefined what I thought coffee could be. The intensity, the aroma, the craftsmanship - it's an art form. My followers can't stop asking about it!",
        date: "December 2024",
        location: "Chennai, Tamil Nadu"
    }
];

export function CustomerReviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for previous
    const [autoPlay, setAutoPlay] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 400,
        damping: 90
    });

    const y = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Auto-play carousel
    useEffect(() => {
        if (!autoPlay || isPaused) return;

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [autoPlay, isPaused, currentIndex]);

    const nextReview = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const currentReview = reviews[currentIndex];

    return (
        <>
            {/* Separator HR */}
            <div style={{ backgroundColor: "#D8CBB8" }} className="w-full px-4 lg:px-6 py-0">
                <hr className="border-t border-black/10" />
            </div>

            <section
                ref={sectionRef}
                className="relative w-full overflow-hidden bg-[#D8CBB8] py-6 lg:py-8"
            >
                {/* Cinematic Background Effects */}
                <motion.div
                    style={{ y, opacity }}
                    className="absolute inset-0 pointer-events-none"
                >
                    {/* Radial gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/5 to-black/20" />
                </motion.div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-4 lg:mb-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-block mb-2 lg:mb-3"
                        >
                            <Quote className="w-10 h-10 lg:w-14 lg:h-14 text-[#8B6F47]" />
                        </motion.div>

                        <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-[#404040] mb-3">
                            Reviews of Customers
                        </h2>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-32 h-8 lg:w-40 lg:h-10 mx-auto mb-3"
                        >
                            <Image
                                src="/title-separator.png"
                                fill
                                alt="Decorative separator"
                                className="object-contain"
                            />
                        </motion.div>

                        <p className="font-serif text-lg lg:text-xl text-[#404040]/80 max-w-2xl mx-auto">
                            Hear what our beloved customers have to say
                        </p>
                    </motion.div>

                    {/* Cinematic Carousel Card */}
                    <div
                        className="relative max-w-6xl mx-auto"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Main Review Card */}
                        <div className="relative min-h-[220px] lg:min-h-[280px] flex items-center justify-center">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentReview.id}
                                    custom={direction}
                                    initial={{ x: direction > 0 ? '100vw' : '-100vw' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: direction > 0 ? '-100vw' : '100vw' }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    className="w-full"
                                >
                                    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 lg:gap-8 items-center">
                                        {/* Image Side - Cinematic with glow */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                            className="lg:col-span-2 order-1"
                                        >
                                            <div className="relative w-48 h-48 lg:w-auto lg:h-auto lg:aspect-square lg:max-w-md mx-auto">
                                                {/* Glow effect */}
                                                <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-br from-[#8B6F47]/30 via-[#8B6F47]/10 to-transparent blur-3xl rounded-full" />

                                                {/* Image container */}
                                                <div className="relative rounded-lg overflow-hidden shadow-2xl border-2 lg:border-4 border-white/20">
                                                    <div className="relative w-full h-full aspect-square bg-gradient-to-br from-[#8B6F47]/20 to-[#404040]/20">
                                                        {/* Placeholder for customer image - using coffee image as fallback */}
                                                        <Image
                                                            src="/workshops/1.jpg"
                                                            alt={currentReview.name}
                                                            fill
                                                            sizes="(max-width: 768px) 192px, (max-width: 1200px) 300px, 400px"
                                                            priority={currentIndex === 0}
                                                            className="object-cover"
                                                        />

                                                        {/* Overlay gradient */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                    </div>
                                                </div>

                                                {/* Floating badge */}
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                                    className="absolute -bottom-2 -right-2 lg:-bottom-4 lg:-right-4 bg-white rounded-full p-2 lg:p-4 shadow-2xl"
                                                >
                                                    <div className="flex gap-0.5 lg:gap-1">
                                                        {[...Array(currentReview.rating)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 lg:w-5 lg:h-5 fill-amber-400 text-amber-400" />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </motion.div>

                                        {/* Content Side */}
                                        <motion.div
                                            className="lg:col-span-3 order-2 space-y-2 lg:space-y-3"
                                        >
                                            {/* Quote Icon */}
                                            <Quote className="w-10 h-10 lg:w-12 lg:h-12 text-[#8B6F47]/30" />

                                            {/* Review Text with Unjumbled Animation */}
                                            <motion.p
                                                initial={{ filter: "blur(4px)" }}
                                                animate={{ filter: "blur(0px)" }}
                                                transition={{ duration: 0.6, delay: 0.1 }}
                                                className="font-serif text-lg lg:text-xl xl:text-2xl leading-relaxed text-[#404040] italic"
                                            >
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        duration: 0.8,
                                                        delay: 0.1,
                                                        staggerChildren: 0.01
                                                    }}
                                                >
                                                    {currentReview.review.split('').map((char, index) => (
                                                        <motion.span
                                                            key={index}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{
                                                                duration: 0.3,
                                                                delay: index * 0.01
                                                            }}
                                                        >
                                                            {char}
                                                        </motion.span>
                                                    ))}
                                                </motion.span>
                                            </motion.p>

                                            {/* Author Info - Desktop Only */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, duration: 0.6 }}
                                                className="hidden lg:block pt-6 border-t border-[#8B6F47]/20"
                                            >
                                                <p className="font-display text-2xl lg:text-3xl font-bold text-[#404040] mb-2">
                                                    {currentReview.name}
                                                </p>
                                                <p className="font-serif text-lg lg:text-xl text-[#8B6F47] mb-1">
                                                    {currentReview.role}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-sm font-inter text-[#404040]/60">
                                                    <span>{currentReview.location}</span>
                                                    <span>•</span>
                                                    <span>{currentReview.date}</span>
                                                </div>
                                            </motion.div>
                                        </motion.div>

                                        {/* Mobile Author Info - Visible only on mobile */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="mt-4 text-center lg:hidden"
                                        >
                                            <p className="font-display text-xl font-bold text-[#404040] mb-1">
                                                {currentReview.name}
                                            </p>
                                            <p className="font-serif text-base text-[#8B6F47] mb-1">
                                                {currentReview.role}
                                            </p>
                                            <div className="flex justify-center flex-wrap gap-2 text-xs font-inter text-[#404040]/60">
                                                <span>{currentReview.location}</span>
                                                <span>•</span>
                                                <span>{currentReview.date}</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Controls */}
                        <div className="flex items-center justify-center gap-4 lg:gap-6 mt-6 lg:mt-8">
                            {/* Previous Button */}
                            <motion.button
                                onClick={prevReview}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                suppressHydrationWarning
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#C8BAA8]/60 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-[#C8BAA8]/80 transition-all flex items-center justify-center group"
                            >
                                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-[#404040] group-hover:text-[#8B6F47] transition-colors" />
                            </motion.button>

                            {/* Indicator Dots */}
                            <div className="flex gap-2">
                                {reviews.map((review, index) => (
                                    <motion.button
                                        key={review.id}
                                        onClick={() => {
                                            setDirection(index > currentIndex ? 1 : -1);
                                            setCurrentIndex(index);
                                        }}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        suppressHydrationWarning
                                        className={`rounded-full transition-all duration-300 ${index === currentIndex
                                            ? "w-12 h-3 bg-[#8B6F47]"
                                            : "w-3 h-3 bg-[#404040]/30 hover:bg-[#404040]/50"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Next Button */}
                            <motion.button
                                onClick={nextReview}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                suppressHydrationWarning
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#C8BAA8]/60 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-[#C8BAA8]/80 transition-all flex items-center justify-center group"
                            >
                                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-[#404040] group-hover:text-[#8B6F47] transition-colors" />
                            </motion.button>
                        </div>
                    </div>
                </div>


            </section>
        </>
    );
}

export default CustomerReviews;
