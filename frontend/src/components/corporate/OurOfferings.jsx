import React from 'react';
import { Building2, Bell, GraduationCap, Building, UserCheck, ArrowRight } from 'lucide-react';

export default function OurOfferings() {
  const offerings = [
    {
      img: "/images/corporate/offering_1.png",
      icon: <Building2 className="w-4 h-4 text-white" />,
      title: "Corporate Office",
      desc: "Professional attire for everyday excellence."
    },
    {
      img: "/images/corporate/offering_2.png",
      icon: <Bell className="w-4 h-4 text-white" />,
      title: "Hospitality",
      desc: "Sophisticated looks that leave a lasting impression."
    },
    {
      img: "/images/corporate/offering_3.png",
      icon: <GraduationCap className="w-4 h-4 text-white" />,
      title: "Education",
      desc: "Smart and comfortable attire for students and staff."
    },
    {
      img: "/images/corporate/offering_4.png",
      icon: <Building className="w-4 h-4 text-white" />,
      title: "Institutions",
      desc: "Custom solutions for every kind of institution."
    },
    {
      img: "/images/corporate/offering_5.png",
      icon: <UserCheck className="w-4 h-4 text-white" />,
      title: "Corporate Formalwear",
      desc: "Premium formalwear for special moments."
    }
  ];

  return (
    <section className="py-24 bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 text-[#111111] dark:text-[#F5F0E8] border-t border-[#111111]/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16">
          <h4 className="text-[#A87B45] font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Our Offerings
          </h4>
        </div>

        {/* Offerings Grid/Scroll */}
        <div className="w-full flex overflow-x-auto pb-8 gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          
          {offerings.map((offer, idx) => (
            <div key={idx} className="min-w-[260px] lg:min-w-0 flex flex-col group cursor-pointer snap-start">
              
              {/* Image Box */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#E8E3DA] rounded-t-sm">
                <img 
                  src={offer.img} 
                  alt={offer.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Icon Badge overlapping bottom left */}
                <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-full bg-[#111111] border-[4px] border-[#FDFBF7] flex items-center justify-center z-10 shadow-sm">
                  {offer.icon}
                </div>
              </div>

              {/* Text Box */}
              <div className="bg-white dark:bg-[#151515] transition-colors duration-500 border border-t-0 border-[#111111]/5 p-5 pt-8 rounded-b-sm flex flex-col flex-1 relative transition-colors group-hover:bg-[#faf9f6]">
                <h5 className="font-bold text-sm mb-2">{offer.title}</h5>
                <p className="text-[#111111]/60 dark:text-[#F5F0E8]/60 font-light text-[11px] leading-relaxed mb-4">
                  {offer.desc}
                </p>
                
                <div className="mt-auto flex justify-end">
                  <div className="w-6 h-6 rounded-full border border-[#A87B45] flex items-center justify-center text-[#A87B45] group-hover:bg-[#A87B45] group-hover:text-white transition-colors">
                    <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  </div>
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
