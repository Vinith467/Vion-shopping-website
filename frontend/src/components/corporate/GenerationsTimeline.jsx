import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function GenerationsTimeline() {
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const fabricMaskRef = useRef(null);
  const textsRef = useRef([]);
  const numbersRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Pin the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%", // 3 sections
          pin: true,
          scrub: 1,
        }
      });

      // We have 3 generations. Start at index 0 visible.
      // Transition 0 -> 1
      tl.to(fabricMaskRef.current, { x: "0%", duration: 1, ease: "power2.inOut" }) // Fabric covers
        .set(imagesRef.current[0], { opacity: 0 })
        .set(imagesRef.current[1], { opacity: 1 })
        .to(textsRef.current[0], { y: -50, opacity: 0, duration: 0.5 }, "<")
        .to(textsRef.current[1], { y: 0, opacity: 1, duration: 0.5 }, ">")
        .to(numbersRef.current, { y: "-33.33%", duration: 0.5 }, "<") // Slide number up
        .to(fabricMaskRef.current, { x: "100%", duration: 1, ease: "power2.inOut" }) // Fabric leaves
        
      // Transition 1 -> 2
        .set(fabricMaskRef.current, { x: "-100%" }) // Reset fabric position for next wipe
        .to(fabricMaskRef.current, { x: "0%", duration: 1, ease: "power2.inOut" })
        .set(imagesRef.current[1], { opacity: 0 })
        .set(imagesRef.current[2], { opacity: 1 })
        .to(textsRef.current[1], { y: -50, opacity: 0, duration: 0.5 }, "<")
        .to(textsRef.current[2], { y: 0, opacity: 1, duration: 0.5 }, ">")
        .to(numbersRef.current, { y: "-66.66%", duration: 0.5 }, "<")
        .to(fabricMaskRef.current, { x: "100%", duration: 1, ease: "power2.inOut" });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#151515] overflow-hidden flex items-center">
      
      {/* Left side - Typography */}
      <div className="w-1/2 h-full flex flex-col justify-center px-12 md:px-24 relative z-10">
        <h3 className="text-[#C49A5C] text-[10px] tracking-[0.2em] uppercase font-bold mb-8">Our Heritage</h3>
        
        {/* Animated Number Scroller */}
        <div className="h-[120px] md:h-[180px] overflow-hidden mb-8 relative">
          <div ref={numbersRef} className="flex flex-col text-[120px] md:text-[180px] leading-[1] font-serif text-[#F5F0E8] opacity-20">
            <div>01</div>
            <div>02</div>
            <div>03</div>
          </div>
        </div>

        {/* Text Sections */}
        <div className="relative h-[200px]">
          {/* Gen 1 */}
          <div ref={el => textsRef.current[0] = el} className="absolute top-0 left-0 w-full opacity-100">
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F0E8] mb-4">The Foundation</h2>
            <p className="text-sm md:text-base text-[#F5F0E8]/70 font-sans font-light max-w-sm">
              What began as a family-led craft built on a profound understanding of fabrics, fit, and timeless tailoring. Old-world precision that set the standard.
            </p>
          </div>
          
          {/* Gen 2 */}
          <div ref={el => textsRef.current[1] = el} className="absolute top-0 left-0 w-full opacity-0 translate-y-12">
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F0E8] mb-4">The Craft</h2>
            <p className="text-sm md:text-base text-[#F5F0E8]/70 font-sans font-light max-w-sm">
              Decades of mastery. Elevating our expertise in sourcing the finest fabrics, perfecting the silhouette, and refining manufacturing to an art form.
            </p>
          </div>

          {/* Gen 3 */}
          <div ref={el => textsRef.current[2] = el} className="absolute top-0 left-0 w-full opacity-0 translate-y-12">
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F0E8] mb-4">The New Vision</h2>
            <p className="text-sm md:text-base text-[#F5F0E8]/70 font-sans font-light max-w-sm">
              The youngest generation carries the heritage forward. Merging generations of bespoke tailoring with modern technology, creating a seamless customer experience.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Images with Fabric Wipe */}
      <div className="w-1/2 h-full relative overflow-hidden">
        
        {/* Images */}
        <img ref={el => imagesRef.current[0] = el} src="/craft_02_hero_1787726332878.jpg" alt="Generation 1" className="absolute inset-0 w-full h-full object-cover" />
        <img ref={el => imagesRef.current[1] = el} src="/craft_03_cutting_1787726412577.jpg" alt="Generation 2" className="absolute inset-0 w-full h-full object-cover opacity-0" />
        <img ref={el => imagesRef.current[2] = el} src="/craft_04_male_fitting_1787726621418.jpg" alt="Generation 3" className="absolute inset-0 w-full h-full object-cover opacity-0" />

        {/* Fabric Mask (The Wipe) */}
        <div 
          ref={fabricMaskRef} 
          className="absolute inset-0 w-full h-full -translate-x-full z-20"
          style={{
            backgroundImage: "url('/corporate_fabric_wool_1787744950103.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Edge shadow to make it look like fabric sliding */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/50 to-transparent"></div>
        </div>
      </div>
      
    </section>
  );
}
