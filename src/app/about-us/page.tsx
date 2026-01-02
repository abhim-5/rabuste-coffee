"use client";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import About3DHero from "@/components/sections/About3DHero";
import dynamic from "next/dynamic";
import Timeline from "@/components/sections/Timeline";
import FranchiseInquiry from "@/components/sections/FranchiseInquiry";

// Lazy load OwnerWords component (heavy external scripts)
const OwnerWordsClient = dynamic(() => import("@/components/sections/OwnerWords").then(mod => ({ default: mod.OwnerWords })), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-[#D8CBB8] flex items-center justify-center">
    <div className="animate-pulse text-[#8B6F47]">Loading...</div>
  </div>
});

export default function About() {
    return (
        <>
            <link rel="stylesheet" type="text/css" href="/pfold/demo.css" />
            <Navbar />
            <main className="min-h-screen">
                <About3DHero />
                <OwnerWordsClient />
                <Timeline />
                <FranchiseInquiry />
                <Footer />
            </main>
        </>
    );
}
