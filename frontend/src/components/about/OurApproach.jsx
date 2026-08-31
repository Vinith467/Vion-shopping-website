import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function OurApproach() {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {

      // Parallax for detail image
      gsap.to(image2Ref.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: image2Ref.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Stagger fade up the 6 words
      wordsRef.current.forEach((word, i) => {
        gsap.fromTo(word, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: word,
              start: "top 85%",
            }
          }
        );
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const coreWords = ["Fit", "Fabric", "Design", "Comfort", "Detail", "You"];

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-[#1A1A1A] text-white overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Intro Text */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-32">
          <h3 className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.25em] text-[#E5CDA7] mb-6">Attire Designed Around Your Team</h3>
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-8 leading-tight text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            We don't believe corporate attire should simply be about following standard templates.
          </h2>
          <div className="space-y-6 text-[16px] md:text-[18px] text-white/80 font-light leading-relaxed max-w-3xl mx-auto">
            <p>
              We believe clothing should help you express your personality, your confidence and your individuality.
            </p>
            <p>
              That's why our collections are designed around the things that matter:
            </p>
          </div>
        </div>

        {/* Layout: Image left, Words right */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-20 md:mb-32">
          
          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-2xl relative">
            <img src="/New folder/10.png" alt="Express your personality" className="w-full h-auto object-contain bg-[#111]" />
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center items-start lg:pl-12">
            <div className="flex flex-col space-y-4 md:space-y-8">
              {coreWords.map((word, idx) => (
                <div 
                  key={idx}
                  ref={el => wordsRef.current[idx] = el}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#E5CDA7] tracking-wider uppercase" 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Layout: Text left, Image right */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="bg-[#111] p-10 md:p-16 rounded-2xl border border-white/5 shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>The Freedom to Discover</h3>
              <div className="w-12 h-[1px] bg-[#E5CDA7] mb-8"></div>
              <p className="text-[16px] text-white/80 font-light leading-relaxed">
                Whether you are looking for sophisticated formalwear, contemporary essentials or something distinctive for a special occasion, VION gives you the freedom to discover clothing that works for you.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 h-[50vh] md:h-[70vh] overflow-hidden rounded-2xl shadow-2xl relative">
            <div ref={image2Ref} className="absolute inset-0 w-full h-[115%]">
              <img src="/New folder/11.png" alt="Fit and Fabric Details" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

        </div>

      </div>
    </section>
  );
}
