import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';

export default function WhoWeServe() {
  return (
    <section className="py-24 bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 text-[#111111] dark:text-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h4 className="text-[#A87B45] font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Who We Serve
          </h4>
          <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4">
            Professional Attire & Formalwear Solutions for Every Organization
          </h2>
          <p className="text-[#111111]/70 dark:text-[#F5F0E8]/70 font-light text-sm md:text-base">
            Thoughtful design. Quality craftsmanship. Made for your people.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Corporate Card */}
          <div className="relative group rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[350px] lg:h-[400px]">
            <img 
              src="/images/corporate/serve_corporate.png" 
              alt="For Corporates" 
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Card Overlay Split */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/95 via-[#111111]/80 to-transparent w-full md:w-[75%] lg:w-[65%]"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8 lg:p-12 flex flex-col justify-center h-full w-full md:w-[75%] lg:w-[65%] text-[#F5F0E8]">
              <div className="w-12 h-12 rounded-full border border-[#F5F0E8]/30 flex items-center justify-center mb-6">
                <Briefcase className="w-5 h-5 text-[#F5F0E8]" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-serif font-bold mb-4">For Corporates</h3>
              <p className="text-sm font-light text-[#F5F0E8]/80 leading-relaxed pr-4">
                Professional attire and formalwear that enhance your brand image and empower your teams.
              </p>
            </div>
          </div>

          {/* Universities Card */}
          <div className="relative group rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[350px] lg:h-[400px]">
            <img 
              src="/images/corporate/serve_university.png" 
              alt="For Universities & Institutes" 
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Card Overlay Split */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/95 via-[#111111]/80 to-transparent w-full md:w-[75%] lg:w-[65%]"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8 lg:p-12 flex flex-col justify-center h-full w-full md:w-[75%] lg:w-[65%] text-[#F5F0E8]">
              <div className="w-12 h-12 rounded-full border border-[#F5F0E8]/30 flex items-center justify-center mb-6">
                <GraduationCap className="w-5 h-5 text-[#F5F0E8]" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-serif font-bold mb-4 leading-tight">For Universities<br/>& Institutes</h3>
              <p className="text-sm font-light text-[#F5F0E8]/80 leading-relaxed pr-4">
                Smart, comfortable and durable attire that inspire pride, discipline and a sense of belonging.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
