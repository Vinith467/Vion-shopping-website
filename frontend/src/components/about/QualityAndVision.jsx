import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const promises = [
  { title: "High-quality fabrics", img: "/images/about/vion_craft_global_1787748349602.jpg" },
  { title: "Exceptional craftsmanship", img: "/images/about/craft_03_cutting_1787726412577.jpg" },
  { title: "Personalized fit", img: "/images/about/craft_04_measuring_1787726583981.jpg" },
  { title: "Thoughtful design", img: "/images/about/corporate_hero_tailor_hands_1787744904933.jpg" },
  { title: "Reliable delivery", img: "/images/about/media_1787749277512.jpg" }, 
  { title: "Accessible pricing", img: "/images/about/craft_01_macro_1787726302160.jpg" },
];

export default function QualityAndVision() {
  const containerRef = useRef(null);
  const listRef = useRef([]);
  const cursorRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // List item reveal animation
      listRef.current.forEach((item, index) => {
        gsap.fromTo(item, 
          { 
            opacity: 0.1, 
            y: 30 
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "top 60%",
              scrub: 1,
            }
          }
        );
      });

      // Mouse tracking for floating image
      const handleMouseMove = (e) => {
        if (cursorRef.current) {
          gsap.to(cursorRef.current, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.6,
            ease: "power3.out"
          });
        }
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);

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
      
      {/* Floating Mouse Image Reveal */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-64 h-80 md:w-80 md:h-[400px] pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden shadow-2xl transition-transform duration-500 ease-out hidden md:block"
        style={{
          transform: `scale(${activeIndex !== null ? 1 : 0}) translate(-50%, -50%)`,
          transformOrigin: '0 0'
        }}
      >
        {promises.map((promise, index) => (
          <img 
            key={index}
            src={promise.img}
            alt={promise.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Massive Image Banner */}
        <div className="w-full h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden mb-32 relative shadow-2xl">
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
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
          
          {/* Left: Paragraphs */}
          <div className="w-full lg:w-4/12">
            <div className="lg:sticky lg:top-32 space-y-8 text-base md:text-lg text-[#151515]/80 font-sans font-light leading-relaxed">
              <p>
                We want people and organizations to experience high-quality fabrics, excellent craftsmanship and thoughtful design without paying an unnecessarily high price.
              </p>
              <p>
                By combining our manufacturing capabilities, experienced partners, technology and direct customer approach, we aim to bring a level of quality that is often associated with premium and luxury tailoring at a much more accessible price point.
              </p>
            </div>
          </div>

          {/* Right: Massive Typography List */}
          <div className="w-full lg:w-8/12">
            <h3 className="text-[#C49A5C] font-mono text-sm tracking-widest uppercase mb-12 hidden lg:block">Our Promise</h3>
            
            <div className="flex flex-col w-full" onMouseLeave={() => setActiveIndex(null)}>
              {promises.map((promise, index) => (
                <div 
                  key={index} 
                  ref={addToListRefs}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="group flex flex-col justify-center border-b border-[#151515]/20 py-8 md:py-12 cursor-pointer relative"
                >
                  <div className="flex flex-col relative z-10 transition-transform duration-700 md:group-hover:translate-x-8">
                    <span className="text-sm md:text-base font-serif text-[#C49A5C] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 italic">
                      0{index + 1}
                    </span>
                    <h4 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-[#151515] leading-none">
                      {promise.title}
                    </h4>
                  </div>
                  
                  {/* Mobile Only Image - hidden on desktop since floating image is used */}
                  <div className="w-full h-48 mt-6 rounded overflow-hidden md:hidden">
                    <img 
                      src={promise.img} 
                      alt={promise.title} 
                      className="w-full h-full object-cover" 
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
