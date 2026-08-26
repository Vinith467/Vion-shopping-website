import React from 'react';
import { MessageSquare, PenTool, Scissors, Factory, Truck } from 'lucide-react';

export default function OurProcess() {
  const steps = [
    {
      num: 1,
      title: "Understand",
      icon: <MessageSquare className="w-5 h-5 text-white" strokeWidth={1.5} />,
      desc: "We learn about your needs, people and expectations."
    },
    {
      num: 2,
      title: "Design",
      icon: <PenTool className="w-5 h-5 text-white" strokeWidth={1.5} />,
      desc: "We create styles and concepts that reflect your identity."
    },
    {
      num: 3,
      title: "Plan & Develop",
      icon: <Scissors className="w-5 h-5 text-white" strokeWidth={1.5} />,
      desc: "We finalize fabrics, fits and details to bring the vision to life."
    },
    {
      num: 4,
      title: "Produce",
      icon: <Factory className="w-5 h-5 text-white" strokeWidth={1.5} />,
      desc: "Expert manufacturing with rigorous quality standards."
    },
    {
      num: 5,
      title: "Deliver",
      icon: <Truck className="w-5 h-5 text-white" strokeWidth={1.5} />,
      desc: "On-time delivery, ready to make an impact from day one."
    }
  ];

  return (
    <section className="py-24 bg-[#FDFBF7] text-[#111111]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-20">
          <h4 className="text-[#A87B45] font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Our Process
          </h4>
        </div>

        {/* Process Steps */}
        <div className="relative flex flex-col md:flex-row items-start justify-between w-full">
          
          {/* Dotted Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-12 right-12 h-[1px] border-t-2 border-dashed border-[#A87B45]/40 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/5 px-2 mb-12 md:mb-0">
              
              {/* Vertical Dotted Line for Mobile connecting steps */}
              {idx !== steps.length - 1 && (
                <div className="md:hidden absolute top-16 bottom-[-3rem] w-[1px] border-l-2 border-dashed border-[#A87B45]/40 z-0"></div>
              )}

              {/* Icon Circle */}
              <div className="w-16 h-16 rounded-full bg-[#111111] border-[4px] border-[#FDFBF7] flex items-center justify-center mb-6 shadow-sm z-10">
                {step.icon}
              </div>
              
              <h5 className="font-bold text-sm mb-3">
                {step.num}. {step.title}
              </h5>
              
              <p className="text-[#111111]/70 font-light text-xs leading-relaxed max-w-[160px]">
                {step.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
