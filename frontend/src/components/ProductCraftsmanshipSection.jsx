import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const defaultFeatures = [
  { 
    title: "The Fabric", 
    desc: "Sourced from the finest mills across Italy, Japan, and the UK. Our premium fabrics are selected for their exceptional drape, breathability, and enduring quality, ensuring a garment that feels as luxurious as it looks.", 
    img: "/images/about/promise_1_fabrics.png" 
  },
  { 
    title: "Master Tailoring", 
    desc: "Generations of tailoring expertise go into every stitch. We combine time-honored traditional techniques with modern precision to craft a silhouette that perfectly contours the body while allowing effortless movement.", 
    img: "/images/about/promise_2_craft.png" 
  },
  { 
    title: "Meticulous Details", 
    desc: "From hand-finished buttonholes to perfectly aligned patterns, our uncompromising attention to detail elevates this piece from a simple garment to a true work of sartorial art.", 
    img: "/images/about/craft_03_details_1787726445718.jpg" 
  }
];

export default function ProductCraftsmanshipSection({ features = defaultFeatures }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // Create a stacking effect exactly like CorporateGlobalCraftsmanship
      cardsRef.current.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top " + (40 + index * 40) + "px", // Pinned higher up, standard 40px overlap
          endTrigger: containerRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, [features]);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  if (!features || features.length === 0) return null;

  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-[#0A0A0A]">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Sticky Intro Text (Just like Corporate) */}
        <div className="w-full lg:w-1/3 relative z-10">
          <div className="lg:sticky lg:top-32">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Art of<br/>Craftsmanship
            </h2>
            <div className="space-y-6 text-sm md:text-base text-[#F5F0E8]/80 font-sans font-light leading-relaxed">
              <p>
                Discover the dedication, premium materials, and meticulous techniques that make this piece truly exceptional.
              </p>
              <p className="font-medium text-[#C49A5C]">
                Quality in every detail.
              </p>
              <p>
                What truly makes a garment exceptional is the craftsmanship, precision and attention to detail that transforms the material into something extraordinary.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Stacking Cards (Just like Corporate) */}
        <div className="w-full lg:w-2/3 flex flex-col pt-12 lg:pt-0 relative z-20 pb-[50vh]">
          {features.map((feature, i) => (
            <div 
              key={i} 
              ref={addToRefs}
              className="w-full bg-[#151515] text-[#F5F0E8] rounded-xl overflow-hidden shadow-2xl mb-12 origin-top flex flex-col"
              style={{ zIndex: i + 1 }}
            >
              <div className="w-full h-[40vh] overflow-hidden relative">
                <img src={feature.img} alt={feature.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent"></div>
              </div>
              <div className="p-8 md:p-12 relative -mt-16 z-10">
                <h3 className="text-2xl md:text-3xl font-serif uppercase tracking-widest mb-4 text-[#C49A5C]">{feature.title}</h3>
                <div className="w-12 h-[1px] bg-[#C49A5C] mb-6"></div>
                <p className="font-sans font-light text-sm md:text-base leading-relaxed text-[#F5F0E8]/80 max-w-xl">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
