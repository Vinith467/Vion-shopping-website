import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeritageTechnology() {
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
      gsap.set(contentRef.current, { opacity: 0, scale: 0.9, y: 30 });

      // The "Door Opening" effect
      tl.to(leftDoorRef.current, {
        xPercent: -100, // Move left door completely out
        ease: "power2.inOut",
        duration: 1
      }, 0)
      .to(rightDoorRef.current, {
        xPercent: 100, // Move right door completely out
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
    <section ref={containerRef} className="relative h-[100dvh] w-full bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 overflow-hidden flex items-center justify-center border-t border-black/5">
      
      {/* Center Text (Revealed when doors open) */}
      <div 
        ref={contentRef} 
        className="absolute z-0 w-full md:w-[75%] lg:w-[55%] text-center px-6 max-h-[90vh] overflow-y-auto no-scrollbar py-8 flex flex-col justify-center"
      >
        <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#A87B45] mb-3">Where Heritage Meets Technology</h3>
        <h2 className="text-2xl md:text-4xl font-bold mb-5 md:mb-6 leading-tight text-[#111] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          VION is not trying to replace traditional craftsmanship with technology.
        </h2>
        
        <div className="space-y-4 text-[14px] md:text-[15px] text-[#555] font-light leading-relaxed max-w-2xl mx-auto">
          <p>
            We are using technology to make great clothing more accessible, convenient and personal.
          </p>
          <p>
            From discovering collections and selecting sizes to customization, digital communication, order management and delivery, technology helps us create a smoother shopping experience.
          </p>
          <p className="font-semibold text-[#111] dark:text-[#F5F0E8]">
            But behind every garment remains something technology cannot replace:<br/>
            Human craftsmanship.
          </p>
          <p>
            Our craftsmen, designers and manufacturing partners remain at the heart of what we do.
          </p>
          
          <div className="pt-5 border-t border-black/10 flex flex-col items-center gap-2">
            <p className="tracking-[0.15em] uppercase text-[10px] font-bold text-[#A87B45]">Generations of craftsmanship.</p>
            <p className="tracking-[0.15em] uppercase text-[10px] font-bold text-[#A87B45]">Technology for tomorrow.</p>
          </div>
        </div>
      </div>

      {/* Left Door: Heritage */}
      <div 
        ref={leftDoorRef} 
        className="absolute top-0 left-0 w-1/2 h-full z-10 shadow-[20px_0_50px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        <img 
          src="/New folder/9.png" 
          alt="Traditional Craftsmanship" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <h3 className="text-white text-2xl md:text-4xl font-serif tracking-widest uppercase" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>Heritage</h3>
        </div>
      </div>

      {/* Right Door: Technology */}
      <div 
        ref={rightDoorRef} 
        className="absolute top-0 right-0 w-1/2 h-full z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        <img 
          src="/New folder/8.png" 
          alt="Modern Technology" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <h3 className="text-white text-2xl md:text-4xl font-serif tracking-widest uppercase" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>Technology</h3>
        </div>
      </div>
    </section>
  );
}
