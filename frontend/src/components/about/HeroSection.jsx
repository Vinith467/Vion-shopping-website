import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeroSection() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Simple fade up for text
      gsap.from(textRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
      });

      // Subtle zoom out for image
      gsap.from(imageRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen w-full bg-[#151515] text-[#F5F0E8] flex flex-col md:flex-row items-center pt-24 md:pt-0">
      {/* Left side: Text */}
      <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center h-full z-10">
        <div ref={textRef} className="max-w-xl">
          <h3 className="text-[#C49A5C] text-sm tracking-[0.2em] uppercase font-bold mb-6">About VION Corporate</h3>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Three Generations.<br/>One Craft.<br/>A New Vision.
          </h1>
          
          <div className="space-y-6 text-sm md:text-base text-[#F5F0E8]/80 font-sans font-light leading-relaxed">
            <p>
              VION Corporate is built on three generations of experience in the clothing and tailoring business. What began as a family-led craft has grown through decades of understanding fabrics, fit, craftsmanship, and what it takes to create clothing that people are proud to wear.
            </p>
            <p>
              Today, the youngest generation is carrying that experience forward with a new approach—bringing technology, modern design thinking, and a more convenient customer experience into the business.
            </p>
            <p>
              We are combining the craftsmanship passed down through generations with modern technology to create a better way for organizations to source professional attire and institutional uniforms.
            </p>
            <p className="text-[#F5F0E8] font-medium">
              Our ambition is simple. To build VION into a Pan-India clothing and uniform partner for corporates, universities, colleges, institutes, and organizations.
            </p>
            <p>
              From understanding your requirements and creating designs to taking individual measurements, manufacturing, quality checking, and delivering—we want to make the entire experience personalized, reliable, and effortless.
            </p>
            <div className="pt-4 pb-8 border-l border-[#C49A5C] pl-6 mt-8">
              <p className="tracking-widest uppercase text-xs mb-2">Generations of craftsmanship.</p>
              <p className="tracking-widest uppercase text-xs mb-2">Technology for tomorrow.</p>
              <p className="tracking-widest uppercase text-xs">A vision to serve India.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden">
        <img 
          ref={imageRef}
          src="/images/about/craft_01_hero_1787726287527.jpg" 
          alt="VION Craftsmanship" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#151515] via-transparent to-transparent"></div>
      </div>
    </section>
  );
}
