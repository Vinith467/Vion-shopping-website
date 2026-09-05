import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const promises = [
  { title: "High-quality fabrics", desc: "Sourced from the finest mills across Italy, Japan, and the UK, ensuring exceptional drape and durability.", img: "/images/about/promise_1_fabrics.png?v=2" },
  { title: "Exceptional craftsmanship", desc: "Generations of tailoring expertise go into every stitch, combining traditional techniques with modern precision.", img: "/images/about/promise_2_craft.png?v=2" },
  { title: "Personalized fit", desc: "Measurements taken by our experts ensure a garment that drapes perfectly and moves with you.", img: "/images/about/promise_3_fit.png?v=2" },
  { title: "Thoughtful design", desc: "Timeless silhouettes elevated by meticulous attention to detail, creating a wardrobe that never goes out of style.", img: "/images/about/promise_4_design.png?v=2" },
  { title: "Reliable delivery", desc: "A streamlined process ensures your custom garments are crafted and delivered precisely when you need them.", img: "/images/about/promise_5_delivery.png?v=2" }, 
  { title: "Accessible pricing", desc: "By streamlining our supply chain and working directly with craftsmen, we eliminate the unnecessary luxury markup.", img: "/images/about/promise_6_pricing.png?v=2" },
];

export default function CorporateQualityAndVision() {
  const containerRef = useRef(null);
  const leftImagesRef = useRef([]);
  const rightTextsRef = useRef([]);
  const mobileImagesRef = useRef([]);
  const mobileTextsRef = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let ctx = gsap.context(() => {
      
      // Desktop: use leftImagesRef and rightTextsRef
      mm.add("(min-width: 1024px)", () => {
        if (leftImagesRef.current[0]) {
          gsap.set(leftImagesRef.current[0], { autoAlpha: 1 });
        }
        
        rightTextsRef.current.forEach((text, i) => {
          const updateImages = (activeIndex) => {
            leftImagesRef.current.forEach((img, index) => {
              if (index === activeIndex) {
                gsap.to(img, { autoAlpha: 1, duration: 0.5, overwrite: "auto" });
              } else {
                gsap.to(img, { autoAlpha: 0, duration: 0.5, overwrite: "auto" });
              }
            });
          };

          ScrollTrigger.create({
            trigger: text,
            start: "top 65%",
            end: "bottom 35%",
            onEnter: () => {
              updateImages(i);
              gsap.to(text, { opacity: 1, x: 20, duration: 0.5, overwrite: "auto" });
            },
            onEnterBack: () => {
              updateImages(i);
              gsap.to(text, { opacity: 1, x: 20, duration: 0.5, overwrite: "auto" });
            },
            onLeave: () => {
              gsap.to(text, { opacity: 0.2, x: 0, duration: 0.5, overwrite: "auto" });
            },
            onLeaveBack: () => {
              gsap.to(text, { opacity: 0.2, x: 0, duration: 0.5, overwrite: "auto" });
            }
          });
        });
      });

      // Mobile: use mobileImagesRef and mobileTextsRef
      mm.add("(max-width: 1023px)", () => {
        if (mobileImagesRef.current[0]) {
          gsap.set(mobileImagesRef.current[0], { autoAlpha: 1 });
        }
        
        mobileTextsRef.current.forEach((text, i) => {
          const updateImages = (activeIndex) => {
            mobileImagesRef.current.forEach((img, index) => {
              if (index === activeIndex) {
                gsap.to(img, { autoAlpha: 1, duration: 0.5, overwrite: "auto" });
              } else {
                gsap.to(img, { autoAlpha: 0, duration: 0.5, overwrite: "auto" });
              }
            });
          };

          ScrollTrigger.create({
            trigger: text,
            start: "top 70%",
            end: "bottom 30%",
            onEnter: () => {
              updateImages(i);
              gsap.to(text, { opacity: 1, duration: 0.5, overwrite: "auto" });
            },
            onEnterBack: () => {
              updateImages(i);
              gsap.to(text, { opacity: 1, duration: 0.5, overwrite: "auto" });
            },
            onLeave: () => {
              gsap.to(text, { opacity: 0.2, duration: 0.5, overwrite: "auto" });
            },
            onLeaveBack: () => {
              gsap.to(text, { opacity: 0.2, duration: 0.5, overwrite: "auto" });
            }
          });
        });
      });

    }, containerRef);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const addImageRef = (el) => {
    if (el && !leftImagesRef.current.includes(el)) {
      leftImagesRef.current.push(el);
    }
  };

  const addTextRef = (el) => {
    if (el && !rightTextsRef.current.includes(el)) {
      rightTextsRef.current.push(el);
    }
  };

  const addMobileImageRef = (el) => {
    if (el && !mobileImagesRef.current.includes(el)) {
      mobileImagesRef.current.push(el);
    }
  };

  const addMobileTextRef = (el) => {
    if (el && !mobileTextsRef.current.includes(el)) {
      mobileTextsRef.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className="py-24 bg-[#F5F0E8] dark:bg-[#151515] transition-colors duration-500 text-[#151515] dark:text-[#F5F0E8] relative">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        {/* Massive Image Banner */}
        <div className="w-full h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden mb-16 relative shadow-2xl">
          <img 
            src="/images/about/craft_03_details_1787726445718.jpg" 
            alt="Craftsmanship Details" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-[#F5F0E8] text-center px-4 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Quality Without The<br/>Unnecessary Price
            </h2>
          </div>
        </div>

        {/* Intro Paragraphs */}
        <div className="max-w-3xl mx-auto text-center space-y-6 text-lg md:text-xl text-[#151515]/80 dark:text-[#F5F0E8]/80 font-sans font-light leading-relaxed">
          <p>
            We want people and organizations to experience high-quality fabrics, excellent craftsmanship and thoughtful design without paying an unnecessarily high price.
          </p>
          <p>
            By combining our manufacturing capabilities, experienced partners, technology and direct customer approach, we aim to bring a level of quality that is often associated with premium and luxury tailoring at a much more accessible price point.
          </p>
        </div>
      </div>

      {/* Sticky Image Switcher Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        
        {/* Desktop Layout: side by side */}
        <div className="hidden lg:flex gap-16 relative">
          {/* Sticky Image Container (Left on Desktop) */}
          <div className="w-1/2 relative z-0">
            <div className="sticky top-[10vh] w-full h-[80vh] rounded-2xl overflow-hidden shadow-2xl">
              {promises.map((promise, index) => (
                <div 
                  key={index} 
                  ref={addImageRef}
                  className="absolute inset-0 w-full h-full invisible opacity-0"
                >
                  <img 
                    src={promise.img} 
                    alt={promise.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Scrolling Promise List */}
          <div className="w-1/2 flex flex-col py-[40vh] z-10 items-start text-left">
            {promises.map((promise, index) => (
              <div 
                key={index} 
                ref={addTextRef}
                className="mb-[60vh] opacity-20 transition-all duration-500 ease-out last:mb-[20vh] flex flex-col items-start"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-serif text-[#C49A5C]/80 font-light italic">
                    0{index + 1}
                  </span>
                  <h3 className="text-5xl font-serif uppercase tracking-widest text-[#151515] dark:text-[#F5F0E8]">
                    {promise.title}
                  </h3>
                </div>
                <div className="w-12 h-[1px] bg-[#C49A5C] mb-6"></div>
                <p className="text-xl font-sans font-light text-[#151515]/70 dark:text-[#F5F0E8]/70 leading-relaxed max-w-md">
                  {promise.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout: image sticky inside a single parent wrapper */}
        <div className="lg:hidden relative">
          {/* Sticky image centered in viewport - 1:1 square */}
          <div className="sticky top-[calc(50vh-42.5vw)] z-0 w-[85vw] h-[85vw] mx-auto rounded-2xl overflow-hidden shadow-2xl mb-8">
            {promises.map((promise, index) => (
              <div 
                key={`mobile-img-${index}`} 
                ref={addMobileImageRef}
                className="absolute inset-0 w-full h-full invisible opacity-0"
              >
                <img 
                  src={promise.img} 
                  alt={promise.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            ))}
          </div>

          {/* Scrolling Promise List */}
          <div className="flex flex-col pt-[25vh] z-10 items-center text-center relative">
            {promises.map((promise, index) => (
              <div 
                key={`mobile-text-${index}`} 
                ref={addMobileTextRef}
                className="mb-[45vh] opacity-20 transition-all duration-500 ease-out last:mb-[20vh] flex flex-col items-center bg-[#F5F0E8]/90 dark:bg-[#151515]/90 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xl font-serif text-[#C49A5C]/80 font-light italic">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif uppercase tracking-widest text-[#151515] dark:text-[#F5F0E8]">
                    {promise.title}
                  </h3>
                </div>
                <div className="w-12 h-[1px] bg-[#C49A5C] mb-6"></div>
                <p className="text-base font-sans font-light text-[#151515]/70 dark:text-[#F5F0E8]/70 leading-relaxed max-w-md">
                  {promise.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
