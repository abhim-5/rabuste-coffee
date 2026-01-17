import Navbar from "@/components/navbar/Navbar";
import dynamic from "next/dynamic";
import Hero from "@/components/hero/Hero";
import RobustaMessage from "@/components/promo/RobustaMessage";
import WhatIsRobusta from "@/components/sections/WhatIsRobusta";
import RobustaVsAmericano from "@/components/sections/RobustaVsAmericano";

// Lazy load heavy below-the-fold components
const ArtGallery = dynamic(() => import("@/components/sections/ArtGallery"));
const FestsAndWorkshops = dynamic(() => import("@/components/sections/FestsAndWorkshops"));
const CustomerReviews = dynamic(() => import("@/components/sections/CustomerReviews"));
import Footer from "@/components/ui/Footer";
import MenuLabels from "@/components/sections/MenuLabels";
import LaptopScrollAnimation from "@/components/animations/LaptopScrollAnimation";
import MobilePhoneVideo from "@/components/animations/MobilePhoneVideo";
import StatsCounter from "@/components/sections/StatsCounter";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-20 pb-20 lg:pb-8">
        <Hero />
        <RobustaMessage />
        <WhatIsRobusta />
        <SectionDivider />
        <RobustaVsAmericano />
        <SectionDivider />

        {/* DESKTOP: 3D Laptop Animation */}
        <LaptopScrollAnimation />

        {/* MOBILE: Phone Video Frame */}
        <MobilePhoneVideo />

        {/* Stats Section (Desktop: Integrated in Laptop Animation, Mobile: Separate) */}
        <div className="lg:hidden">
          <StatsCounter />
        </div>

        {/* Main Menu Section */}
        <MenuLabels />
        <SectionDivider backgroundColor="#faeade" themeColor="#7f3b2d" />

        {/* Art Gallery Section */}
        <ArtGallery />

        {/* Fests & Workshops Section */}
        <FestsAndWorkshops />
        <SectionDivider backgroundColor="#e3a458" />

        {/* Customer Reviews Section */}
        <CustomerReviews />


        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
