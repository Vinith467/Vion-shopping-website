import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeroSection() {
  const heroRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const threadRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
        }
      });

      // 1. Thread animation
      tl.to(threadRef.current, { width: "100%", duration: 1, ease: "power2.inOut" })
        .to(threadRef.current, { opacity: 0, duration: 0.5 }, ">-0.2");

      // 2. Background reveal
      tl.to(bgRef.current, { opacity: 0.5, scale: 1.05, duration: 2 }, 0);

      // 3. Text reveals
      tl.fromTo(text1Ref.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
        0.5
      );
      
      // "GENERATIONS" letter by letter
      tl.fromTo(text2Ref.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        0.8
      );

      // "ONE VISION" scale up
      tl.fromTo(text3Ref.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" },
        1.2
      );

      // 4. Fade out everything as we scroll past
      tl.to([text1Ref.current, text2Ref.current, text3Ref.current, bgRef.current], {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power2.in"
      }, "+=0.5");

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Split "GENERATIONS" into spans
  const generationsLetters = "GENERATIONS".split('').map((letter, i) => (
    <span key={i} className="inline-block">{letter}</span>
  ));

  return (
    <section ref={heroRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#151515]">
      {/* Background Cinematic Images Sequence */}
      <div className="absolute inset-0 z-0">
        <img 
          ref={bgRef}
          src="/corporate_hero_tailor_hands_1787744904933.jpg" 
          alt="Master Tailor" 
          className="w-full h-full object-cover opacity-0 origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#151515] via-[#151515]/60 to-[#151515]"></div>
      </div>
      
      {/* Thread */}
      <div className="absolute top-1/3 left-0 w-full h-[1px] flex justify-center z-10 opacity-70">
        <div ref={threadRef} className="h-full bg-gradient-to-r from-transparent via-[#C49A5C] to-transparent w-0"></div>
      </div>

      {/* Typography */}
      <div className="relative z-20 flex flex-col items-center text-center text-[#F5F0E8] w-full max-w-5xl px-4">
        <div className="overflow-hidden mb-2">
          <h1 ref={text1Ref} className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-[0.2em] uppercase leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Three
          </h1>
        </div>
        
        <div className="overflow-hidden mb-6">
          <h1 ref={text2Ref} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.2em] uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#C49A5C] to-[#8B6544]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {generationsLetters}
          </h1>
        </div>
        
        <div className="w-px h-16 bg-[#F5F0E8]/30 mb-8 mt-4"></div>
        
        <h2 ref={text3Ref} className="text-2xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          One Vision.
        </h2>
        
        <p className="mt-12 text-[10px] md:text-xs font-sans tracking-[0.3em] uppercase text-[#F5F0E8]/60 max-w-md">
          Craftsmanship passed down.<br/><span className="mt-2 block">Technology taking it forward.</span>
        </p>
      </div>
    </section>
  );
}
