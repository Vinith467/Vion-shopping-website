import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ProductEthicsSection() {
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
        x: "-30vw", // Move left door 30% of screen width out
        ease: "power2.inOut",
        duration: 1
      }, 0)
      .to(rightDoorRef.current, {
        x: "30vw", // Move right door 30% out
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
    <section ref={containerRef} className="relative h-screen w-full bg-[#151515] overflow-hidden flex items-center justify-center">
      
      {/* Center Text (Revealed when doors open) */}
      <div 
        ref={contentRef} 
        className="absolute z-0 w-full md:w-[60%] lg:w-[45%] text-center px-6"
      >
        <span className="text-[#C49A5C] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
          Our Commitment
        </span>
        <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight text-[#C49A5C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Ethics &<br/>Sustainability
        </h2>
        
        <div className="space-y-6 text-sm md:text-base text-[#F5F0E8]/80 font-sans font-light leading-relaxed">
          <p className="font-medium text-[#F5F0E8] text-lg">
            True luxury extends beyond the garment itself—it encompasses the impact we leave on the world.
          </p>
          <p>
            We are committed to ethical sourcing, sustainable practices, and responsible production.
          </p>
          <p>
            From carefully selected fabrics to conscious manufacturing processes, every piece is designed with respect for our environment and the people who make our clothing possible.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 border-t border-[#F5F0E8]/10 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#C49A5C] flex items-center justify-center text-[#C49A5C]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"/><path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"/></svg>
              </div>
              <span className="text-sm tracking-wider uppercase text-[#C49A5C]">Eco Friendly</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#C49A5C] flex items-center justify-center text-[#C49A5C]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </div>
              <span className="text-sm tracking-wider uppercase text-[#C49A5C]">Cruelty Free</span>
            </div>
          </div>

        </div>
      </div>

      {/* Left Door: Eco Friendly */}
      <div 
        ref={leftDoorRef} 
        className="absolute top-0 left-0 w-1/2 h-full z-10 shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <img 
          src="/images/about/vion_eco_1_1787748450123.jpg" 
          alt="Eco Friendly" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-500">
           <h3 className="text-white text-3xl md:text-5xl font-serif tracking-widest uppercase opacity-80">Eco Friendly</h3>
        </div>
      </div>

      {/* Right Door: Cruelty Free */}
      <div 
        ref={rightDoorRef} 
        className="absolute top-0 right-0 w-1/2 h-full z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <img 
          src="/images/about/vion_cruelty_free_1787748530491.jpg" 
          alt="Cruelty Free" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-500">
           <h3 className="text-white text-3xl md:text-5xl font-serif tracking-widest uppercase opacity-80">Cruelty Free</h3>
        </div>
      </div>
    </section>
  );
}
