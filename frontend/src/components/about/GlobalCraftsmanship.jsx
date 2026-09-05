import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const craftPillars = [
  { 
    name: 'Italian & French Heritage', 
    desc: 'Inspired by generations of Italian tailoring, we focus on refined construction, precision cutting, and elegant silhouettes. We draw inspiration from French approaches to sophistication and customization, with an emphasis on proportion, finishing and meticulous attention to detail.', 
    img: '/New folder/5.png' 
  },
  { 
    name: 'Japanese Precision', 
    desc: 'Japanese technical innovation inspires our approach to precision, disciplined processes and meticulous attention to intricate detail.', 
    img: '/New folder/6.png' 
  },
  { 
    name: 'Indian Artistry', 
    desc: 'India has an extraordinary tradition of craftsmanship. Our expertise includes Indian hand embroidery and artisanal techniques, bringing traditional skills together with contemporary fashion.', 
    img: '/New folder/7.png' 
  },
  { 
    name: 'Global Fabrics', 
    desc: 'From Italian textiles to British, Japanese, Portuguese and Chinese fabrics, we explore materials from around the world and select them based on their quality, comfort, performance, character and purpose.', 
    img: '/New folder/4.png' 
  }
];

export default function GlobalCraftsmanship() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Create a stacking effect for the cards on the right
      cardsRef.current.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top " + (40 + index * 40) + "px", // Pinned higher up, standard 40px overlap
          endTrigger: containerRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });
      });
      
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className="py-24 bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 text-[#1A1A1A] dark:text-[#F5F0E8] relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Left Side: Sticky Intro Text */}
        <div className="w-full lg:w-5/12 relative z-10">
          <div className="lg:sticky lg:top-32">
            
            <div className="mb-8 w-full h-[30vh] lg:h-[40vh] overflow-hidden rounded-2xl shadow-xl">
              <img src="/New folder/4.png" alt="Global Sourcing" className="w-full h-full object-cover" />
            </div>

            <h3 className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-[#A87B45] mb-4">Global Sourcing</h3>
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6 md:mb-8 leading-tight text-[#111] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Crafted Around The World.<br/>Made For You.
            </h2>
            <div className="space-y-5 text-[15px] text-[#555] font-light leading-relaxed">
              <p>
                We believe exceptional clothing begins with exceptional materials.
                Our fabrics and materials are sourced from across the world, including Italy, the United Kingdom, Japan, Portugal, China and other renowned textile markets.
              </p>
              <p className="font-semibold text-[#111] dark:text-[#F5F0E8]">
                But fabric is only the beginning.
              </p>
              <p>
                What truly makes a garment exceptional is the craftsmanship, precision and attention to detail that transforms the material into something extraordinary.
              </p>
              <p>
                At VION, we bring together a global perspective on textiles and craftsmanship with the expertise developed through three generations of tailoring experience.
              </p>
            </div>
            
            <div className="mt-10 p-6 bg-[#1A1A1A] text-white rounded-xl shadow-2xl">
              <p className="text-[16px] italic leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                "The result is clothing that brings together global inspiration and Indian craftsmanship."
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Stacking Cards */}
        <div className="w-full lg:w-7/12 flex flex-col pt-12 lg:pt-0 relative z-20 pb-[50vh]">
          {craftPillars.map((pillar, i) => (
            <div 
              key={i} 
              ref={addToRefs}
              className="w-full h-[80dvh] lg:h-auto bg-[#1A1A1A] text-white rounded-2xl overflow-hidden shadow-2xl mb-12 origin-top flex flex-col border border-white/10 relative"
              style={{ zIndex: i + 1 }}
            >
              <div className="absolute lg:relative inset-0 lg:inset-auto w-full h-full lg:h-[45vh] overflow-hidden z-0">
                <img src={pillar.img} alt={pillar.name} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/80 lg:via-black/20 to-transparent"></div>
              </div>
              
              {/* Spacer for mobile to push content to bottom, hidden on desktop */}
              <div className="flex-grow block lg:hidden"></div>

              <div className="mt-auto lg:mt-0 p-8 lg:p-12 relative lg:-mt-16 z-10">
                <h3 className="text-2xl lg:text-3xl font-bold uppercase tracking-widest mb-4 text-[#E5CDA7]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{pillar.name}</h3>
                <div className="w-12 h-[2px] bg-[#E5CDA7] mb-6"></div>
                <p className="font-sans font-light text-[15px] leading-relaxed text-white/80 max-w-xl">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
