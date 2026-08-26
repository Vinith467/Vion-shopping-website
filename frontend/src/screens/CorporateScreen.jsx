import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CorporateHero from '../components/corporate/CorporateHero';
import WhoWeServe from '../components/corporate/WhoWeServe';
import WhyChooseVion from '../components/corporate/WhyChooseVion';
import OurProcess from '../components/corporate/OurProcess';
import OurOfferings from '../components/corporate/OurOfferings';

gsap.registerPlugin(ScrollTrigger);

export default function CorporateScreen() {
  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-[#111111] overflow-x-hidden font-sans">
      
      {/* 
        The Corporate Navigation Header 
        (Hardcoded for now based on the mockup)
      */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between text-[#F5F0E8]">
        <div className="flex flex-col cursor-pointer group">
          <span className="text-2xl md:text-3xl font-serif font-bold tracking-widest leading-none">
            VION
          </span>
          <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.3em] uppercase mt-1 opacity-80">
            Corporate
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
          <a href="#" className="text-[#C49A5C]">Home</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">About Us</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Solutions</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Our Process</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Our Work</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Resources</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Contact Us</a>
        </div>

        <button className="hidden md:block bg-[#C49A5C] hover:bg-[#a8824b] text-white text-sm font-bold px-6 py-2.5 rounded-sm transition-colors">
          Book Consultation &rarr;
        </button>
      </nav>

      {/* Assembly of Components */}
      <CorporateHero />
      <WhoWeServe />
      <WhyChooseVion />
      <OurProcess />
      <OurOfferings />
      
      {/* 
        Placeholder for the rest of the sections that will be built next 
      */}
      <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p className="text-2xl text-gray-400 font-serif italic">More corporate sections coming...</p>
      </div>
      
    </div>
  );
}
