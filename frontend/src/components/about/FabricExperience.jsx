import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const fabrics = [
  { name: 'WOOL', subtitle: 'Structure', img: '/corporate_fabric_wool_1787744950103.jpg' },
  { name: 'LINEN', subtitle: 'Breathability', img: '/craft_03_details_1787726445718.jpg' },
  { name: 'COTTON', subtitle: 'Crispness', img: '/craft_01_macro_1787726302160.jpg' } // Reusing placeholders for now
];

export default function FabricExperience() {
  const containerRef = useRef(null);
  const panelsRef = useRef([]);
  const bgImagesRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Animate panels in
      gsap.from(panelsRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (index) => {
    // Dim others
    panelsRef.current.forEach((panel, i) => {
      if (i !== index) {
        gsap.to(panel, { filter: "brightness(0.3) grayscale(50%)", scale: 0.98, duration: 0.4, ease: "power2.out" });
      }
    });
    
    // Highlight hovered
    gsap.to(panelsRef.current[index], { scale: 1.02, zIndex: 10, duration: 0.4, ease: "power2.out" });
    gsap.to(bgImagesRef.current[index], { scale: 1.1, duration: 4, ease: "power1.out" });
  };

  const handleMouseLeave = (index) => {
    // Reset all
    panelsRef.current.forEach((panel) => {
      gsap.to(panel, { filter: "brightness(1) grayscale(0%)", scale: 1, zIndex: 1, duration: 0.4, ease: "power2.out" });
    });
    gsap.to(bgImagesRef.current[index], { scale: 1, duration: 1, ease: "power2.out" });
  };

  return (
    <section ref={containerRef} className="min-h-screen w-full bg-[#F5F0E8] py-24 px-4 md:px-12 flex flex-col justify-center">
      
      <div className="text-center mb-16 text-[#151515]">
        <h2 className="text-sm tracking-[0.3em] uppercase font-bold text-[#C49A5C] mb-4">The Materials</h2>
        <h3 className="text-4xl md:text-6xl font-serif uppercase tracking-widest">Tactile Perfection</h3>
      </div>

      <div className="flex flex-col md:flex-row h-[60vh] gap-4 md:gap-8 w-full max-w-7xl mx-auto">
        {fabrics.map((fabric, i) => (
          <div 
            key={i}
            ref={el => panelsRef.current[i] = el}
            className="relative flex-1 h-full overflow-hidden cursor-pointer group"
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={() => handleMouseLeave(i)}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-[#151515]">
              <img 
                ref={el => bgImagesRef.current[i] = el}
                src={fabric.img} 
                alt={fabric.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/90 via-[#151515]/20 to-transparent"></div>
            </div>

            {/* Typography */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-[#F5F0E8]">
              <div className="overflow-hidden">
                <h4 className="text-3xl md:text-5xl font-serif uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {fabric.name}
                </h4>
              </div>
              <div className="w-12 h-px bg-[#C49A5C] my-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
              <div className="overflow-hidden">
                <p className="text-sm font-sans tracking-[0.2em] uppercase text-[#F5F0E8]/70 translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {fabric.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
