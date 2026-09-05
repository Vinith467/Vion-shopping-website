import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CorporateHeritageTechnology() {
  const containerRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%", // Pin for 1.5 screen heights
          pin: true,
          scrub: 1,
        }
      });

      // Initially, text is hidden and scaled down
      gsap.set(contentRef.current, { opacity: 0, scale: 0.8, y: 50 });

      // The "Door Opening" effect
      tl.to(leftDoorRef.current, {
        xPercent: -120, // Move left door completely out (with overshoot)
        ease: "power2.inOut",
        duration: 1
      }, 0)
      .to(rightDoorRef.current, {
        xPercent: 120, // Move right door completely out (with overshoot)
        ease: "power2.inOut",
        duration: 1
      }, 0)
      // Fade and scale up text in the middle
      .to(contentRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.8
      }, 0.2);

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100dvh] w-full bg-[#151515] overflow-hidden flex items-center justify-center">
      
      {/* Center Text (Revealed when doors open) */}
      <div 
        ref={contentRef} 
        className="absolute z-0 w-full md:w-[60%] lg:w-[45%] text-center px-6"
      >
        <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight text-[#C49A5C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Where Heritage<br/>Meets Technology
        </h2>
        
        <div className="space-y-6 text-sm md:text-base text-[#F5F0E8]/80 font-sans font-light leading-relaxed">
          <p className="font-medium text-[#F5F0E8] text-lg">
            VION is not trying to replace traditional craftsmanship with technology.
          </p>
          <p>
            We are using technology to make craftsmanship more accessible, scalable and convenient.
          </p>
          <p>
            From customer consultations and digital communication to design development, measurements, production management and delivery, technology helps us create a smoother experience while our craftsmen remain at the heart of what we do.
          </p>
          <div className="pt-8">
            <p className="tracking-widest uppercase text-xs mb-3 text-[#C49A5C]">Generations of craftsmanship.</p>
            <p className="tracking-widest uppercase text-xs text-[#C49A5C]">Technology for tomorrow.</p>
          </div>
        </div>
      </div>

      {/* Left Door: Heritage */}
      <div 
        ref={leftDoorRef} 
        className="absolute top-0 left-0 w-1/2 h-full z-10 shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <img 
          src="/images/about/vion_split_heritage_1787748599966.jpg" 
          alt="Traditional Craftsmanship" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-2">
           <h3 className="text-[#F5F0E8] text-sm sm:text-base md:text-4xl font-serif tracking-[0.1em] md:tracking-widest uppercase text-center" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>Generations of Craftsmanship</h3>
        </div>
      </div>

      {/* Right Door: Technology */}
      <div 
        ref={rightDoorRef} 
        className="absolute top-0 right-0 w-1/2 h-full z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <img 
          src="/images/about/vion_split_technology_new.jpg" 
          alt="Modern Technology" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-2">
           <h3 className="text-[#F5F0E8] text-sm sm:text-base md:text-4xl font-serif tracking-[0.1em] md:tracking-widest uppercase text-center" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>Technology for Tomorrow</h3>
        </div>
      </div>
    </section>
  );
}
