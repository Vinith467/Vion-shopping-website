import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const locations = [
  { 
    name: 'Italian Craftsmanship', 
    desc: 'Inspired by generations of Italian tailoring, we focus on refined construction, precision cutting, elegant silhouettes and timeless sartorial techniques.', 
    img: '/images/about/vion_craft_italy_1787748254022.jpg' // I'll use the copied path below
  },
  { 
    name: 'French Refinement', 
    desc: 'We draw from French approaches to sophistication and customization, with an emphasis on elegance, proportion, finishing and meticulous attention to detail.', 
    img: '/images/about/vion_craft_france_1787748294165.jpg' 
  },
  { 
    name: 'Japanese Precision', 
    desc: 'Japanese technical innovation inspires our approach to precision, disciplined processes and painstaking attention to intricate details.', 
    img: '/images/about/vion_craft_japan_1787748309782.jpg' 
  },
  { 
    name: 'Indian Artistry', 
    desc: 'India brings an extraordinary tradition of craftsmanship. Our expertise includes Indian hand embroidery and artisanal techniques, combining traditional skill with contemporary design.', 
    img: '/images/about/vion_craft_india_1787748328151.jpg' 
  },
  { 
    name: 'Global Fabrics', 
    desc: 'From Italian textiles to British, Japanese, Portuguese and Chinese fabrics, we explore materials from around the world and select them according to the purpose, performance, comfort and character required.', 
    img: '/images/about/vion_craft_global_1787748349602.jpg' 
  }
];

export default function CorporateGlobalCraftsmanship() {
  const containerRef = useRef(null);
  const leftTextRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // Pinning the left text is now handled natively by CSS sticky in the JSX.
      // We removed the GSAP pin because pinning flex items breaks their width/layout.

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
    <section ref={containerRef} className="py-24 bg-[#F5F0E8] text-[#151515] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Left Side: Sticky Intro Text */}
        <div className="w-full lg:w-1/3 relative z-10">
          <div className="lg:sticky lg:top-32">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight text-[#151515]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Crafted Around The World.<br/>Made For You.
            </h2>
            <div className="space-y-6 text-sm md:text-base text-[#151515]/80 font-sans font-light leading-relaxed">
              <p>
                We believe exceptional clothing begins with exceptional materials. Our fabrics and materials are sourced from across the world, including Italy, the United Kingdom, Japan, Portugal, China and other renowned textile markets.
              </p>
              <p className="font-medium text-[#151515]">
                But fabric is only the beginning.
              </p>
              <p>
                What truly makes a garment exceptional is the craftsmanship, precision and attention to detail that transforms the material into something extraordinary.
              </p>
              <p>
                At VION, we bring together a global perspective on craftsmanship with the expertise developed through generations of our own tailoring experience.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Stacking Cards */}
        <div className="w-full lg:w-2/3 flex flex-col pt-12 lg:pt-0 relative z-20 pb-[50vh]">
          {locations.map((loc, i) => (
            <div 
              key={i} 
              ref={addToRefs}
              className="w-full bg-[#151515] text-[#F5F0E8] rounded-xl overflow-hidden shadow-2xl mb-12 origin-top flex flex-col"
              style={{ zIndex: i + 1 }}
            >
              <div className="w-full h-[40vh] overflow-hidden relative">
                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent"></div>
              </div>
              <div className="p-8 md:p-12 relative -mt-16 z-10">
                <h3 className="text-2xl md:text-3xl font-serif uppercase tracking-widest mb-4 text-[#C49A5C]">{loc.name}</h3>
                <div className="w-12 h-[1px] bg-[#C49A5C] mb-6"></div>
                <p className="font-sans font-light text-sm md:text-base leading-relaxed text-[#F5F0E8]/80 max-w-xl">
                  {loc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
