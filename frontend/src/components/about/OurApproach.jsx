import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const steps = [
  { num: '1', title: 'Book a Consultation', desc: 'The organization schedules an appointment with VION.' },
  { num: '2', title: 'We Visit You', desc: 'Our stylist and experts meet the customer at their location to understand their requirements, culture, preferences and expectations.' },
  { num: '3', title: 'Design & Present', desc: 'Our team develops concepts, styles, fabrics and design options and presents them to the customer.' },
  { num: '4', title: 'You Select', desc: 'The customer selects the designs, fabrics, colors and details that best represent their requirements.' },
  { num: '5', title: 'Individual Measurements', desc: 'We take precise measurements of each individual who will wear the garment, allowing us to create a better and more personalized fit.' },
  { num: '6', title: 'Manufacture', desc: 'Our manufacturing partners and craftsmen transform the selected materials and designs into finished garments with strict quality control.' },
  { num: '7', title: 'Deliver', desc: 'The finished garments are quality checked and delivered according to the agreed schedule.' },
  { num: '8', title: 'We Support You', desc: 'If there is a fitting issue, alteration requirement or any other concern, we work with you to resolve it.' },
];

export default function OurApproach() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray('.step-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: (i % 2) * 0.1, // Slight stagger for grid
          ease: "power2.out"
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-[#151515] text-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-tight text-[#C49A5C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Our Approach
          </h2>
          <p className="text-sm md:text-base text-[#F5F0E8]/80 font-sans font-light leading-relaxed mb-4">
            We don't believe organizations should simply choose from whatever is already available. We believe clothing should be designed around the organization, the people who wear it and the identity it represents.
          </p>
          <p className="font-medium text-[#C49A5C] uppercase tracking-widest text-sm">
            Our process begins with understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="step-card p-6 border border-[#F5F0E8]/10 hover:border-[#C49A5C]/50 transition-colors duration-300 relative group">
              <span className="absolute -top-6 -left-2 text-7xl font-bold font-serif opacity-5 text-[#F5F0E8] group-hover:text-[#C49A5C] transition-colors duration-300 pointer-events-none">
                0{step.num}
              </span>
              <div className="relative z-10">
                <h3 className="text-xl font-serif uppercase tracking-wider text-[#C49A5C] mb-4">
                  {step.title}
                </h3>
                <p className="font-sans font-light text-sm leading-relaxed text-[#F5F0E8]/70">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
