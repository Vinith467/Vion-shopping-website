import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const locations = [
  { name: 'ITALY', desc: 'Refined construction. Precision cutting. Sartorial elegance.', img: '/craft_03_details_1787726445718.jpg' },
  { name: 'BRITAIN', desc: 'Heritage textiles. Structured tailoring. Classic proportions.', img: '/craft_01_macro_1787726302160.jpg' },
  { name: 'JAPAN', desc: 'Precision. Discipline. Technical innovation.', img: '/corporate_fabric_wool_1787744950103.jpg' },
  { name: 'PORTUGAL', desc: 'Expert manufacturing. Premium cottons. Seamless finishing.', img: '/craft_01_selection_1787726319333.jpg' },
  { name: 'CHINA', desc: 'Advanced scale. High-performance materials. Modern production.', img: '/craft_03_artisans_1787726458130.jpg' },
  { name: 'INDIA', desc: 'Hand embroidery. Artisanal craftsmanship. Contemporary design.', img: '/craft_04_measuring_1787726583981.jpg' }
];

export default function GlobalCraftsmanship() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${trackRef.current.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
        }
      });

      tl.to(trackRef.current, {
        x: () => -(trackRef.current.scrollWidth - window.innerWidth),
        ease: "none"
      });

      // Subtle parallax on images as they enter
      gsap.utils.toArray('.location-card').forEach((card) => {
        const img = card.querySelector('img');
        gsap.fromTo(img, 
          { scale: 1.2, xPercent: -10 }, 
          { 
            scale: 1, xPercent: 10,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: "left right",
              end: "right left",
              scrub: true
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen w-full bg-[#F5F0E8] overflow-hidden flex flex-col justify-center relative">
      
      {/* Title */}
      <div className="absolute top-16 left-12 md:left-24 z-20 mix-blend-difference text-[#F5F0E8]">
        <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-widest leading-tight">
          Crafted Around The World.<br/>Made For You.
        </h2>
      </div>

      {/* Horizontal Track */}
      <div ref={trackRef} className="flex items-center h-[60vh] mt-20 pl-12 md:pl-24 pr-[50vw]">
        {locations.map((loc, i) => (
          <div key={i} className="location-card flex-shrink-0 w-[80vw] md:w-[50vw] h-full mr-12 md:mr-32 relative flex items-center">
            
            {/* Image Container with masked overflow */}
            <div className="w-[60%] h-[80%] overflow-hidden relative z-10 shadow-2xl">
              <img src={loc.img} alt={loc.name} className="w-full h-full object-cover" />
            </div>

            {/* Typography overlay */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[45%] z-20 w-[60%]">
              <div className="text-[#151515]">
                <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter opacity-10">{loc.name}</h3>
                <h3 className="text-3xl md:text-5xl font-serif uppercase tracking-widest -mt-8 md:-mt-12 mb-4">{loc.name}</h3>
                <div className="w-8 h-px bg-[#C49A5C] mb-4"></div>
                <p className="font-sans font-light text-sm md:text-base leading-relaxed tracking-wide text-[#151515]/80 max-w-xs">
                  {loc.desc}
                </p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
    </section>
  );
}
