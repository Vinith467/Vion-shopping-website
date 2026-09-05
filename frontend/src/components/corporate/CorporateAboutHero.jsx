import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CorporateAboutHero() {
  const containerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const overlayTextRef = useRef(null);
  const contentRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let ctx = gsap.context(() => {
      
      // Desktop: full pin + slide animation
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
          }
        });

        gsap.set(imageContainerRef.current, { width: "100%", height: "100vh", borderRadius: "0px" });
        gsap.set(contentRef.current, { opacity: 0, x: -50 });
        gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top" });

        tl.to(imageContainerRef.current, {
          width: "45%",
          height: "85vh",
          borderRadius: "16px",
          x: "50vw",
          ease: "power2.inOut",
          duration: 1
        }, 0)
        .to(imageRef.current, {
          scale: 1.1,
          duration: 1,
          ease: "power2.inOut"
        }, 0)
        .to(overlayTextRef.current, {
          opacity: 0,
          y: -100,
          duration: 0.5,
          ease: "power2.in"
        }, 0)
        .to(contentRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out"
        }, 0.4)
        .to(lineRef.current, {
          scaleY: 1,
          duration: 0.5,
          ease: "power2.out"
        }, 0.8);
      });

      // Mobile: no pin, simple static layout
      mm.add("(max-width: 1023px)", () => {
        // Hide the overlay text (we show content directly on mobile)
        gsap.set(overlayTextRef.current, { opacity: 0 });
        // Show content immediately
        gsap.set(contentRef.current, { opacity: 1, x: 0 });
        gsap.set(lineRef.current, { scaleY: 1, transformOrigin: "top" });
        // Image container: static, not absolute-positioned for animation
        gsap.set(imageContainerRef.current, { 
          width: "100%", 
          height: "60vw", 
          borderRadius: "0px",
          position: "relative",
          top: "auto",
          left: "auto",
          transform: "none"
        });
      });

    }, containerRef);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative lg:h-screen w-full bg-[#151515] overflow-hidden lg:flex lg:items-center">
      
      {/* The Image (Starts Fullscreen on desktop, static banner on mobile) */}
      <div 
        ref={imageContainerRef} 
        className="lg:absolute lg:top-1/2 lg:left-0 lg:-translate-y-1/2 z-10 overflow-hidden shadow-2xl w-full h-[60vw] lg:h-auto"
      >
        <img 
          ref={imageRef}
          src="/images/about/vion_hero_generations.jpg" 
          alt="VION Craftsmanship and Technology" 
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Fullscreen Overlay Text (Desktop only, fades out on scroll) */}
      <div 
        ref={overlayTextRef} 
        className="absolute inset-0 z-20 hidden lg:flex flex-col items-center justify-center text-center pointer-events-none px-4"
      >
        <h3 className="text-[#C49A5C] text-sm tracking-[0.3em] uppercase font-bold mb-6">About VION Fashion</h3>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase text-[#F5F0E8] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Three Generations.<br/>One Craft.<br/>A New Vision.
        </h1>
        <div className="mt-12 animate-bounce">
          <p className="text-[#F5F0E8]/70 text-xs tracking-widest uppercase mb-2">Scroll to explore</p>
          <div className="w-[1px] h-12 bg-[#C49A5C] mx-auto"></div>
        </div>
      </div>

      {/* The Content */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-30 lg:flex lg:h-full lg:items-center lg:pointer-events-none py-10 lg:py-0">
        <div ref={contentRef} className="w-full lg:w-[45%] lg:pointer-events-auto">
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-4 lg:mb-6 leading-tight text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Three Generations.<br/>One Craft.<br/>A New Vision.
          </h2>
          
          <div className="space-y-4 lg:space-y-6 text-sm lg:text-base text-[#F5F0E8]/80 font-sans font-light leading-relaxed">
            <p>
              VION Fashion is built on three generations of experience in the clothing and tailoring business. What began as a family-led craft has evolved into a modern brand—combining decades of understanding fabrics, fit, and craftsmanship with contemporary design thinking.
            </p>
            <p className="text-[#C49A5C] font-medium text-base">
              Our ambition is simple.<br/>To build VION into a trusted brand for individuals who appreciate premium quality, perfect fit, and timeless elegance.
            </p>
            <p>
              From understanding your personal style to taking individual measurements, tailoring, and delivering—we make the entire experience personalized and effortless.
            </p>
            
            <div className="relative pl-6 mt-4 lg:mt-6 pt-2 pb-2">
              <div ref={lineRef} className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C49A5C]"></div>
              <p className="tracking-widest uppercase text-[10px] md:text-xs mb-2 text-[#F5F0E8]">Generations of craftsmanship.</p>
              <p className="tracking-widest uppercase text-[10px] md:text-xs mb-2 text-[#F5F0E8]">Technology for tomorrow.</p>
              <p className="tracking-widest uppercase text-[10px] md:text-xs text-[#F5F0E8]">A vision to serve India.</p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
