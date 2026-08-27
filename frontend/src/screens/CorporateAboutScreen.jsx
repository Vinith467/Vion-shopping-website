import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import CorporateAboutHero from '../components/corporate/CorporateAboutHero';
import CorporateGenerationsTimeline from '../components/corporate/CorporateGenerationsTimeline';
import CorporateGlobalCraftsmanship from '../components/corporate/CorporateGlobalCraftsmanship';
import CorporateHeritageTechnology from '../components/corporate/CorporateHeritageTechnology';
import CorporateOurApproach from '../components/corporate/CorporateOurApproach';
import CorporateQualityAndVision from '../components/corporate/CorporateQualityAndVision';
import CorporateOurVision from '../components/corporate/CorporateOurVision';

gsap.registerPlugin(ScrollTrigger);

export default function CorporateAboutScreen() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#111111] text-[#F5F0E8] overflow-x-clip font-sans selection:bg-[#722F37] selection:text-white">
      
      {/* 
        The Navigation Header 
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
          <Link to="/" className="text-[#F5F0E8] opacity-70 hover:opacity-100 transition-opacity">Home</Link>
          <a href="#" className="text-[#C49A5C]">About Us</a>
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

      {/* Assembly of the Corporate About Story */}
      <CorporateAboutHero />
      <CorporateGenerationsTimeline />
      <CorporateGlobalCraftsmanship />
      <CorporateHeritageTechnology />
      <CorporateOurApproach />
      <CorporateQualityAndVision />
      <CorporateOurVision />
      
    </div>
  );
}
