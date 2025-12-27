"use client";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import AboutHero from "@/components/sections/AboutHero";
import Script from "next/script";
import dynamic from "next/dynamic";

import Timeline from "@/components/sections/Timeline";
import FranchiseInquiry from "@/components/sections/FranchiseInquiry";

// Load OwnerWords only on client side to prevent hydration issues
const OwnerWordsClient = dynamic(() => import("@/components/sections/OwnerWords").then(mod => ({ default: mod.OwnerWords })), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-[#D8CBB8]" />
});

export default function AboutUs() {
    return (
        <>
            <link rel="stylesheet" type="text/css" href="/pfold/demo.css" />
            <Navbar />
            <main className="min-h-screen pt-16 lg:pt-20 pb-20 lg:pb-8">
                <AboutHero />
                <OwnerWordsClient />
                <Timeline />
                <FranchiseInquiry />
                <Footer />
            </main>
        </>
    );
}
