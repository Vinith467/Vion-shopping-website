import React from 'react';
import { ShieldCheck, PenTool, Medal, Truck, HeadphonesIcon } from 'lucide-react';

export default function WhyChooseVion() {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#A87B45]" strokeWidth={1.5} />,
      title: "Quality You Can Trust",
      desc: "Carefully selected fabrics, precise stitching and strict quality control."
    },
    {
      icon: <PenTool className="w-8 h-8 text-[#A87B45]" strokeWidth={1.5} />,
      title: "Designed for You",
      desc: "Custom designs that reflect your brand identity and culture."
    },
    {
      icon: <Medal className="w-8 h-8 text-[#A87B45]" strokeWidth={1.5} />,
      title: "Comfort & Fit",
      desc: "Ergonomic fits and attention to detail for all-day comfort."
    },
    {
      icon: <Truck className="w-8 h-8 text-[#A87B45]" strokeWidth={1.5} />,
      title: "Reliable Delivery",
      desc: "Timely production and delivery you can depend on."
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-[#A87B45]" strokeWidth={1.5} />,
      title: "Support Every Step",
      desc: "From consultation to after-sales, we're with you always."
    }
  ];

  return (
    <section className="py-20 bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 text-[#111111] dark:text-[#F5F0E8] border-t border-[#111111]/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16">
          <h4 className="text-[#A87B45] font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Why Choose VION
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-6 relative">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4 relative">
              <div className="w-16 h-16 mb-6">
                {feature.icon}
              </div>
              <h5 className="font-bold text-sm mb-3">{feature.title}</h5>
              <p className="text-[#111111]/70 dark:text-[#F5F0E8]/70 font-light text-xs leading-relaxed max-w-[200px]">
                {feature.desc}
              </p>
              
              {/* Vertical Divider (hidden on mobile/tablet, shown on desktop) */}
              {idx !== features.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-24 bg-[#111111]/10"></div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
