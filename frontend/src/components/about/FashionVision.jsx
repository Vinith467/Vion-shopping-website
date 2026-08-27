import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function FashionVision() {
  const containerRef = useRef(null);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const listRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // Subtle parallax for top image
      gsap.to(image1Ref.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: image1Ref.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Massive parallax for the finale background image
      gsap.to(image2Ref.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: image2Ref.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Stagger fade-in for the list
      gsap.fromTo(listRef.current, 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: listRef.current[0],
            start: "top 85%",
          }
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const elements = [
    "Global fabrics.",
    "International influences.",
    "Indian craftsmanship.",
    "Modern technology.",
    "Three generations of experience.",
    "And most importantly —",
    "You."
  ];

  return (
    <section ref={containerRef} className="bg-[#111] text-[#F5F0E8] overflow-hidden relative">
      
      {/* Top Section: Vision & List */}
      <div className="py-24 md:py-32 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="w-full h-[60vh] md:h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative">
            <div ref={image1Ref} className="absolute -top-[15%] left-0 w-full h-[130%]">
              <img src="/New folder/22.png" alt="Our Vision" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
          </div>

          <div className="flex flex-col justify-center lg:pl-8">
            <h3 className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.25em] text-[#C49A5C] mb-6">Our Vision</h3>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90 mb-12">
              Our vision is to build VION into a modern fashion brand that brings exceptional clothing to people across India and eventually around the world.
            </p>
            
            <p className="text-[13px] md:text-[15px] font-bold uppercase tracking-wider text-white/50 mb-8">
              We want to make quality fashion more accessible by bringing together:
            </p>

            <ul className="space-y-4 md:space-y-6">
              {elements.map((el, idx) => {
                const isYou = el === "You.";
                return (
                  <li 
                    key={idx}
                    ref={el => listRef.current[idx] = el}
                    className={`text-2xl md:text-4xl lg:text-5xl font-bold leading-none ${isYou ? 'text-[#C49A5C] mt-8' : 'text-white'}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {el}
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>

      {/* Finale Section: Epic Quote (Split Layout) */}
      <div className="py-24 md:py-32 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Framed Image */}
          <div className="w-full lg:w-1/2 h-[60vh] md:h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative">
            <div ref={image2Ref} className="absolute -top-[15%] left-0 w-full h-[130%]">
              <img src="/New folder/23.png" alt="Express Yourself" className="w-full h-full object-cover opacity-90" />
            </div>
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          </div>

          {/* Quote */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="w-16 h-[2px] bg-[#C49A5C] mb-10"></div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              "Because clothing is not just something you wear."
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-[#F5F0E8]/70 italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              It is how you present yourself, express yourself and feel about yourself.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
