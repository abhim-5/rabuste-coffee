"use client";

import React from 'react';
import Button from './components/Button';
import WorkshopCard from './components/WorkshopCard';

export default function WorkshopsPage() {
  const workshops = [
    {
      title: "Brewing Basics",
      description: "Master the fundamentals of extraction, grind size, and water temperature to brew the perfect cup at home.",
      duration: "2 Hours",
      mode: "Hands-on"
    },
    {
      title: "Latte Art Masterclass",
      description: "Learn the mechanics of milk frothing and pouring techniques to create stunning heart and rosetta designs.",
      duration: "3 Hours",
      mode: "In-Café"
    },
    {
      title: "Coffee Tasting & Sensory",
      description: "Develop your palate by exploring coffee origins, processing methods, and flavor profiles with our head roaster.",
      duration: "2.5 Hours",
      mode: "Tasting"
    },
    {
      title: "Roasting Fundamentals",
      description: "An exclusive look into the journey from green bean to roasted perfection. Understand the science of the roast curve.",
      duration: "4 Hours",
      mode: "Technical"
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Navbar Placeholder - Minimal */}
      <nav className="w-full py-6 px-4 md:px-12 flex justify-between items-center max-w-7xl">
        <div className="font-serif text-2xl font-bold tracking-tight text-rabuste-espresso">Rabuste.</div>
        <div className="hidden md:flex gap-8 text-sm font-sans tracking-wide text-rabuste-mocha">
          <a href="#" className="hover:text-rabuste-gold transition-colors">Shop</a>
          <a href="#" className="hover:text-rabuste-gold transition-colors">Café</a>
          <a href="#" className="text-rabuste-gold font-bold">Workshops</a>
          <a href="#" className="hover:text-rabuste-gold transition-colors">About</a>
        </div>
        <Button variant="outline" className="text-xs px-6 py-2">Sign In</Button>
      </nav>

      {/* 1) HERO SECTION */}
      <section className="w-full flex flex-col items-center justify-center text-center py-24 px-4 md:py-32 bg-rabuste-cream relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rabuste-mocha to-transparent"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-rabuste-espresso leading-tight">
            Coffee Workshops<br />
            <span className="italic text-rabuste-gold">at Rabuste</span>
          </h1>
          <p className="font-sans text-lg md:text-xl text-rabuste-mocha mb-10 tracking-wide max-w-2xl mx-auto leading-relaxed">
            Experience the art, science, and passion behind every perfect cup.
            Join our expert baristas for an immersive journey into the world of coffee.
          </p>
          <Button variant="primary" className="text-base px-10 py-4 shadow-xl">Register Now</Button>
        </div>
      </section>

      {/* 2) WORKSHOP CARDS SECTION */}
      <section className="w-full py-20 px-4 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {workshops.map((workshop, index) => (
            <WorkshopCard
              key={index}
              title={workshop.title}
              description={workshop.description}
              duration={workshop.duration}
              mode={workshop.mode}
            />
          ))}
        </div>
      </section>

      {/* 3) WHY JOIN OUR WORKSHOPS */}
      <section className="w-full py-24 bg-rabuste-beige/30 px-4 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-16 text-rabuste-espresso">Why Learn With Us?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="flex gap-4">
              <div className="mt-1 w-12 h-12 flex-shrink-0 rounded-full bg-rabuste-beige flex items-center justify-center text-rabuste-gold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2 text-rabuste-espresso">Expert Guidance</h3>
                <p className="text-rabuste-mocha font-sans leading-relaxed">Hands-on learning from championship-winning baristas and certified Q-graders.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 w-12 h-12 flex-shrink-0 rounded-full bg-rabuste-beige flex items-center justify-center text-rabuste-gold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2 text-rabuste-espresso">Premium Equipment</h3>
                <p className="text-rabuste-mocha font-sans leading-relaxed">Train on top-tier commercial espresso machines and professional brewing gear.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 w-12 h-12 flex-shrink-0 rounded-full bg-rabuste-beige flex items-center justify-center text-rabuste-gold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2 text-rabuste-espresso">All Skill Levels</h3>
                <p className="text-rabuste-mocha font-sans leading-relaxed">Sessions designed for everyone—from complete curious beginners to aspiring professionals.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 w-12 h-12 flex-shrink-0 rounded-full bg-rabuste-beige flex items-center justify-center text-rabuste-gold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2 text-rabuste-espresso">Certification</h3>
                <p className="text-rabuste-mocha font-sans leading-relaxed">Receive a signed certificate of participation upon completing any of our masterclasses.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4) CALL TO ACTION */}
      <section className="w-full py-32 bg-rabuste-espresso text-rabuste-cream text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">Ready to Brew Like a Pro?</h2>
          <p className="font-sans text-lg text-rabuste-beige/80 mb-10 tracking-wide">
            Join our workshops and elevate your coffee experience today.
          </p>
          <Button variant="primary" className="bg-rabuste-gold text-white hover:bg-white hover:text-rabuste-espresso px-12 py-4 text-base">
            Join the Workshop
          </Button>
        </div>
      </section>

      {/* Footer Placeholder - Minimal */}
      <footer className="w-full py-12 bg-rabuste-espresso border-t border-white/10 text-center">
        <p className="text-rabuste-beige/40 text-sm font-sans">© 2025 Rabuste Coffee. All rights reserved.</p>
      </footer>
    </main>
  );
}
