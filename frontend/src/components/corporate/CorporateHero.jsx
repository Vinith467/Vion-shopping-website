import React from 'react';
import { ShieldCheck, PenTool, Truck, HeadphonesIcon } from 'lucide-react'; // Placeholder icons for trust badges

export default function CorporateHero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-end pb-12 pt-32 overflow-hidden bg-[#151515]">
      
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/corporate/corp_hero.jpg" 
          alt="VION Corporate Attire" 
          className="w-full h-full object-cover opacity-60"
        />
        {/* Dark gradient so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/90 via-[#111111]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start text-[#F5F0E8]">
        
        <h3 className="text-[#C49A5C] font-bold tracking-widest uppercase text-xs md:text-sm mb-4">
          We Design. We Create. We Deliver.
        </h3>
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
          Smart Attire.<br/>
          Strong <span className="text-[#C49A5C] italic font-medium">Identities.</span>
        </h1>
        
        <p className="max-w-xl text-base md:text-lg font-light text-[#F5F0E8]/90 leading-relaxed mb-6">
          VION Corporate designs and delivers professional attire and formalwear that represent your values, build unity and elevate your brand.
        </p>

        <p className="text-[#C49A5C] font-bold tracking-wide text-lg mb-8">
          For Corporates. For Universities & Institutes.
        </p>

        <button className="bg-[#C49A5C] hover:bg-[#a8824b] text-white text-base font-bold px-8 py-3 rounded-sm transition-colors mb-24">
          Book Consultation &rarr;
        </button>

        {/* Trust Badges */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-[#F5F0E8]/20">
          
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 rounded-full border border-[#C49A5C]/50 flex items-center justify-center group-hover:bg-[#C49A5C]/10 transition-colors">
              <ShieldCheck className="text-[#C49A5C] w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F5F0E8]">Premium Quality</h4>
              <p className="text-xs text-[#F5F0E8]/60 font-light">Fabrics & Craftsmanship</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 rounded-full border border-[#C49A5C]/50 flex items-center justify-center group-hover:bg-[#C49A5C]/10 transition-colors">
              <PenTool className="text-[#C49A5C] w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F5F0E8]">Custom Designed</h4>
              <p className="text-xs text-[#F5F0E8]/60 font-light">For Your Identity</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 rounded-full border border-[#C49A5C]/50 flex items-center justify-center group-hover:bg-[#C49A5C]/10 transition-colors">
              <Truck className="text-[#C49A5C] w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F5F0E8]">On-Time Delivery</h4>
              <p className="text-xs text-[#F5F0E8]/60 font-light">Every Time</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 rounded-full border border-[#C49A5C]/50 flex items-center justify-center group-hover:bg-[#C49A5C]/10 transition-colors">
              <HeadphonesIcon className="text-[#C49A5C] w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F5F0E8]">End-to-End Support</h4>
              <p className="text-xs text-[#F5F0E8]/60 font-light">At Every Step</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
