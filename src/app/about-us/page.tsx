import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import AboutHero from "@/components/sections/AboutHero";
import OwnerWords from "@/components/sections/OwnerWords";
import Script from "next/script";

import Timeline from "@/components/sections/Timeline";
import FranchiseInquiry from "@/components/sections/FranchiseInquiry";

export default function AboutUs() {
    return (
        <>
            <link rel="stylesheet" type="text/css" href="/pfold/demo.css" />
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="https://code.jquery.com/jquery-1.8.2.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="https://cdn.jsdelivr.net/gh/codrops/PFold/js/jquery.pfold.js"
                strategy="lazyOnload"
            />
            <Navbar />
            <main className="min-h-screen pt-16 lg:pt-20 pb-20 lg:pb-8">
                <AboutHero />
                <OwnerWords />
                <Timeline />
                <FranchiseInquiry />
                <Footer />
            </main>
        </>
    );
}
