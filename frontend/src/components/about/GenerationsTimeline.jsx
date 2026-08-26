import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function GenerationsTimeline() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const cardRef = useRef(null);
  const textElementsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%", // Pin for 1 screen height
          pin: true,
          scrub: 1,
        }
      });

      // Initial state
      gsap.set(imageRef.current, { scale: 1.3, filter: "grayscale(100%) brightness(0.5)" });
      gsap.set(cardRef.current, { x: "100%", opacity: 0 });

      // Animation
      tl.to(imageRef.current, {
        scale: 1,
        filter: "grayscale(0%) brightness(1)",
        duration: 1,
        ease: "power2.out"
      }, 0)
      .to(cardRef.current, {
        x: "0%",
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, 0.2);

      // Stagger text elements inside the card
      textElementsRef.current.forEach((el, i) => {
        tl.fromTo(el, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          0.5 + (i * 0.1)
        );
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !textElementsRef.current.includes(el)) {
      textElementsRef.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#151515] overflow-hidden">
      
      {/* Background Image that reveals and colors up */}
      <div className="absolute inset-0 z-0">
        <img 
          ref={imageRef}
          src="/images/about/vion_heritage_chalk.jpg" 
          alt="Master Tailor Chalking Fabric" 
          className="w-full h-full object-cover origin-center"
        />
      </div>

      {/* Glassmorphism Content Card sliding from right */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[55%] lg:w-[45%] z-10 flex items-center p-6 md:p-12">
        <div 
          ref={cardRef}
          data-lenis-prevent="true"
          className="w-full h-auto max-h-[85vh] overflow-y-auto bg-[#151515]/80 backdrop-blur-xl border border-[#F5F0E8]/10 p-8 md:p-12 shadow-2xl custom-scrollbar"
        >
          <h2 
            ref={addToRefs}
            className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight text-[#C49A5C]" 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Three Generations of Craft.<br/>One Vision for the Future.
          </h2>
          
          <div className="space-y-6 text-sm md:text-base text-[#F5F0E8]/90 font-sans font-light leading-relaxed">
            <p ref={addToRefs}>
              VION Corporate is built on three generations of experience in the clothing and tailoring business. For decades, our family has worked with fabrics, tailoring, fit and craftsmanship, developing an understanding of what makes clothing not only look exceptional, but feel exceptional.
            </p>
            <p ref={addToRefs} className="font-medium text-[#F5F0E8]">
              Today, the youngest generation is carrying that heritage forward.
            </p>
            <p ref={addToRefs}>
              We are combining the knowledge and craftsmanship passed down through generations with modern technology, contemporary design and a customer-first approach to create a completely different experience for professional attire and institutional clothing.
            </p>
            <p ref={addToRefs}>
              Our ambition is to take this experience across India and build VION into a trusted Pan-India partner for corporates, universities, colleges, institutes and organizations.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
