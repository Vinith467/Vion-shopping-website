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
    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%", // Pin for 1.5x screen height
          pin: true,
          scrub: 1, // Smooth scrub
        }
      });

      // 1. Initial State: Image is full screen, Content is hidden below
      gsap.set(imageContainerRef.current, { width: "100%", height: "100vh", borderRadius: "0px" });
      gsap.set(contentRef.current, { opacity: 0, x: -50 });
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top" });

      // 2. Animation: 
      // - Image shrinks and moves to right
      // - Overlay text fades out
      // - Content fades in and moves right
      tl.to(imageContainerRef.current, {
        width: "45%",
        height: "85vh",
        borderRadius: "16px",
        x: "50vw", // Move to right side
        ease: "power2.inOut",
        duration: 1
      }, 0)
      .to(imageRef.current, {
        scale: 1.1, // Slight zoom on the image inside the shrinking container
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

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#151515] overflow-hidden flex items-center">
      
      {/* The Image (Starts Fullscreen, Shrinks to Right) */}
      <div 
        ref={imageContainerRef} 
        className="absolute top-1/2 left-0 -translate-y-1/2 z-10 overflow-hidden shadow-2xl"
      >
        <img 
          ref={imageRef}
          src="/images/about/vion_hero_generations.jpg" 
          alt="VION Craftsmanship and Technology" 
          className="w-full h-full object-cover"
        />
        {/* Dark gradient to make text readable when fullscreen */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Fullscreen Overlay Text (Fades out on scroll) */}
      <div 
        ref={overlayTextRef} 
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-4"
      >
        <h3 className="text-[#C49A5C] text-sm tracking-[0.3em] uppercase font-bold mb-6">About VION Corporate</h3>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase text-[#F5F0E8] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Three Generations.<br/>One Craft.<br/>A New Vision.
        </h1>
        <div className="mt-12 animate-bounce">
          <p className="text-[#F5F0E8]/70 text-xs tracking-widest uppercase mb-2">Scroll to explore</p>
          <div className="w-[1px] h-12 bg-[#C49A5C] mx-auto"></div>
        </div>
      </div>

      {/* The Content (Hidden initially, slides in on left) */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-30 flex h-full items-center pointer-events-none">
        <div ref={contentRef} className="w-full md:w-[45%] pointer-events-auto">
          
          <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Three Generations.<br/>One Craft.<br/>A New Vision.
          </h2>
          
          <div className="space-y-5 text-sm lg:text-base text-[#F5F0E8]/80 font-sans font-light leading-relaxed">
            <p>
              VION Corporate is built on three generations of experience in the clothing and tailoring business. What began as a family-led craft has grown through decades of understanding fabrics, fit, craftsmanship, and what it takes to create clothing that people are proud to wear.
            </p>
            <p>
              Today, the youngest generation is carrying that experience forward with a new approach—bringing technology, modern design thinking, and a more convenient customer experience into the business.
            </p>
            <p>
              We are combining the craftsmanship passed down through generations with modern technology to create a better way for organizations to source professional attire and institutional uniforms.
            </p>
            <p className="text-[#C49A5C] font-medium text-base">
              Our ambition is simple.<br/>To build VION into a Pan-India clothing and uniform partner for corporates, universities, colleges, institutes, and organizations.
            </p>
            <p>
              From understanding your requirements and creating designs to taking individual measurements, manufacturing, quality checking, and delivering—we want to make the entire experience personalized, reliable, and effortless.
            </p>
            
            <div className="relative pl-6 mt-8 pt-2 pb-2">
              <div ref={lineRef} className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C49A5C]"></div>
              <p className="tracking-widest uppercase text-xs mb-3 text-[#F5F0E8]">Generations of craftsmanship.</p>
              <p className="tracking-widest uppercase text-xs mb-3 text-[#F5F0E8]">Technology for tomorrow.</p>
              <p className="tracking-widest uppercase text-xs text-[#F5F0E8]">A vision to serve India.</p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
