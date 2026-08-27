import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function VionManifesto() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // Parallax for the epic background
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Dramatic fade in for the manifesto lines
      gsap.fromTo(linesRef.current, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      
      {/* Majestic Parallax Background */}
      <div className="absolute inset-0 z-0">
        <div ref={bgRef} className="absolute -top-[20%] left-0 w-full h-[140%]">
          <img src="/New folder/manifesto_couple.jpg" alt="Vion Vision Ahead" className="w-full h-full object-cover" />
        </div>
        {/* Gradients for text legibility and cinematic framing */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#111]/40 to-[#111]/80"></div>
      </div>

      {/* Manifesto Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex flex-col items-center justify-center h-full pt-20">
        
        <div className="space-y-6 md:space-y-10 mb-12 md:mb-20">
          <h2 ref={el => linesRef.current[0] = el} className="text-xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase text-white/90" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Three generations behind us.
          </h2>
          <h2 ref={el => linesRef.current[1] = el} className="text-xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase text-white/90" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            A world of craftsmanship around us.
          </h2>
          <h2 ref={el => linesRef.current[2] = el} className="text-xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase text-white/90" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Technology taking us forward.
          </h2>
          <h2 ref={el => linesRef.current[3] = el} className="text-xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase text-[#C49A5C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            One vision ahead —
          </h2>
        </div>

        {/* The VION Logo Mark Finale */}
        <div ref={el => linesRef.current[4] = el} className="w-full flex flex-col items-center justify-center border-t border-[#C49A5C]/30 pt-10 mt-10 gap-8">
          <img src="/New folder/logo.png" alt="Vion Logo" className="h-24 md:h-32 lg:h-40 object-contain drop-shadow-2xl" />
          <h1 className="text-xl md:text-3xl lg:text-4xl font-serif font-medium tracking-[0.3em] uppercase text-white drop-shadow-2xl">
            VION FASHION
          </h1>
        </div>
        
      </div>
    </section>
  );
}
