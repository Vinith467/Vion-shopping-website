import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const collections = [
  { name: "Business Suits", img: "/New folder/cat_business.jpg" },
  { name: "Co-ord Set", img: "/New folder/cat_coord.jpg" },
  { name: "Regal", img: "/New folder/cat_regal.jpg" },
  { name: "Mini", img: "/New folder/cat_mini.jpg" },
  { name: "Casual Formal", img: "/New folder/cat_casual.jpg" },
  { name: "Pant & Shirt", img: "/New folder/cat_pantshirt.jpg" }
];

export default function CollectionsGallery() {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(itemsRef.current, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 1.2, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-[#151515] px-6 md:px-12 lg:px-20 relative z-10">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="flex flex-col items-center mb-16 md:mb-24">
          <div className="w-px h-16 bg-[#C49A5C] mb-8 opacity-50"></div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-white text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            The Collections
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {collections.map((item, idx) => (
            <div 
              key={idx} 
              ref={el => itemsRef.current[idx] = el}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer shadow-2xl"
            >
              {/* Image with slow zoom effect on hover */}
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Dark overlays for mood and text legibility */}
              <div className="absolute inset-0 bg-black/20 transition-opacity duration-700 group-hover:bg-black/0"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100"></div>
              
              {/* Animated Text Block */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 translate-y-4 transition-transform duration-700 group-hover:translate-y-0">
                <div className="w-8 h-[2px] bg-[#C49A5C] mb-5 transition-all duration-700 group-hover:w-16"></div>
                <h3 className="text-2xl md:text-3xl text-white font-medium tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
