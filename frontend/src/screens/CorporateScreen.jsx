import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CorporateHero from '../components/corporate/CorporateHero';
import WhoWeServe from '../components/corporate/WhoWeServe';
import WhyChooseVion from '../components/corporate/WhyChooseVion';
import OurProcess from '../components/corporate/OurProcess';
import OurOfferings from '../components/corporate/OurOfferings';

gsap.registerPlugin(ScrollTrigger);

export default function CorporateScreen() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F5F0E8] overflow-x-hidden font-sans transition-colors duration-500 relative">

      {/* 
        The Corporate Navigation Header 
        (Hardcoded for now based on the mockup)
      */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between text-[#F5F0E8]">
        <div className="flex flex-col cursor-pointer group" onClick={() => navigate('/corporate')}>
          <span className="text-2xl md:text-3xl font-serif font-bold tracking-widest leading-none">
            VION
          </span>
          <span className="text-[9px] md:text-[10px] font-sans font-bold tracking-[0.3em] uppercase mt-1 opacity-80">
            Corporate
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide">
          <Link to="/" className="text-[#C49A5C]">Home</Link>
          <Link to="/corporate/about" className="hover:text-[#C49A5C] transition-colors">About Us</Link>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Solutions</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Our Process</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Our Work</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Resources</a>
          <a href="#" className="hover:text-[#C49A5C] transition-colors">Contact Us</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:block bg-[#C49A5C] hover:bg-[#a8824b] text-white text-sm font-bold px-6 py-2.5 rounded-sm transition-colors">
            Book Consultation &rarr;
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-[#F5F0E8] hover:text-[#C49A5C] transition-colors z-[60]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className={`lg:hidden fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col pt-24 px-6 transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col gap-6 text-white text-lg font-serif tracking-widest uppercase">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5C] transition-colors border-b border-white/10 pb-4">Home</Link>
          <Link to="/corporate/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5C] transition-colors border-b border-white/10 pb-4">About Us</Link>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5C] transition-colors border-b border-white/10 pb-4">Solutions</a>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5C] transition-colors border-b border-white/10 pb-4">Our Process</a>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5C] transition-colors border-b border-white/10 pb-4">Our Work</a>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5C] transition-colors border-b border-white/10 pb-4">Resources</a>
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A5C] transition-colors border-b border-white/10 pb-4">Contact Us</a>
          <button onClick={() => setIsMobileMenuOpen(false)} className="bg-[#C49A5C] text-[#0A0A0A] py-3 text-sm font-bold uppercase rounded-sm mt-4">Book Consultation</button>
        </div>
      </div>

      {/* Assembly of Components */}
      <CorporateHero />
      <WhoWeServe />
      <WhyChooseVion />
      <OurProcess />
      <OurOfferings />

      {/* 
        Placeholder for the rest of the sections that will be built next 
      */}
      <div className="h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 ">
        <p className="text-2xl text-gray-400 font-serif italic">More corporate sections coming...</p>
      </div>

    </div>
  );
}
