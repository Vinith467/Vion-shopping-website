import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function QualityAndVision() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray('.fade-up').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* QUALITY WITHOUT THE UNNECESSARY PRICE */}
      <section className="py-24 bg-[#F5F0E8] text-[#151515]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="fade-up text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Quality Without the<br/>Unnecessary Price
            </h2>
            <div className="fade-up space-y-6 text-sm md:text-base text-[#151515]/80 font-sans font-light leading-relaxed mb-8">
              <p>
                We want people and organizations to experience high-quality fabrics, excellent craftsmanship and thoughtful design without paying an unnecessarily high price.
              </p>
              <p>
                By combining our manufacturing capabilities, experienced partners, technology and direct customer approach, we aim to bring a level of quality that is often associated with premium and luxury tailoring at a much more accessible price point.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="fade-up bg-[#151515] text-[#F5F0E8] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C49A5C]/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
              <h3 className="text-xl font-serif uppercase tracking-widest text-[#C49A5C] mb-6 border-b border-[#F5F0E8]/10 pb-4">Our Promise</h3>
              <ul className="space-y-4 font-sans font-light tracking-wide">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#C49A5C] rounded-full"></span> High-quality fabrics.</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#C49A5C] rounded-full"></span> Exceptional craftsmanship.</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#C49A5C] rounded-full"></span> Personalized fit.</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#C49A5C] rounded-full"></span> Thoughtful design.</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#C49A5C] rounded-full"></span> Reliable delivery.</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#C49A5C] rounded-full"></span> Accessible pricing.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VISION */}
      <section className="py-32 bg-[#151515] text-[#F5F0E8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <img src="/images/about/craft_02_hero_1787726332878.jpg" alt="Vision Background" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="fade-up text-sm tracking-[0.3em] uppercase font-bold text-[#C49A5C] mb-8">Our Vision</h2>
          
          <div className="fade-up space-y-8 text-lg md:text-xl text-[#F5F0E8] font-serif leading-relaxed mb-16">
            <p>
              Our vision is to build VION into a Pan-India platform for personalized professional attire and institutional clothing.
            </p>
            <p className="font-light text-[#F5F0E8]/80">
              For corporates, we create professional attire and formalwear that gives people the freedom to choose what works for them while maintaining a strong organizational identity.
            </p>
            <p className="font-light text-[#F5F0E8]/80">
              For universities, colleges and institutions, we design and deliver uniforms and institutional attire that create identity, belonging and pride.
            </p>
            <p>
              We want to bring together global fabrics, international craftsmanship, Indian artistry, modern technology and generations of experience into one seamless VION experience.
            </p>
          </div>

          <div className="fade-up inline-block text-left border-l-2 border-[#C49A5C] pl-6">
            <p className="tracking-widest uppercase text-sm md:text-base font-bold mb-3">Three generations behind us.</p>
            <p className="tracking-widest uppercase text-sm md:text-base font-bold mb-3">A world of craftsmanship around us.</p>
            <p className="tracking-widest uppercase text-sm md:text-base font-bold mb-6">Technology taking us forward.</p>
            <p className="tracking-widest uppercase text-xl md:text-2xl font-bold text-[#C49A5C]">One vision ahead — VION.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
