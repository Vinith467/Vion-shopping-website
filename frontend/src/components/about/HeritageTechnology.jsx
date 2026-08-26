import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeritageTechnology() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.ht-text', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-[#F5F0E8] text-[#151515]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Side: Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-1">
          <div>
            <h2 className="ht-text text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Where Heritage Meets Technology
            </h2>
            
            <div className="space-y-6 text-sm md:text-base text-[#151515]/80 font-sans font-light leading-relaxed">
              <p className="ht-text font-medium text-[#151515]">
                VION is not trying to replace traditional craftsmanship with technology.
              </p>
              <p className="ht-text">
                We are using technology to make craftsmanship more accessible, scalable and convenient.
              </p>
              <p className="ht-text">
                From customer consultations and digital communication to design development, measurements, production management and delivery, technology helps us create a smoother experience while our craftsmen remain at the heart of what we do.
              </p>
              <div className="ht-text pt-4 border-l border-[#C49A5C] pl-6 mt-8">
                <p className="tracking-widest uppercase text-xs mb-2">Generations of craftsmanship.</p>
                <p className="tracking-widest uppercase text-xs">Technology for tomorrow.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Image Grid */}
        <div className="w-full md:w-1/2 relative order-1 md:order-2 grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] overflow-hidden rounded shadow-xl translate-y-8">
            <img src="/images/about/craft_01_hero_1787726287527.jpg" alt="Heritage" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded shadow-xl -translate-y-8">
            <img src="/images/about/corporate_gallery_editorial_1787745065973.jpg" alt="Technology" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>

      </div>
    </section>
  );
}
