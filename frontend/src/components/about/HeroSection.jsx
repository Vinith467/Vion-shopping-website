import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeroSection() {
  const containerRef = useRef(null);
  const heroImageRef = useRef(null);
  const introTextRef = useRef(null);
  const storyGridRef = useRef(null);
  const textBlocksRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Image Parallax & Fade
      gsap.to(heroImageRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // 2. Intro Text Fade Out
      gsap.to(introTextRef.current, {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "30% top",
          scrub: true
        }
      });

      // 3. Staggered reveal for story text blocks
      textBlocksRef.current.forEach((block, i) => {
        gsap.fromTo(block, 
          { opacity: 0, y: 50 },
          {
            opacity: 1, 
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // 4. Reveal for images in the story grid
      gsap.utils.toArray('.story-image').forEach((img, i) => {
        gsap.fromTo(img,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", scale: 1.1 },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            scale: 1,
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: img,
              start: "top 80%",
            }
          }
        );
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 text-[#1A1A1A] dark:text-[#F5F0E8] overflow-hidden">
      
      {/* 1. Immersive Hero Screen */}
      <div className="relative h-screen w-full overflow-hidden">
        <div 
          ref={heroImageRef}
          className="absolute inset-0 w-full h-[120%]"
        >
          <img 
            src="/New folder/1.png" 
            alt="VION Fashion Heritage" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div 
          ref={introTextRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
        >
          <h3 className="text-[#E5CDA7] text-[11px] md:text-sm tracking-[0.3em] uppercase font-bold mb-6">About VION Corporate</h3>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase text-white leading-tight max-w-4xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Three Generations.<br/>One Craft.<br/>A New Vision.
          </h1>
          <div className="mt-16 animate-bounce">
            <p className="text-white/70 text-[10px] tracking-widest uppercase mb-3">Scroll to explore</p>
            <div className="w-[1px] h-16 bg-[#E5CDA7] mx-auto"></div>
          </div>
        </div>
      </div>

      {/* 2. The Narrative Section */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 relative z-30">
        
        {/* Intro Paragraph */}
        <div 
          ref={el => textBlocksRef.current[0] = el}
          className="max-w-3xl mx-auto text-center mb-24 md:mb-32"
        >
          <p className="text-xl md:text-3xl leading-relaxed text-[#333] dark:text-gray-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            VION Corporate is built on three generations of experience in the clothing and tailoring business. What began as a family-led craft has grown through decades of understanding fabrics, fit, tailoring and craftsmanship — developing an appreciation for what makes clothing not only look exceptional, but feel exceptional.
          </p>
        </div>

        {/* Grid Layout for Story & Images */}
        <div ref={storyGridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24 md:mb-32">
          
          <div 
            ref={el => textBlocksRef.current[1] = el}
            className="order-2 lg:order-1"
          >
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#A87B45] mb-6">A New Approach</h3>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-[#111] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Combining tradition with technology.
            </h2>
            <div className="space-y-6 text-[15px] leading-relaxed text-[#555] font-light">
              <p>
                Today, the youngest generation is carrying that experience forward with a new approach.
              </p>
              <p>
                We are combining generations of craftsmanship with modern technology, contemporary design and a more convenient shopping experience to create clothing made for the way people live, work and express themselves today.
              </p>
              <p>
                VION Corporate brings the world of premium tailoring and thoughtful design directly to organizations — allowing you to source, customize, and deliver premium uniforms and professional attire for your teams.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 w-full h-[60vh] lg:h-[80vh] overflow-hidden rounded-2xl story-image shadow-2xl">
            <img src="/New folder/2.png" alt="Modern Craftsmanship" className="w-full h-full object-cover" />
          </div>

        </div>

        {/* Second Grid Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="w-full h-[60vh] lg:h-[80vh] overflow-hidden rounded-2xl story-image shadow-2xl">
            <img src="/New folder/3.png" alt="Global Perspective" className="w-full h-full object-cover" />
          </div>

          <div 
            ref={el => textBlocksRef.current[2] = el}
          >
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#A87B45] mb-6">Our Ambition</h3>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-[#111] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              A modern Indian corporate clothing partner with a global perspective.
            </h2>
            <div className="space-y-6 text-[15px] leading-relaxed text-[#555] font-light">
              <p>
                Our ambition is simple. To build VION into a place where customers can discover beautifully designed clothing, explore quality fabrics, find the right fit and create a wardrobe that reflects who they are.
              </p>
              <p>
                From everyday essentials to sophisticated formalwear, every VION garment is created with a focus on quality, fit, design and craftsmanship.
              </p>
              
              <div className="pt-8 mt-8 border-t border-[#111]/10">
                <ul className="space-y-4">
                  <li className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A87B45]"></div>
                    <span className="text-[13px] tracking-widest uppercase font-semibold text-[#111] dark:text-[#F5F0E8]">Generations of craftsmanship.</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A87B45]"></div>
                    <span className="text-[13px] tracking-widest uppercase font-semibold text-[#111] dark:text-[#F5F0E8]">Technology for tomorrow.</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A87B45]"></div>
                    <span className="text-[13px] tracking-widest uppercase font-semibold text-[#111] dark:text-[#F5F0E8]">Attire made for your team.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
