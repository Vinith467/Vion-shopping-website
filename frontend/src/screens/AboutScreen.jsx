import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import HeroSection from '../components/about/HeroSection';
import GenerationsTimeline from '../components/about/GenerationsTimeline';
import GlobalCraftsmanship from '../components/about/GlobalCraftsmanship';
import HeritageTechnology from '../components/about/HeritageTechnology';
import OurApproach from '../components/about/OurApproach';
import QualityAndVision from '../components/about/QualityAndVision';
import OurVision from '../components/about/OurVision';

gsap.registerPlugin(ScrollTrigger);

export default function AboutScreen() {
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
    <div ref={containerRef} className="bg-[#151515] text-[#F5F0E8] min-h-screen font-sans selection:bg-[#722F37] selection:text-white overflow-clip relative">
      
      {/* Floating Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-8 left-6 md:left-12 z-50 flex items-center gap-2 text-[#F5F0E8]/70 hover:text-[#C49A5C] transition-colors bg-[#111111]/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-lg group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold">Back</span>
      </button>

      <HeroSection />
      <GenerationsTimeline />
      <GlobalCraftsmanship />
      <HeritageTechnology />
      <OurApproach />
      <QualityAndVision />
      <OurVision />
      
    </div>
  );
}
