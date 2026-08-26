import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function GenerationsTimeline() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(textRef.current.children, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out"
      });

      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 w-full bg-[#F5F0E8] text-[#151515]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left side: Image */}
        <div className="w-full md:w-1/2 relative">
          <div ref={imageRef} className="aspect-[4/5] w-full overflow-hidden shadow-2xl">
            <img 
              src="/images/about/craft_03_artisans_1787726458130.jpg" 
              alt="Three Generations of Craft" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#151515] -z-10 hidden md:block"></div>
        </div>

        {/* Right side: Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div ref={textRef}>
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight text-[#151515]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Three Generations of Craft.<br/>One Vision for the Future.
            </h2>
            
            <div className="space-y-6 text-sm md:text-base text-[#151515]/80 font-sans font-light leading-relaxed">
              <p>
                VION Corporate is built on three generations of experience in the clothing and tailoring business. For decades, our family has worked with fabrics, tailoring, fit and craftsmanship, developing an understanding of what makes clothing not only look exceptional, but feel exceptional.
              </p>
              <p className="font-medium text-[#151515]">
                Today, the youngest generation is carrying that heritage forward.
              </p>
              <p>
                We are combining the knowledge and craftsmanship passed down through generations with modern technology, contemporary design and a customer-first approach to create a completely different experience for professional attire and institutional clothing.
              </p>
              <p>
                Our ambition is to take this experience across India and build VION into a trusted Pan-India partner for corporates, universities, colleges, institutes and organizations.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
