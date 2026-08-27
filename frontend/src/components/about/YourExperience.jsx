import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const steps = [
  { num: '01', title: 'Discover the Collection', desc: "Explore our latest collections across men's and women's fashion. Discover different styles, silhouettes, fabrics and designs created for different occasions.", img: '/New folder/12.png' },
  { num: '02', title: 'Choose Your Fit', desc: 'Select the fit that works for you. Our collections can include standard fits as well as tailored/customized options, depending on the garment.', img: '/New folder/16.png' },
  { num: '03', title: 'Select Your Size', desc: 'Choose your size using our size guide and fit information. We make it easy to understand how each garment is designed to fit.', img: '/New folder/13.png' },
  { num: '04', title: 'Make It Yours', desc: 'Where customization is available, choose the details that make the garment your own — from fabrics and colors to design elements and finishing touches.', img: '/New folder/17.png' },
  { num: '05', title: 'Place Your Order', desc: 'Complete your purchase directly through the VION website. Your order is then prepared with the same attention to detail that goes into every VION garment.', img: '/New folder/14.png' },
  { num: '06', title: 'Crafted For You', desc: 'Our manufacturing partners and craftsmen transform selected materials and designs into your finished garment, with quality checks throughout the process.', img: '/New folder/18.png' },
  { num: '07', title: 'Delivered To You', desc: 'Your finished VION garment is carefully checked and delivered to your doorstep.', img: '/New folder/15.png' },
  { num: '08', title: 'We Support You', desc: 'If you have a fitting issue, alteration requirement or any other concern, our team is here to help.', img: '/New folder/19.png' },
];

export default function YourExperience() {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      const getScrollAmount = () => {
        let trackWidth = trackRef.current.scrollWidth;
        return -(trackWidth - window.innerWidth);
      };

      const tween = gsap.to(trackRef.current, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "top top",
          end: () => `+=${getScrollAmount() * -1}`, 
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#151515] relative overflow-hidden">
      
      {/* Intro Section - Static, scrolls normally */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto text-center relative z-10">
        <h3 className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.25em] text-[#E5CDA7] mb-6">Your VION Experience</h3>
        <h2 className="text-4xl md:text-6xl font-bold uppercase mb-8 leading-tight text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Shopping with VION is designed to be simple.
        </h2>
      </section>

      {/* Horizontal Scroll Section - Pins and slides */}
      <section ref={scrollContainerRef} className="h-screen flex items-center relative z-10 bg-[#111]">
        
        {/* Faint Background Text for texture */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden z-0">
          <h1 className="text-[20vw] font-serif font-bold text-white whitespace-nowrap">THE JOURNEY</h1>
        </div>

        <div 
          ref={trackRef} 
          className="flex gap-8 px-6 md:px-24 flex-nowrap w-max items-center h-full z-20"
        >
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="w-[85vw] md:w-[450px] h-[55vh] md:h-[65vh] shrink-0 rounded-xl overflow-hidden relative group transition-all duration-500 shadow-2xl bg-[#111]"
            >
              {/* Background Image inside the card */}
              <div className="absolute inset-0 z-0">
                <img src={step.img} alt={step.title} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>
              </div>

              {/* Massive background number overlay */}
              <span className="absolute top-4 right-6 text-7xl md:text-8xl font-bold font-serif opacity-10 text-white group-hover:text-[#E5CDA7] group-hover:opacity-30 transition-all duration-500 z-10 pointer-events-none">
                {step.num}
              </span>
              
              {/* Content */}
              <div className="relative z-20 p-8 md:p-12 flex flex-col justify-end h-full">
                <h4 className="text-[#E5CDA7] font-mono text-xs tracking-widest mb-3">STEP {step.num}</h4>
                <h3 className="text-2xl md:text-3xl font-serif uppercase tracking-wider text-white mb-6">
                  {step.title}
                </h3>
                <p className="font-sans font-light text-[15px] leading-relaxed text-white/80">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
          
          {/* Spacer at the end so the last card doesn't touch the very edge when scrolling finishes */}
          <div className="w-[10vw] shrink-0"></div>
        </div>
      </section>

    </div>
  );
}
