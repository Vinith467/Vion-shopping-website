import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const steps = [
  { num: '01', title: 'Book a Consultation', desc: 'You schedule an appointment with us.', img: '/images/about/corporate_gallery_editorial_1787745065973.jpg' },
  { num: '02', title: 'We Visit You', desc: 'Our stylist and experts meet you at your location to understand your requirements, culture, preferences and expectations.', img: '/images/about/craft_02_man_1787726381257.jpg' },
  { num: '03', title: 'Design & Present', desc: 'Our team develops concepts, styles, fabrics and design options and presents them to you.', img: '/images/about/craft_01_selection_1787726319333.jpg' },
  { num: '04', title: 'You Select', desc: 'You select the designs, fabrics, colors and details that best represent your personal style.', img: '/images/about/corporate_fabric_wool_1787744950103.jpg' },
  { num: '05', title: 'Individual Measurements', desc: 'We take precise measurements of each individual who will wear the garment, allowing us to create a better and more personalized fit.', img: '/images/about/craft_04_measuring_1787726583981.jpg' },
  { num: '06', title: 'Manufacture', desc: 'Our manufacturing partners and craftsmen transform the selected materials and designs into finished garments with strict quality control.', img: '/images/about/craft_03_cutting_1787726412577.jpg' },
  { num: '07', title: 'Deliver', desc: 'The finished garments are quality checked and delivered according to the agreed schedule.', img: '/images/about/craft_02_woman_1787726369150.jpg' },
  { num: '08', title: 'We Support You', desc: 'If there is a fitting issue, alteration requirement or any other concern, we work with you to resolve it.', img: '/images/about/craft_04_male_fitting_1787726621418.jpg' },
];

export default function CorporateOurApproach() {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Calculate how far we need to move the track
        // It's the full width of the track MINUS the width of the viewport
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
            end: () => `+=${getScrollAmount() * -1}`, // The scroll distance equals the physical width of the track
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true, // Recalculates on resize
          }
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#151515] relative overflow-hidden">
      
      {/* Intro Section - Static, scrolls normally */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold uppercase mb-8 leading-tight text-[#C49A5C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Our Approach
        </h2>
        <div className="space-y-6 text-sm md:text-lg text-[#F5F0E8]/80 font-sans font-light leading-relaxed max-w-3xl mx-auto">
          <p>
            We don't believe organizations should simply choose from whatever is already available.
          </p>
          <p>
            We believe clothing should be designed around the organization, the people who wear it and the identity it represents.
          </p>
          <p className="font-medium text-[#C49A5C] uppercase tracking-widest text-sm pt-4">
            Our process begins with understanding.
          </p>
        </div>
      </section>

      {/* Horizontal Scroll Section - Pins and slides */}
      <section ref={scrollContainerRef} className="md:h-screen flex items-center relative z-10 py-12 md:py-0">
        
        {/* Faint Background Text for texture */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
          <h1 className="text-[20vw] font-serif font-bold text-[#F5F0E8] whitespace-nowrap">THE PROCESS</h1>
        </div>

        <div 
          ref={trackRef} 
          className="flex gap-8 px-6 md:px-24 flex-nowrap md:w-max items-center h-full overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none no-scrollbar pb-8 md:pb-0"
        >
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="w-[85vw] md:w-[450px] h-[55vh] md:h-[65vh] shrink-0 rounded-xl overflow-hidden relative group transition-all duration-500 shadow-2xl snap-center"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/80 to-black/30"></div>
              </div>
              
              {/* Massive background number overlay */}
              <span className="absolute top-4 right-6 text-7xl md:text-8xl font-bold font-serif opacity-10 text-[#F5F0E8] group-hover:text-[#C49A5C] group-hover:opacity-30 transition-all duration-500 z-10 pointer-events-none">
                {step.num}
              </span>
              
              {/* Content */}
              <div className="relative z-20 p-8 md:p-12 flex flex-col justify-end h-full">
                <div>
                  <h4 className="text-[#C49A5C] font-mono text-sm tracking-widest mb-3">STEP {step.num}</h4>
                  <h3 className="text-2xl md:text-3xl font-serif uppercase tracking-wider text-[#F5F0E8] mb-6">
                    {step.title}
                  </h3>
                  <p className="font-sans font-light text-base leading-relaxed text-[#F5F0E8]/80">
                    {step.desc}
                  </p>
                </div>
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
