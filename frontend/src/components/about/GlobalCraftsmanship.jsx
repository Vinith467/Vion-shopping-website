import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const locations = [
  { name: 'Italian Craftsmanship', desc: 'Inspired by generations of Italian tailoring, we focus on refined construction, precision cutting, elegant silhouettes and timeless sartorial techniques.', img: '/images/about/craft_03_details_1787726445718.jpg' },
  { name: 'French Refinement', desc: 'We draw from French approaches to sophistication and customization, with an emphasis on elegance, proportion, finishing and meticulous attention to detail.', img: '/images/about/craft_01_macro_1787726302160.jpg' },
  { name: 'Japanese Precision', desc: 'Japanese technical innovation inspires our approach to precision, disciplined processes and painstaking attention to intricate details.', img: '/images/about/corporate_fabric_wool_1787744950103.jpg' },
  { name: 'Indian Artistry', desc: 'India brings an extraordinary tradition of craftsmanship. Our expertise includes Indian hand embroidery and artisanal techniques, combining traditional skill with contemporary design.', img: '/images/about/craft_04_measuring_1787726583981.jpg' },
  { name: 'Global Fabrics', desc: 'From Italian textiles to British, Japanese, Portuguese and Chinese fabrics, we explore materials from around the world and select them according to the purpose, performance, comfort and character required.', img: '/images/about/craft_01_selection_1787726319333.jpg' }
];

export default function GlobalCraftsmanship() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Fade in location cards on scroll
      gsap.utils.toArray('.location-row').forEach((row) => {
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-[#151515] text-[#F5F0E8] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Left Side: Sticky Intro Text */}
        <div className="w-full lg:w-1/3 relative">
          <div className="lg:sticky lg:top-32">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight text-[#C49A5C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Crafted Around The World.<br/>Made For You.
            </h2>
            <div className="space-y-6 text-sm md:text-base text-[#F5F0E8]/80 font-sans font-light leading-relaxed">
              <p>
                We believe exceptional clothing begins with exceptional materials. Our fabrics and materials are sourced from across the world, including Italy, the United Kingdom, Japan, Portugal, China and other renowned textile markets.
              </p>
              <p>
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

        {/* Right Side: Scrolling Locations */}
        <div className="w-full lg:w-2/3 flex flex-col gap-24 pt-12 lg:pt-0">
          {locations.map((loc, i) => (
            <div key={i} className="location-row flex flex-col sm:flex-row items-center gap-8">
              {/* Image */}
              <div className="w-full sm:w-1/2 aspect-square overflow-hidden shadow-2xl">
                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              {/* Text */}
              <div className="w-full sm:w-1/2">
                <h3 className="text-2xl font-serif uppercase tracking-widest mb-4 text-[#C49A5C]">{loc.name}</h3>
                <div className="w-8 h-px bg-[#F5F0E8]/30 mb-4"></div>
                <p className="font-sans font-light text-sm md:text-base leading-relaxed text-[#F5F0E8]/70">
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
