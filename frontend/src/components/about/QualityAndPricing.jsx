import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function QualityAndPricing() {
  const containerRef = useRef(null);
  const promisesRef = useRef([]);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // Subtle parallax for top image
      gsap.to(image1Ref.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: image1Ref.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Subtle parallax for bottom image
      gsap.to(image2Ref.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: image2Ref.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Stagger fade-in for the promises list
      gsap.fromTo(promisesRef.current, 
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: promisesRef.current[0],
            start: "top 85%",
          }
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const promises = [
    "High-quality fabrics",
    "Exceptional craftsmanship",
    "Thoughtful design",
    "Personalized fit",
    "Modern style",
    "Reliable delivery",
    "Accessible pricing"
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 text-[#111] dark:text-[#F5F0E8] overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Top Section: Intro & Image 20 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24 md:mb-32">
          
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <h3 className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.25em] text-[#A87B45] mb-6">Quality & Value</h3>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-[#111] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Quality without the unnecessary price.
            </h2>
            <div className="space-y-6 text-[15px] md:text-[16px] text-[#555] font-light leading-relaxed">
              <p className="font-medium text-[#111] dark:text-[#F5F0E8]">
                Premium clothing should not always mean an unnecessarily high price.
              </p>
              <p>
                At VION, we want customers to experience high-quality fabrics, excellent craftsmanship, thoughtful design and personalized fit at a more accessible price point.
              </p>
              <p>
                By combining our manufacturing capabilities, experienced partners, global fabric sourcing and direct-to-customer approach, we work to remove unnecessary layers between craftsmanship and the customer.
              </p>
              <p className="italic pt-4 text-[#A87B45]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                This allows us to focus more on what matters.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 w-full h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden shadow-2xl relative">
            <div ref={image1Ref} className="absolute -top-[15%] left-0 w-full h-[130%]">
              <img src="/New folder/20.png" alt="Direct to Customer" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
          </div>

        </div>

        {/* Bottom Section: Image 21 & Our Promise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="w-full h-[60vh] md:h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative">
            <div ref={image2Ref} className="absolute -top-[15%] left-0 w-full h-[130%]">
              <img src="/New folder/21.png" alt="Our Promise" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          </div>

          <div className="flex flex-col justify-center lg:pl-12">
            <h3 className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.25em] text-[#A87B45] mb-8">Our Promise</h3>
            
            <ul className="space-y-4 md:space-y-6">
              {promises.map((promise, idx) => (
                <li 
                  key={idx}
                  ref={el => promisesRef.current[idx] = el}
                  className="flex items-center gap-4 md:gap-6"
                >
                  <div className="w-8 md:w-12 h-[1px] bg-[#A87B45] shrink-0"></div>
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111] dark:text-[#F5F0E8] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {promise}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
