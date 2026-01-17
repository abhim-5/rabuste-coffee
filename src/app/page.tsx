import Navbar from "@/components/navbar/Navbar";
import FranchiseInfo from "@/components/sections/FranchiseInfo";
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
import MainMenu from "@/components/sections/MainMenu";
import LaptopScrollAnimation from "@/components/animations/LaptopScrollAnimation";
import MobilePhoneVideo from "@/components/animations/MobilePhoneVideo";
import StatsCounter from "@/components/sections/StatsCounter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-20 pb-20 lg:pb-8">
        <Hero />
        <RobustaMessage />
        <WhatIsRobusta />
        <RobustaVsAmericano />

        {/* DESKTOP: 3D Laptop Animation */}
        <LaptopScrollAnimation />

        {/* MOBILE: Phone Video Frame */}
        <MobilePhoneVideo />

        {/* Stats Section (Desktop: Integrated in Laptop Animation, Mobile: Separate) */}
        <div className="lg:hidden">
          <StatsCounter />
        </div>

        {/* Main Menu Section */}
        <MainMenu />
        <div style={{ backgroundColor: "#D8CBB8" }} className="py-4 hidden lg:block">
          <hr className="border-t border-black/20" />
          <br />
        </div>

        {/* Art Gallery Section */}
        <ArtGallery />

        {/* Separator */}
        <div style={{ backgroundColor: "#D8CBB8" }} className="w-full px-4 lg:px-6 py-0">
          <hr className="border-t border-black/10" />
        </div>

        {/* Fests & Workshops Section */}
        <FestsAndWorkshops />

        {/* Customer Reviews Section */}
        <CustomerReviews />

        {/* Franchise Info Section */}
        <FranchiseInfo />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
