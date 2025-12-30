"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring } from "framer-motion";
import {
  Coffee,
  Calendar,
  Clock,
  Users,
  Star,
  Check,
  MapPin,
  X as XIcon,
  Quote,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Heart,
  Award,
} from "lucide-react";

import Navbar from "@/components/navbar/Navbar";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import Footer from "@/components/ui/Footer";


// Data
const upcomingWorkshops = [
  {
    id: 1,
    title: "Latte Art Mastery",
    description: "Transform your coffee into canvas. Learn professional barista techniques from award-winning instructors.",
    fullDescription: "Master the art of creating stunning latte art patterns including hearts, rosettas, and tulips. Our expert baristas will guide you through milk texturing, pouring techniques, and advanced pattern creation.",
    date: "December 28, 2025",
    time: "2:00 PM - 5:00 PM",
    duration: "3 hours",
    price: "₹2,499",
    spots: "8 spots left",
    image: "/workshops/1.jpg",
    instructor: "Priya Malhotra",
    level: "Beginner to Intermediate",
    includes: ["All materials & coffee beans", "Certificate of completion", "Recipe booklet", "Complimentary refreshments"],
  },
  {
    id: 2,
    title: "Coffee Tasting Journey",
    description: "Explore the world of specialty coffee. Discover flavor profiles from different regions and roasting styles.",
    fullDescription: "An immersive sensory experience where you'll taste and compare single-origin coffees from around the world. Learn professional cupping techniques and develop your palate.",
    date: "January 5, 2026",
    time: "3:00 PM - 6:00 PM",
    duration: "3 hours",
    price: "₹1,999",
    spots: "12 spots left",
    image: "/workshops/2.jpg",
    instructor: "Rahul Verma",
    level: "All levels welcome",
    includes: ["10+ coffee tastings", "Tasting journal", "Certificate", "Coffee bean samples to take home"],
  },
];

const previousWorkshops = [
  {
    id: "1",
    title: "Coffee & Pottery",
    image: "/workshops/1.jpg",
    date: "Dec 2025",
    attendees: 28,
    description: "Create your own ceramic coffee mug while learning about coffee origins. A hands-on workshop combining artisan crafts with coffee culture.",
    reviews: [
      { name: "Meera Kapoor", rating: 5, date: "Dec 28, 2025 • 2:15 PM", comment: "The perfect blend of creativity and coffee! Made my own mug and learned so much about coffee origins. The instructors were patient and knowledgeable. Highly recommend!", avatar: "M" },
      { name: "Raj Patel", rating: 5, date: "Dec 29, 2025 • 10:45 AM", comment: "Loved every minute! The pottery instructor was amazing and the coffee knowledge I gained was invaluable.", avatar: "R" },
    ],
  },
  {
    id: "2",
    title: "Espresso Fundamentals",
    image: "/workshops/2.jpg",
    date: "Nov 2025",
    attendees: 24,
    description: "Deep dive into the science of espresso extraction. Learn about grind size, tamping pressure, and timing to create the perfect shot.",
    reviews: [
      { name: "Arjun Reddy", rating: 5, date: "Nov 15, 2025 • 9:30 AM", comment: "As a home barista, this workshop elevated my game completely. Understanding extraction, grind size, and timing changed everything. Now my espresso rivals the cafe!", avatar: "A" },
      { name: "Priya Singh", rating: 5, date: "Nov 16, 2025 • 5:20 PM", comment: "Professional instruction and hands-on practice. Best investment for any coffee lover!", avatar: "P" },
    ],
  },
  {
    id: "3",
    title: "Coffee & Canvas",
    image: "/workshops/3.jpg",
    date: "Oct 2025",
    attendees: 30,
    description: "Paint your masterpiece while sipping on premium coffee. Art meets caffeine in this unique creative workshop.",
    reviews: [
      { name: "Sudhir Gupta", rating: 5, date: "Oct 20, 2025 • 11:00 AM", comment: "Such a unique concept! Painting while sipping premium coffee in that gorgeous cafe. The art instructor and baristas work together seamlessly. Left with a masterpiece and caffeine buzz!", avatar: "S" },
      { name: "Karan Mehta", rating: 5, date: "Oct 21, 2025 • 3:45 PM", comment: "Never thought I could paint! The relaxed atmosphere and great coffee made it so enjoyable.", avatar: "K" },
    ],
  },
  {
    id: "4",
    title: "Brewing Science",
    image: "/workshops/4.jpg",
    date: "Sep 2025",
    attendees: 22,
    description: "Explore the chemistry behind perfect coffee. Learn about water temperature, extraction ratios, and brewing methods.",
    reviews: [
      { name: "Rahul Menon", rating: 5, date: "Sep 10, 2025 • 1:30 PM", comment: "Finally understand why my home brew never tasted right. The chemistry behind extraction, water temperature, ratios - it's all science! Rabuste explains it beautifully.", avatar: "R" },
      { name: "Divya Sharma", rating: 5, date: "Sep 12, 2025 • 6:15 PM", comment: "Mind-blowing! I learned so much about the science behind every cup of coffee.", avatar: "D" },
    ],
  },
  {
    id: "5",
    title: "Pastry Pairing",
    image: "/workshops/5.jpg",
    date: "Aug 2025",
    attendees: 26,
    description: "Discover the art of pairing coffee with pastries. Learn which flavors complement each other for the ultimate experience.",
    reviews: [
      { name: "Aisha Khan", rating: 5, date: "Aug 05, 2025 • 4:00 PM", comment: "A delicious journey through flavors! Understanding how different pastries pair with coffee types was eye-opening.", avatar: "A" },
      { name: "Vikram Joshi", rating: 5, date: "Aug 06, 2025 • 10:30 AM", comment: "The tastings were incredible. Now I can impress my guests with perfect pairings!", avatar: "V" },
    ],
  },
  {
    id: "6",
    title: "Live Acoustic Night",
    image: "/workshops/6.jpg",
    date: "Jul 2025",
    attendees: 35,
    description: "An evening of live music, great coffee, and wonderful company. Experience the cafe's cultural side.",
    reviews: [
      { name: "Nisha Reddy", rating: 5, date: "Jul 22, 2025 • 8:00 PM", comment: "The atmosphere was magical! Live music + amazing coffee = perfect evening. Can't wait for the next one!", avatar: "N" },
      { name: "Amit Desai", rating: 5, date: "Jul 23, 2025 • 7:30 PM", comment: "Fantastic acoustic performances and the best coffee in town. Rabuste really knows how to create an experience.", avatar: "A" },
    ],
  },
];

export default function WorkshopsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<(typeof previousWorkshops)[0] | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: pageScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Add spring smoothing to prevent jittery scroll
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroScale = useTransform(smoothScrollProgress, [0, 1], [1, 1.1]);

  // Smooth background color transition based on page scroll
  return (
    <>
      <Navbar />
      <main ref={containerRef} className="min-h-screen pt-16 lg:pt-20 relative bg-[#D8CBB8]">

        {/* Hero Section */}
        <HeroSection heroRef={heroRef} heroScale={heroScale} />

        {/* Upcoming Workshops */}
        <UpcomingWorkshops pageScrollProgress={pageScrollProgress} />

        {/* Previous Workshops Gallery */}
        <PreviousWorkshops
          pageScrollProgress={pageScrollProgress}
          selectedWorkshop={selectedWorkshop}
          setSelectedWorkshop={setSelectedWorkshop}
        />

        {/* Workshop Detail Modal */}
        <WorkshopDetailModal workshop={selectedWorkshop} onClose={() => setSelectedWorkshop(null)} />

        {/* Enhanced Statistics Section */}
        <ImpactSection />

        {/* Request Workshop Form */}
        <RequestWorkshopSection pageScrollProgress={pageScrollProgress} />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

// Hero Section - Homepage style with video/blur animations
function HeroSection({ heroRef, heroScale }: any) {
  return (
    <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Static without Parallax */}
      <motion.div style={{ scale: heroScale }} className="absolute inset-0 z-0">
        <Image src="/workshops/1.jpg" alt="Workshop Background" fill className="object-cover" priority />
        {/* Black vignette effect */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/80" />
        {/* Grain texture */}
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40">
          <div className="grain-texture h-full w-full" />
        </div>
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        {/* Title matching AboutHero style */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display tracking-wide text-white text-[clamp(2.5rem,8vw,6rem)] leading-tight drop-shadow-2xl uppercase"
        >
          WORKSHOPS
        </motion.h1>

        {/* Coffee Divider matching AboutHero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(15px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 mb-8 flex items-center justify-center gap-4 text-white/90"
        >
          <span className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <Coffee className="h-6 w-6" />
          <span className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl lg:text-2xl text-white/80 font-serif max-w-3xl mx-auto leading-relaxed"
        >
          Master the art of coffee with hands-on workshops led by expert baristas.
          <br className="hidden md:block" />
          From latte art to brewing science, elevate your coffee journey.
        </motion.p>
      </div>
    </section>
  );
}

// Upcoming Workshops - Creative Magazine-Style Layout
function UpcomingWorkshops({ pageScrollProgress }: any) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="upcoming" ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 border-2 border-[#8B6F47] rotate-12" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-[#8B6F47] -rotate-6" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-12 lg:mb-16 px-4"
        >
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-[#404040] mb-6 text-center">
            Upcoming Workshops
          </h2>

          {/* Title Separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-32 h-8 lg:w-40 lg:h-10 mb-6"
          >
            <Image
              src="/title-separator.png"
              fill
              alt="Decorative separator"
              className="object-contain"
            />
          </motion.div>

          <p className="text-xl lg:text-2xl font-serif text-[#404040]/80 text-center max-w-2xl">
            Join our passionate community of coffee lovers and creators
          </p>
        </motion.div>

        {/* Workshops Grid - Alternating Diagonal Layout */}
        <div className="space-y-32">
          {upcomingWorkshops.map((workshop, index) => (
            <UpcomingWorkshopCard key={workshop.id} workshop={workshop} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingWorkshopCard({ workshop, index, isInView }: any) {
  const isEven = index % 2 === 0;
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [focusedField, setFocusedField] = useState("");
  const cardRef = useRef(null);

  /* Parallax Logic */
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90
  });

  const y = useTransform(smoothProgress, [0, 1], ["20%", "-20%"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Registration submitted for ${workshop.title}!`);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isEven ? -100 : 100, rotate: isEven ? -2 : 2 }}
      animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isEven ? "" : "lg:grid-flow-dense"}`}
    >
      {/* Image Side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "200px" }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className={`relative ${isEven ? "" : "lg:col-start-2"}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl w-full max-w-[90%] mx-auto">
          <motion.div style={{ y, scale: 1.5 }} className="relative w-full h-full">
            <Image
              src={workshop.image}
              alt={workshop.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          {/* Polaroid effect */}
          <div className="absolute inset-0 border-8 border-white pointer-events-none" />
          <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#8B6F47] rounded-full flex items-center justify-center shadow-lg">
            <Coffee className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Handwritten note effect */}
        <div className="absolute -top-4 -left-4 bg-amber-100 p-4 shadow-lg rotate-[-5deg] border border-amber-200">
          <p className="font-cormorant italic text-[#404040] text-sm">&quot;{workshop.spots}&quot;</p>
        </div>
      </motion.div>

      {/* Content Side with Scroll Animations */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -100 : 100, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`space-y-6 ${isEven ? "" : "lg:col-start-1 lg:row-start-1"}`}
      >
        <div>
          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block mb-4"
          >
            <span className="bg-[#8B6F47] text-white px-4 py-1 text-xs tracking-widest font-bold rounded-full">{workshop.level}</span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-display text-[#404040] mb-4"
          >
            {workshop.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg font-cormorant text-[#404040]/80 leading-relaxed"
          >
            {workshop.description}
          </motion.p>
        </div>

        {/* Workshop Details with Scroll Animation */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center gap-3 bg-white/50 p-3 rounded-sm">
            <Calendar className="w-5 h-5 text-[#8B6F47]" />
            <div>
              <p className="text-xs text-[#404040]/60 font-inter">Date</p>
              <p className="text-sm font-semibold text-[#404040] font-inter">{workshop.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/50 p-3 rounded-sm">
            <Clock className="w-5 h-5 text-[#8B6F47]" />
            <div>
              <p className="text-xs text-[#404040]/60 font-inter">Time</p>
              <p className="text-sm font-semibold text-[#404040] font-inter">{workshop.time}</p>
            </div>
          </div>
        </motion.div>

        {/* Registration Form - Elegant Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
          className="bg-white/70 backdrop-blur-sm p-8 lg:px-12 rounded-sm shadow-xl border border-[#8B6F47]/10"
        >
          <h4 className="font-display text-2xl font-bold text-[#404040] mb-6">Reserve Your Spot</h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField("")}
                required
                className="w-full bg-transparent border-b border-[#8B6F47]/30 py-4 text-[#404040] text-lg focus:outline-none focus:border-[#8B6F47] transition-colors duration-300 peer placeholder-transparent"
                placeholder="Full Name"
              />
              <label
                className={`absolute left-0 transition-all duration-300 pointer-events-none font-serif ${formData.name || focusedField === "name" ? "-top-3 text-xs text-[#8B6F47]" : "top-4 text-lg text-[#8B6F47]/60"
                  }`}
              >
                Full Name
              </label>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-[#8B6F47] transition-all duration-500 ease-out ${focusedField === "name" ? "w-full" : "w-0"}`} />
            </div>

            <div className="relative group">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                required
                className="w-full bg-transparent border-b border-[#8B6F47]/30 py-4 text-[#404040] text-lg focus:outline-none focus:border-[#8B6F47] transition-colors duration-300 peer placeholder-transparent"
                placeholder="Email Address"
              />
              <label
                className={`absolute left-0 transition-all duration-300 pointer-events-none font-serif ${formData.email || focusedField === "email" ? "-top-3 text-xs text-[#8B6F47]" : "top-4 text-lg text-[#8B6F47]/60"
                  }`}
              >
                Email Address
              </label>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-[#8B6F47] transition-all duration-500 ease-out ${focusedField === "email" ? "w-full" : "w-0"}`} />
            </div>

            <div className="relative group">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField("")}
                required
                className="w-full bg-transparent border-b border-[#8B6F47]/30 py-4 text-[#404040] text-lg focus:outline-none focus:border-[#8B6F47] transition-colors duration-300 peer placeholder-transparent"
                placeholder="Phone Number"
              />
              <label
                className={`absolute left-0 transition-all duration-300 pointer-events-none font-serif ${formData.phone || focusedField === "phone" ? "-top-3 text-xs text-[#8B6F47]" : "top-4 text-lg text-[#8B6F47]/60"
                  }`}
              >
                Phone Number
              </label>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-[#8B6F47] transition-all duration-500 ease-out ${focusedField === "phone" ? "w-full" : "w-0"}`} />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-5 bg-[#404040] text-[#D8CBB8] font-display text-xl font-bold uppercase tracking-widest hover:bg-[#2a2a2a] transition-colors duration-300 shadow-xl mt-8 flex items-center justify-center gap-2 group"
            >
              REGISTER NOW
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#8B6F47]/20 flex items-center justify-between">
            <div>
              <p className="text-3xl font-display font-bold text-[#8B6F47]">{workshop.price}</p>
              <p className="text-xs text-[#404040]/60 font-serif mt-1">Includes all materials & refreshments</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-serif text-[#404040] font-semibold">{workshop.spots}</p>
              <p className="text-xs text-[#404040]/60 font-serif">Available</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Previous Workshops - Stacking Cards Effect
function PreviousWorkshops({ pageScrollProgress, selectedWorkshop, setSelectedWorkshop }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeReviewWorkshopId, setActiveReviewWorkshopId] = useState<string | null>(null);

  return (
    <section ref={containerRef} className="bg-[#D8CBB8] relative pb-10">
      {/* Section Header - Sticky at the very top before cards start */}
      <div className="pt-10 pb-12 px-4 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-[#404040] mb-6"
        >
          Previous Workshops
        </motion.h2>

        {/* Title Separator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-32 h-8 lg:w-40 lg:h-10 mb-6"
        >
          <Image
            src="/title-separator.png"
            fill
            alt="Decorative separator"
            className="object-contain"
          />
        </motion.div>

        <p className="font-serif text-xl lg:text-2xl text-[#404040]/80 max-w-2xl mx-auto">
          A look back at our community gatherings.
        </p>
      </div>

      <div className="flex flex-col items-center">
        {previousWorkshops.map((workshop, index) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            index={index}
            activeReviewWorkshopId={activeReviewWorkshopId}
            setActiveReviewWorkshopId={setActiveReviewWorkshopId}
          />
        ))}
      </div>
    </section>
  );
}

// Workshop Detail Modal
function WorkshopDetailModal({ workshop, onClose }: any) {
  return (
    <AnimatePresence>
      {workshop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#404040]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#D8CBB8] rounded-sm max-w-5xl w-full my-8 relative"
          >
            {/* Close Button - Always visible, larger on mobile */}
            <button
              onClick={onClose}
              className="fixed md:absolute top-4 right-4 z-20 w-12 h-12 md:w-10 md:h-10 bg-[#404040] hover:bg-[#8B6F47] rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <XIcon className="w-6 h-6 md:w-5 md:h-5 text-white" />
            </button>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8">
              {/* Left: Image - Shorter on mobile */}
              <div className="relative aspect-[4/3] md:aspect-square rounded-sm overflow-hidden shadow-2xl">
                <Image src={workshop.image} alt={workshop.title} fill className="object-cover" />
                <div className="absolute inset-0 border-4 md:border-8 border-white" />
              </div>

              {/* Right: Details */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-[#404040] mb-2 md:mb-3">{workshop.title}</h2>
                  <p className="text-base md:text-lg font-cormorant text-[#404040]/80 leading-relaxed">{workshop.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 py-3 md:py-4 border-y border-[#8B6F47]/20">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#8B6F47]" />
                    <span className="text-sm font-inter text-[#404040]">{workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#8B6F47]" />
                    <span className="text-sm font-inter text-[#404040]">{workshop.attendees} attendees</span>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <h3 className="text-xl md:text-2xl font-playfair text-[#404040] mb-3 md:mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-[#8B6F47]" />
                    What People Said
                  </h3>
                  <div className="space-y-3 md:space-y-4 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2">
                    {workshop.reviews.map((review: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/60 p-3 md:p-4 rounded-sm border-l-4 border-[#8B6F47]"
                      >
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#8B6F47] flex items-center justify-center text-white text-sm md:text-base font-bold shrink-0">{review.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start sm:items-center justify-between mb-2 gap-2">
                              <p className="font-semibold text-sm md:text-base text-[#404040] font-inter truncate">{review.name}</p>
                              <div className="flex items-center gap-0.5 shrink-0">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs md:text-sm font-cormorant text-[#404040]/80 italic leading-relaxed">&quot;{review.comment}&quot;</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enhanced Statistics Section - More Informative with Better Visualization
function ImpactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      number: 587,
      suffix: "+",
      label: "Happy Participants",
      icon: Users,
      description: "Coffee lovers trained"
    },
    {
      number: 64,
      suffix: "+",
      label: "Workshops Conducted",
      icon: Coffee,
      description: "Successful sessions"
    },
    {
      number: 98,
      suffix: "%",
      label: "Satisfaction Rate",
      icon: Heart,
      description: "Would recommend"
    },
    {
      number: 4.9,
      suffix: "/5",
      label: "Average Rating",
      icon: Star,
      description: "From all reviews"
    },
  ];

  const achievements = [
    { value: "15+", icon: Award, label: "Awards Won" },
    { value: "8+", icon: Coffee, label: "Master Baristas" },
    { value: "73%", icon: Heart, label: "Repeat Attendees" },
    { value: "42+", icon: Sparkles, label: "Unique Workshops" },
  ];

  return (
    <section ref={sectionRef} className="relative py-12 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-16"
        >
          <h2 className="font-display text-5xl lg:text-6xl font-bold text-[#404040] mb-6 text-center">
            Our Impact
          </h2>

          {/* Coffee Bean Divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-32 h-8 lg:w-40 lg:h-10 mb-6"
          >
            <Image
              src="/title-separator.png"
              fill
              alt="Decorative separator"
              className="object-contain"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl lg:text-2xl font-serif text-[#404040]/70 text-center max-w-2xl"
          >
            Numbers that speak about our commitment to excellence
          </motion.p>
        </motion.div>

        {/* Main Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{
                  delay: 0.1 * index,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-sm shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="mb-6">
                  <Icon className={`w-12 h-12 ${stat.suffix === '/5' ? 'text-amber-500' : 'text-[#8B6F47]'}`} />
                </div>

                {/* Number */}
                <p className={`text-5xl lg:text-6xl font-display font-bold mb-3 ${stat.suffix === '/5' ? 'text-amber-500' : 'text-[#8B6F47]'}`}>
                  {stat.number}{stat.suffix}
                </p>

                {/* Label */}
                <p className="text-lg font-serif text-[#404040] font-semibold mb-2">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="text-sm text-[#404040]/60 font-serif">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Achievements Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-sm p-8 lg:p-12 shadow-lg">
            <h3 className="font-display text-3xl lg:text-4xl font-bold text-[#404040] mb-10 text-center">
              Our Achievements
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{
                      delay: 0.7 + index * 0.1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E8DBC8] rounded-full mb-4">
                      <Icon className="w-10 h-10 text-[#8B6F47]" />
                    </div>
                    <p className="text-3xl font-display font-bold text-[#8B6F47] mb-2">
                      {achievement.value}
                    </p>
                    <p className="text-sm font-serif text-[#404040]/70">
                      {achievement.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Request Workshop Section - Matching Franchise Form Style
function RequestWorkshopSection({ pageScrollProgress }: any) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", workshop: "", message: "" });
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Workshop request submitted successfully!");
    setFormData({ name: "", email: "", phone: "", workshop: "", message: "" });
  };

  const inputs = [
    { name: 'name', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
    { name: 'workshop', label: 'Workshop Theme/Idea', type: 'text' },
  ];

  return (
    <section ref={sectionRef} className="relative w-full py-20 lg:py-32 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Column: The Pitch */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1"
          >
            <h2 className="font-display text-5xl lg:text-7xl font-bold text-[#404040] mb-8 leading-tight">
              Request Your <br />
              <span className="text-[#8B6F47]">Custom Workshop</span>
            </h2>

            <div className="space-y-8 font-serif text-[#5C5C5C] text-lg lg:text-xl leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Have a unique workshop idea? We love creating custom coffee experiences tailored to your vision!
                Whether it&apos;s a corporate team building session, birthday celebration, or innovative concept.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="pl-6 border-l-2 border-[#8B6F47]"
              >
                <h3 className="font-display text-2xl font-bold text-[#404040] mb-2">What We Offer</h3>
                <ul className="space-y-2">
                  <li>✦ Private group sessions (8-30 people)</li>
                  <li>✦ Corporate team building experiences</li>
                  <li>✦ Special occasion workshops</li>
                  <li>✦ Custom curriculum design</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: The Form - Matching Franchise Style */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex-1"
          >
            <h3 className="font-display text-3xl font-bold text-[#404040] mb-8">
              Workshop Request Form
            </h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              {inputs.map((input) => (
                <div key={input.name} className="relative group">
                  <input
                    type={input.type}
                    id={input.name}
                    name={input.name}
                    value={formData[input.name as keyof typeof formData] || ''}
                    onChange={(e) => setFormData({ ...formData, [input.name]: e.target.value })}
                    className="w-full bg-transparent border-b border-[#8B6F47]/30 py-4 text-[#404040] text-lg focus:outline-none focus:border-[#8B6F47] transition-colors duration-300 peer placeholder-transparent"
                    placeholder={input.label}
                    onFocus={() => setFocusedField(input.name)}
                    onBlur={() => setFocusedField('')}
                  />
                  <label
                    htmlFor={input.name}
                    className={`absolute left-0 transition-all duration-300 pointer-events-none ${focusedField === input.name || formData[input.name as keyof typeof formData]
                      ? '-top-3 text-xs text-[#8B6F47]'
                      : 'top-4 text-lg text-[#8B6F47]/60'
                      }`}
                  >
                    {input.label}
                  </label>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-[#8B6F47] transition-all duration-500 ease-out ${focusedField === input.name ? 'w-full' : 'w-0'}`} />
                </div>
              ))}

              <div className="relative group">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message || ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-[#8B6F47]/30 py-4 text-[#404040] text-lg focus:outline-none focus:border-[#8B6F47] transition-colors duration-300 peer placeholder-transparent resize-none"
                  placeholder="Additional Details"
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField('')}
                />
                <label
                  htmlFor="message"
                  className={`absolute left-0 transition-all duration-300 pointer-events-none ${focusedField === 'message' || formData.message
                    ? '-top-3 text-xs text-[#8B6F47]'
                    : 'top-4 text-lg text-[#8B6F47]/60'
                    }`}
                >
                  Additional Details / Special Requirements
                </label>
                <div className={`absolute bottom-0 left-0 h-0.5 bg-[#8B6F47] transition-all duration-500 ease-out ${focusedField === 'message' ? 'w-full' : 'w-0'}`} />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-5 bg-[#404040] text-[#D8CBB8] font-display text-xl font-bold uppercase tracking-widest hover:bg-[#2a2a2a] transition-colors duration-300 shadow-xl mt-8"
              >
                Submit Request
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
