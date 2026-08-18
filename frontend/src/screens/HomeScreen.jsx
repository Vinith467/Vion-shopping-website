import { ArrowRight, Play, User, Palette, Eye, ShoppingBag, ShieldCheck, Leaf, Truck, Diamond, Scissors, ScrollText, Shield, BadgeCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useAppContext } from '../context/AppContext';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const { data: catData } = await supabase.from('categories').select('*');
      setCategories(catData || []);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handlePageClick = (e) => {
    if (!isLoggedIn && !localStorage.getItem('hasSeenOnboarding')) {
      localStorage.setItem('hasSeenOnboarding', 'true');
      navigate('/onboarding');
    }
  };

  // Shared crystal 3D glass card style
  const glassCard = "bg-white/10 backdrop-blur-xl border border-white/45 rounded-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)]";
  const glassCardHover = "hover:bg-white/20 hover:border-white/60 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(0,0,0,0.15),_0_14px_36px_rgba(0,0,0,0.12)] transition-all duration-300";

  return (
    <div onClickCapture={handlePageClick} className="flex w-full flex-col min-h-[100dvh] font-sans overflow-x-hidden text-gray-900" style={{ background: 'linear-gradient(180deg, #F5F0E8 0%, #EDE6DC 30%, #E8DFD3 60%, #DDD4C6 100%)' }}>
      
      {/* 1. Hero Section */}
      <section className="relative w-full max-w-[1983px] mx-auto min-h-[85svh] lg:min-h-0 lg:aspect-[1983/793] flex flex-col justify-end md:justify-center overflow-hidden">
        
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
           <img 
             src="/images/herobannerimage/herobannerimage.png" 
             alt="Fashion Model Background" 
             className="w-full h-full object-cover object-[65%_top] md:object-top" 
             onError={(e) => { 
                e.target.onerror = null; 
                e.target.style.display = 'none'; 
             }} 
           />
           {/* Subtle overlay only on left for text readability - no whitewash */}
           <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#EDE6DC] md:from-[#EDE6DC]/60 via-[#EDE6DC]/60 md:via-transparent to-transparent"></div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-20 2xl:px-24 flex justify-between items-start h-full pt-16 md:pt-4 lg:pt-6 xl:pt-8 pb-16 md:pb-0">
          
          {/* Left Content */}
          <div className="flex flex-col items-start max-w-xl xl:max-w-2xl mt-auto md:mt-0">
            <h1 className="mb-5 uppercase text-4xl md:text-5xl lg:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1A1A1A' }}>
              Clothing<br/>
              Crafted For<br/>
              Your{' '}
              <span 
                className="inline-block"
                style={{ 
                  fontFamily: "'Great Vibes', cursive", 
                  fontWeight: 400,
                  fontSize: '1.1em',
                  lineHeight: 0.9,
                  color: '#C49A5C',
                  textTransform: 'none',
                  verticalAlign: 'baseline',
                  position: 'relative',
                  top: '0.04em'
                }}>
                Story
              </span>
            </h1>
            
            <p className="text-[12px] md:text-[13px] 2xl:text-[14px] mb-6 max-w-[22rem]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, color: '#555', lineHeight: 1.65, letterSpacing: '0.01em' }}>
              Bespoke clothing. Timeless design. Crafted with intention, made for you.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <button 
                onClick={() => navigate('/onboarding', { state: { resetStep: true } })}
                className="px-7 py-2.5 2xl:px-9 2xl:py-3 rounded-full transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(to bottom, #4A1A18, #2A0C0A)',
                  border: '1px solid rgba(191, 166, 121, 0.4)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
                }}
              >
                <span className="text-[#E5CDA7] text-[9px] 2xl:text-[10px] font-semibold tracking-[0.16em]" style={{ fontFamily: "'Inter', sans-serif" }}>DISCOVER COLLECTION</span>
              </button>
              
              <button 
                className="px-7 py-2.5 2xl:px-9 2xl:py-3 rounded-full transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 active:scale-[0.98]"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: 'inset 0 1.5px 3px rgba(255,255,255,0.85), inset 0 -1.5px 3px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)'
                }}
              >
                <span className="relative z-10 text-[#2A2A2A] text-[9px] 2xl:text-[10px] font-semibold tracking-[0.16em]" style={{ fontFamily: "'Inter', sans-serif" }}>BOOK A CONSULTATION</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-full border-2 border-white/80 object-cover grayscale" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=5" className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-full border-2 border-white/80 object-cover grayscale" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=9" className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-full border-2 border-white/80 object-cover grayscale" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=12" className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-full border-2 border-white/80 object-cover grayscale" alt="User" />
               </div>
               <div>
                  <h4 className="text-base 2xl:text-lg leading-none mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: '#1C1C1C' }}>10,000+</h4>
                  <p className="text-[9px] 2xl:text-[10px] font-medium tracking-wide text-[#666]">Clients trust VION</p>
               </div>
            </div>
          </div>

          {/* Right Content - Benefits Panel */}
          <div className="hidden lg:block w-[280px] 2xl:w-[340px] bg-white/10 backdrop-blur-lg border border-white/40 rounded-2xl p-5 2xl:p-7 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7),_inset_0_-1.5px_3px_rgba(0,0,0,0.2),_0_16px_40px_rgba(0,0,0,0.2)]">
            <div className="space-y-5 2xl:space-y-6">
              
              {[
                { icon: <Diamond size={20} strokeWidth={1.3} />, title: "Personalised Experience", desc: "Crafted around you, in every detail." },
                { icon: <Scissors size={20} strokeWidth={1.3} />, title: "Finest Craftsmanship", desc: "Handmade by master artisans, always." },
                { icon: <ScrollText size={20} strokeWidth={1.3} />, title: "Premium Materials", desc: "Sourced from the world's finest mills." },
                { icon: <Shield size={20} strokeWidth={1.3} />, title: "Timeless Elegance", desc: "Designed to be worn. Loved for a lifetime." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5 text-[#C49A5C]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[10px] 2xl:text-[11px] font-bold uppercase tracking-[0.12em] text-white mb-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{item.title}</h4>
                    <p className="text-[10px] 2xl:text-[11px] text-white/80 leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="relative z-20 w-full px-6 lg:px-16 -mt-8 lg:-mt-14 mb-8">
        <div className="max-w-[1300px] mx-auto bg-white/15 backdrop-blur-lg border border-white/50 rounded-2xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.85),_inset_0_-1.5px_3px_rgba(0,0,0,0.1),_0_12px_32px_rgba(0,0,0,0.08)] py-5 px-10 flex flex-wrap items-center justify-between gap-4">
           
           {[
             { icon: <Leaf className="w-8 h-8 text-[#8B6544]" strokeWidth={1.5} />, title: "Ethically Made", desc: "Conscious production, responsible by choice." },
             { icon: <div className="w-8 h-8 rounded-full border-[1.5px] border-[#8B6544] flex items-center justify-center"><BadgeCheck className="w-5 h-5 text-[#8B6544]" strokeWidth={1.5} /></div>, title: "Award Winning", desc: "Recognised for design excellence and client satisfaction." },
             { icon: <Truck className="w-8 h-8 text-[#8B6544]" strokeWidth={1.5} />, title: "Worldwide Delivery", desc: "Complimentary shipping on all orders." },
             { icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B6544]"><path d="M7 16V9a5 5 0 0 1 10 0v7"/><path d="M5 18l2-2h10l2 2"/><path d="M8 18v2"/><path d="M16 18v2"/></svg>, title: "Private Client Care", desc: "Dedicated support for a seamless experience." }
           ].map((item, idx, arr) => (
             <div key={idx} className="flex items-center gap-3 flex-1 min-w-[200px]">
               <div className="flex items-start gap-3 flex-1">
                 <div className="shrink-0 mt-0.5">{item.icon}</div>
                 <div>
                   <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A] mb-0.5">{item.title}</p>
                   <p className="text-[11px] text-[#555] leading-snug max-w-[160px]">{item.desc}</p>
                 </div>
               </div>
               {idx < arr.length - 1 && <div className="hidden lg:block w-[1px] h-10 bg-[#C5B8A8]"></div>}
             </div>
           ))}
        </div>
      </section>

      {/* 3. Your Personalised Journey */}
      <section className="w-full px-8 lg:px-20 mb-10 max-w-[1350px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          
          <div className="w-full lg:w-[24%] shrink-0 text-center lg:text-left">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#A87B45] mb-2">The Vion Experience</h4>
            <h2 className="mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', lineHeight: 1.08, color: '#1A1A1A' }}>
              Your Personalised<br/>Journey
            </h2>
            <div className="w-[80%] max-w-[200px] h-[2px] bg-gradient-to-r from-[#A87B45] to-[#D5A76B] mb-3 mx-auto lg:mx-0"></div>
            <p className="text-[13px] text-[#555] leading-[1.6] max-w-[230px] mx-auto lg:mx-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
              A seamless journey from consultation to creation. Thoughtfully designed around you.
            </p>
          </div>
          
          <div className="flex-1 w-full relative pt-6 lg:pt-4 grid grid-cols-2 gap-y-8 lg:flex lg:justify-between lg:items-start lg:gap-0">
            
            {[
              { num: "01", title: "SHOPPING FOR?", desc: "Who are you shopping for?" },
              { num: "02", title: "PROFILE DETAILS", desc: "Tell us about them" },
              { num: "03", title: "VION COLLECTION", desc: "Your VION Collection" },
              { num: "04", title: "CONFIDENT SHOPPING", desc: "Shop with Confidence" }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center flex-1 relative group px-2">
                
                {/* Connecting arrow */}
                {idx < 3 && <div className="hidden lg:flex absolute top-[42px] -right-[18%] w-[36%] items-center justify-center text-[#BFA679] z-0">
                   <div className="flex-1 border-t-[1.5px] border-dashed border-[#BFA679]/70"></div>
                   <ArrowRight size={12} className="-ml-1 shrink-0" />
                </div>}
                
                <div className="w-[80px] h-[80px] md:w-[88px] md:h-[88px] rounded-full bg-white/20 backdrop-blur-lg border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.95),_inset_0_-2px_4px_rgba(0,0,0,0.15),_0_10px_28px_rgba(0,0,0,0.1)] flex items-center justify-center mb-3 relative z-10">
                  <span className="text-[#8B5A2B] text-[32px] md:text-[38px]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{step.num}</span>
                </div>
                <h4 className="text-[14px] md:text-[16px] 2xl:text-[18px] uppercase tracking-[0.04em] text-[#000000] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{step.title}</h4>
                <p className="text-[12px] md:text-[14px] 2xl:text-[15px] text-[#1A1A1A] max-w-[170px] leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Highlight Actions & Categories */}
      <section className="w-full px-8 lg:px-20 mb-20 max-w-[1350px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Top Row: Bento Grid */}
          <div 
            onClick={() => navigate('/onboarding', { state: { resetStep: true } })} 
            className="group cursor-pointer relative overflow-hidden rounded-2xl md:col-span-2 h-[260px] md:h-[300px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          >
             <img src="/DISCOVER COLLECTION IMAGE.png" alt="DISCOVER COLLECTION" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
             <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                <h4 className="text-[1.6rem] lg:text-[2.2rem] tracking-wide text-white mb-2 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>DISCOVER COLLECTION</h4>
                <p className="text-[12px] md:text-[14px] text-white/90 leading-relaxed font-medium max-w-[80%] md:max-w-[60%] mb-4">
                  Explore our curated fashion selections tailored to your unique profile and style.
                </p>
                <button className="border border-white/40 text-white bg-white/10 backdrop-blur-sm px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] flex items-center gap-2 w-fit hover:bg-white/25 transition-colors">
                   Explore <ArrowRight size={10} />
                </button>
             </div>
          </div>

          <div 
            onClick={() => navigate('/onboarding', { state: { resetStep: true } })} 
            className="group cursor-pointer relative overflow-hidden rounded-2xl md:col-span-1 h-[260px] md:h-[300px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          >
             <img src="/BOOK A CONSULTATION.png" alt="BOOK A CONSULTATION" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
             <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                <h4 className="text-[1.4rem] lg:text-[1.7rem] tracking-wide text-white mb-2 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>BOOK A<br/>CONSULTATION</h4>
                <p className="text-[11px] md:text-[12px] text-white/85 leading-relaxed font-medium max-w-[95%] mb-4">
                  Schedule a one-on-one session with our experts.
                </p>
                <button className="border border-white/40 text-white bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] flex items-center gap-1.5 w-fit hover:bg-white/25 transition-colors">
                   Explore <ArrowRight size={9} />
                </button>
             </div>
          </div>

          {/* Bottom 3 Cards */}
          {[
            { name: "CASUAL", value: "Casual", desc: "Effortless everyday pieces that blend comfort with refined style.", img: "/images/herobannerimage/casual.png" },
            { name: "EXCLUSIVE", value: "Exclusive", desc: "Elevated craftsmanship for life's most meaningful moments.", img: "/images/herobannerimage/exclusive.png" },
            { name: "EXCLUSIVE PLUS", value: "Exclusive Plus", desc: "Fully bespoke creations crafted exclusively for you.", img: "/images/herobannerimage/exclusiveplus.png" }
          ].map((cat, idx) => (
            <div key={idx} onClick={() => navigate('/onboarding', { state: { resetStep: true, defaultCategory: cat.value, redirectToExplore: true } })} className="group cursor-pointer relative overflow-hidden rounded-2xl h-[220px] md:h-[240px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
               <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
               <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                  <h4 className="text-[1.4rem] lg:text-[1.6rem] tracking-wide text-white mb-1.5 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{cat.name}</h4>
                  <p className="text-[11px] text-white/85 leading-relaxed font-medium max-w-[90%] mb-3">
                    {cat.desc}
                  </p>
                  <button className="border border-white/40 text-white bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] flex items-center gap-1.5 w-fit hover:bg-white/25 transition-colors">
                     Explore <ArrowRight size={9} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Shop by Occasion */}
      <section className="w-full px-8 lg:px-20 pb-28 max-w-[1350px] mx-auto">
        <div className="flex flex-col lg:flex-row items-end gap-8">
          
          <div className="w-full lg:w-44 shrink-0 pb-3">
            <h2 className="leading-snug uppercase tracking-[0.1em] relative inline-block" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '1.2rem', color: '#1A1A1A' }}>
              Shop By<br/>Occasion
              <div className="absolute -bottom-3 left-0 w-9 h-[1.5px] bg-[#BFA679]"></div>
            </h2>
          </div>

          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
             
             {categories.map((cat, i) => (
                <Link 
                  to={`/explore?category=${cat.name}`} 
                  key={cat.id || i} 
                  className="group relative h-[170px] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all block"
                >
                  <img 
                    src={cat.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80&auto=format&fit=crop'} 
                    alt={cat.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-[11px] tracking-[0.1em] uppercase mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{cat.name}</h3>
                      <p className="text-[#BFA679] text-[7px] font-bold tracking-[0.1em] uppercase">EXPLORE NOW</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-[#BFA679]/60 flex items-center justify-center shrink-0 group-hover:bg-[#BFA679]/20 transition-colors text-[#BFA679]">
                       <ArrowRight size={8} />
                    </div>
                  </div>
                </Link>
             ))}
             
          </div>
        </div>
      </section>

    </div>
  );
}
