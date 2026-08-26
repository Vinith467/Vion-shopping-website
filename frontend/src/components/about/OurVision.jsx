import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function OurVision() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const pillarsRef = useRef(null);
  const finaleRefs = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Intro fade in
      gsap.fromTo(introRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 80%",
          }
        }
      );

      // Pillars fade in
      gsap.fromTo(pillarsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top 75%",
          }
        }
      );

      // Finale lines reveal
      finaleRefs.current.forEach((line, index) => {
        gsap.fromTo(line,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
            }
          }
        );
      });

      // Background Parallax
      gsap.to(".vision-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const addToFinale = (el) => {
    if (el && !finaleRefs.current.includes(el)) {
      finaleRefs.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-[#151515] text-[#F5F0E8] overflow-hidden pt-32 pb-48">
      
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/images/about/vision_1_bg.png?v=2" 
          alt="Vion Vision" 
          className="vision-bg w-full h-[120%] object-cover opacity-20 -mt-[10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#151515] via-transparent to-[#151515]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center">
        
        {/* Intro Section */}
        <div ref={introRef} className="mb-32">
          <h3 className="text-[#C49A5C] font-mono text-sm tracking-widest uppercase mb-12">Our Vision</h3>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-tight">
            Our vision is to build VION into a <span className="italic text-[#C49A5C]">Pan-India platform</span> for personalized professional attire and institutional clothing.
          </h2>
        </div>

        {/* The Two Pillars */}
        <div ref={pillarsRef} className="flex flex-col md:flex-row gap-12 md:gap-24 text-left mb-32">
          <div className="flex-1 space-y-6">
            <h4 className="text-xl md:text-2xl font-serif uppercase tracking-widest text-[#C49A5C]">For Corporates</h4>
            <div className="w-12 h-[1px] bg-[#C49A5C]/50"></div>
            <p className="text-base md:text-lg font-sans font-light text-[#F5F0E8]/80 leading-relaxed">
              We create professional attire and formalwear that gives people the freedom to choose what works for them while maintaining a strong organizational identity.
            </p>
          </div>
          
          <div className="flex-1 space-y-6">
            <h4 className="text-xl md:text-2xl font-serif uppercase tracking-widest text-[#C49A5C]">For Institutions</h4>
            <div className="w-12 h-[1px] bg-[#C49A5C]/50"></div>
            <p className="text-base md:text-lg font-sans font-light text-[#F5F0E8]/80 leading-relaxed">
              For universities, colleges and institutions, we design and deliver uniforms and institutional attire that create identity, belonging and pride.
            </p>
          </div>
        </div>

        {/* Synthesis */}
        <div className="max-w-4xl mx-auto mb-40">
          <p className="text-xl md:text-3xl font-serif font-light text-[#F5F0E8] leading-relaxed">
            We want to bring together global fabrics, international craftsmanship, Indian artistry, modern technology and generations of experience into one <span className="text-[#C49A5C] italic">seamless VION experience.</span>
          </p>
        </div>

        {/* The Finale Mantra */}
        <div className="space-y-8 md:space-y-12">
          <h2 ref={addToFinale} className="text-3xl md:text-6xl lg:text-7xl font-serif font-bold uppercase tracking-tight text-[#F5F0E8]/40">
            Three generations behind us.
          </h2>
          <h2 ref={addToFinale} className="text-3xl md:text-6xl lg:text-7xl font-serif font-bold uppercase tracking-tight text-[#F5F0E8]/60">
            A world of craftsmanship around us.
          </h2>
          <h2 ref={addToFinale} className="text-3xl md:text-6xl lg:text-7xl font-serif font-bold uppercase tracking-tight text-[#F5F0E8]/80">
            Technology taking us forward.
          </h2>
          <div ref={addToFinale} className="pt-12">
            <h2 className="text-5xl md:text-8xl lg:text-[7rem] font-serif font-bold uppercase tracking-tighter text-[#C49A5C] leading-none mb-12">
              One vision ahead
            </h2>
            <div className="w-[1px] h-32 bg-[#C49A5C] mx-auto mb-12"></div>
            <img 
              src="/images/about/vision_2_future.png?v=2" 
              alt="Vion Future" 
              className="w-full max-w-2xl mx-auto h-[40vh] md:h-[60vh] object-cover rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 mb-12"
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <img 
                src="/images/about/logo.png" 
                alt="VION Logo" 
                className="w-48 md:w-64 lg:w-80 object-contain invert opacity-90"
              />
              <p className="text-[#C49A5C] font-mono tracking-[0.3em] uppercase text-sm md:text-base">
                Corporate
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
