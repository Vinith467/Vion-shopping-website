import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const promises = [
  { title: "High-quality fabrics", img: "/images/about/vion_craft_global_1787748349602.jpg" },
  { title: "Exceptional craftsmanship", img: "/images/about/craft_03_cutting_1787726412577.jpg" },
  { title: "Personalized fit", img: "/images/about/craft_04_measuring_1787726583981.jpg" },
  { title: "Thoughtful design", img: "/images/about/corporate_hero_tailor_hands_1787744904933.jpg" },
  { title: "Reliable delivery", img: "/images/about/media_1787749277512.jpg" }, // Use a suitable placeholder for delivery
  { title: "Accessible pricing", img: "/images/about/craft_01_macro_1787726302160.jpg" },
];

export default function QualityAndVision() {
  const containerRef = useRef(null);
  const listRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      listRef.current.forEach((item, index) => {
        gsap.fromTo(item, 
          { 
            opacity: 0.1, 
            x: 50 
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const addToListRefs = (el) => {
    if (el && !listRef.current.includes(el)) {
      listRef.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className="py-32 bg-[#F5F0E8] text-[#151515] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Massive Image Banner */}
        <div className="w-full h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden mb-24 relative shadow-2xl">
          <img 
            src="/images/about/craft_03_details_1787726445718.jpg" 
            alt="Craftsmanship Details" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-[#F5F0E8] text-center px-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Quality Without The<br/>Unnecessary Price
            </h2>
          </div>
        </div>

        {/* Content Split */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left: Paragraphs */}
          <div className="w-full lg:w-5/12">
            <div className="lg:sticky lg:top-32 space-y-6 text-base md:text-lg text-[#151515]/80 font-sans font-light leading-relaxed">
              <p>
                We want people and organizations to experience high-quality fabrics, excellent craftsmanship and thoughtful design without paying an unnecessarily high price.
              </p>
              <p>
                By combining our manufacturing capabilities, experienced partners, technology and direct customer approach, we aim to bring a level of quality that is often associated with premium and luxury tailoring at a much more accessible price point.
              </p>
            </div>
          </div>

          {/* Right: The Promise List */}
          <div className="w-full lg:w-7/12 pt-8 lg:pt-0">
            <h3 className="text-[#C49A5C] font-mono text-sm tracking-widest uppercase mb-12">Our Promise</h3>
            
            <div className="flex flex-col gap-0 md:gap-4">
              {promises.map((promise, index) => (
                <div 
                  key={index} 
                  ref={addToListRefs}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#151515]/10 py-8 cursor-pointer relative"
                >
                  <div className="flex items-center gap-6 z-10 relative">
                    <span className="text-2xl md:text-3xl font-serif text-[#C49A5C]/50 font-light italic transition-colors duration-500 group-hover:text-[#C49A5C]">
                      0{index + 1}
                    </span>
                    <h4 className="text-2xl md:text-4xl font-serif uppercase tracking-wider text-[#151515] transition-transform duration-500 md:group-hover:translate-x-4">
                      {promise.title}
                    </h4>
                  </div>
                  
                  {/* Image Reveal */}
                  <div className="w-full h-48 md:w-48 md:h-24 lg:w-64 lg:h-32 overflow-hidden rounded opacity-100 md:opacity-0 md:-translate-x-8 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-500 ease-out z-0">
                    <img 
                      src={promise.img} 
                      alt={promise.title} 
                      className="w-full h-full object-cover scale-110 md:group-hover:scale-100 transition-transform duration-700 ease-out" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
