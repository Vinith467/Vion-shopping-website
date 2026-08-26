import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import HeroSection from '../components/corporate/HeroSection';
import GenerationsTimeline from '../components/corporate/GenerationsTimeline';
import GlobalCraftsmanship from '../components/corporate/GlobalCraftsmanship';

gsap.registerPlugin(ScrollTrigger);

export default function CorporateScreen() {
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
    <div ref={containerRef} className="bg-[#151515] text-[#F5F0E8] min-h-screen font-sans selection:bg-[#722F37] selection:text-white overflow-x-hidden">
      <HeroSection />
      <GenerationsTimeline />
      <GlobalCraftsmanship />

      {/* Placeholders for other sections... */}
      <section className="h-screen flex items-center justify-center bg-[#F5F0E8] text-[#151515]">
        <h2 className="text-3xl font-serif">More sections coming...</h2>
      </section>
    </div>
  );
}
