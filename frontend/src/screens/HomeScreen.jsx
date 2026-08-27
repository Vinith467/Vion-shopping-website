import { ArrowRight, Play, User, Palette, Eye, ShoppingBag, ShieldCheck, Leaf, Truck, Diamond, Scissors, ScrollText, Shield, BadgeCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabaseClient";
import { useAppContext } from '../context/AppContext';
import { Badge } from 'antd';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
export default function HomeScreen() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTailoringStep, setActiveTailoringStep] = useState(0);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const { data: catData } = await supabase.from('categories').select('*');
      setCategories(catData || []);
      setIsLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);



  // Shared crystal 3D glass card style
  const glassCard = "bg-white/10 backdrop-blur-xl border border-white/45 rounded-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.75),_inset_0_-1.5px_3px_rgba(0,0,0,0.12),_0_10px_30px_rgba(0,0,0,0.08)]";
  const glassCardHover = "hover:bg-white/20 hover:border-white/60 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(0,0,0,0.15),_0_14px_36px_rgba(0,0,0,0.12)] transition-all duration-300";

  return (
    <div className="flex w-full flex-col min-h-[100dvh] font-sans overflow-x-hidden text-gray-900" style={{ background: 'linear-gradient(180deg, #F5F0E8 0%, #EDE6DC 30%, #E8DFD3 60%, #DDD4C6 100%)' }}>
      
      {/* 1. Hero Section */}
      <section className="relative w-full max-w-[1983px] mx-auto flex flex-col md:justify-center overflow-hidden">
        
        {/* Desktop Background Image (Absolute) */}
        <div className="hidden md:block absolute inset-0 z-0">
           <img 
             src="/images/herobannerimage/hero banner 2 .png" 
             alt="Fashion Model Background (Desktop)" 
             className="w-full h-full object-cover object-[70%_center]" 
             onError={(e) => { 
                e.target.onerror = null; 
                e.target.style.display = 'none'; 
             }} 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-[#EDE6DC]/60 via-transparent to-transparent"></div>
        </div>

        {/* Mobile Background Image (Stacked naturally at the top) */}
        <div className="w-full relative block md:hidden -mt-16"> {/* Pull up to sit under absolute transparent header */}
           <img 
             src="/images/herobannerimage/mobile hero banner .png" 
             alt="Fashion Model Background (Mobile)" 
             className="w-full h-auto aspect-[4/5.2] object-cover object-[50%_40%]" 
             style={{ 
                WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 98%)',
                maskImage: 'linear-gradient(to bottom, black 65%, transparent 98%)' 
             }}
             onError={(e) => { 
                e.target.onerror = null; 
                e.target.style.display = 'none'; 
             }} 
           />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-20 2xl:px-24 flex justify-between items-start md:items-center -mt-16 md:mt-0 pt-0 md:pt-4 lg:pt-6 xl:pt-8 pb-16 md:pb-0 h-full md:min-h-[85svh] lg:min-h-0 lg:aspect-[1983/793]">
           
           {/* Left Content */}
           <div className="flex flex-col items-start max-w-xl xl:max-w-2xl mt-0 relative z-20">
            <div className="flex items-center gap-3 mb-4">
               <div className="h-[1px] w-8 md:w-12 bg-[#A87B45]"></div>
               <span className="text-[#A87B45] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em]">Sartoria Di Lusso</span>
            </div>
            
            <h1 className="mb-4 uppercase text-[2.75rem] leading-none md:text-5xl lg:text-[4.5rem]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, letterSpacing: '0.02em', color: '#1A0F0A' }}>
              Italian<br/>
              <span 
                className="inline-block mt-2"
                style={{ 
                  fontFamily: "'Great Vibes', cursive", 
                  fontWeight: 600,
                  fontSize: '1.4em',
                  lineHeight: 0.85,
                  color: '#8B5A2B',
                  textTransform: 'none',
                  paddingRight: '0.2em',
                  textShadow: '0 2px 8px rgba(139, 90, 43, 0.2)'
                }}>
                Elegance
              </span>
            </h1>
            
            <div className="relative mb-6 md:mb-8 max-w-[26rem]">
              {/* Elegant soft glow behind text for legibility - hidden on mobile to avoid washing out the image */}
              <div className="hidden md:block absolute -inset-y-4 -inset-x-6 bg-[#F5F0E8]/60 blur-xl rounded-full z-0"></div>
              
              <p className="relative z-10 text-[15.5px] md:text-[17px] 2xl:text-[19px]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#1A0F0A', lineHeight: 1.5, letterSpacing: '0.02em' }}>
                Timeless style. Unmatched grace. Experience the pinnacle of trusted Italian craftsmanship, tailored flawlessly to elevate your legacy.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <button 
                onClick={() => navigate('/select-gender')}
                className="cursor-pointer px-7 py-2.5 2xl:px-9 2xl:py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(to bottom, #4A1A18, #2A0C0A)',
                  border: '1px solid rgba(191, 166, 121, 0.4)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
                }}
              >
                <span className="text-[#E5CDA7] text-[9px] 2xl:text-[10px] font-semibold tracking-[0.16em]" style={{ fontFamily: "'Inter', sans-serif" }}>DISCOVER COLLECTION</span>
              </button>
              
              <button 
                onClick={() => window.dispatchEvent(new Event('openBookConsultantModal'))}
                className="group relative cursor-pointer px-7 py-2.5 2xl:px-9 2xl:py-3 rounded-full transition-all duration-300 hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #C49A5C 0%, #A87B45 50%, #8B5A2B 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(139, 90, 43, 0.35)'
                }}
              >
                <span className="text-white text-[9px] 2xl:text-[10px] font-bold tracking-[0.16em] drop-shadow-sm" style={{ fontFamily: "'Inter', sans-serif" }}>BOOK A CONSULTATION</span>
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
                  <h4 className="text-base 2xl:text-lg leading-none mb-0.5 text-[#1A0F0A] md:text-[#F5F0E8] md:drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>10,000+</h4>
                  <p className="text-[10px] 2xl:text-[11px] font-medium tracking-wide text-[#555] md:text-[#F5F0E8]/90 md:drop-shadow-md">Clients trust VION</p>
               </div>
            </div>
          </div>



        </div>
      </section>

      {/* 2. Highlight Actions & Categories */}
      <section className="relative z-20 w-full px-8 lg:px-20 mt-8 lg:mt-16 pb-10 lg:pb-32 max-w-[1350px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Top Row: Bento Grid */}
          <div 
            onClick={() => navigate('/select-gender')} 
            className="group cursor-pointer relative overflow-hidden rounded-2xl md:col-span-2 h-[220px] sm:h-[260px] md:h-[300px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          >
             <img src="/DISCOVER COLLECTION IMAGE.png" alt="DISCOVER COLLECTION" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
             <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10">
                <h4 className="text-[1.5rem] lg:text-[2.2rem] tracking-wide text-white mb-2 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>DISCOVER COLLECTION</h4>
                <p className="text-[11px] md:text-[14px] text-white/90 leading-relaxed font-medium max-w-[90%] md:max-w-[60%] mb-3 md:mb-4">
                  Explore our curated fashion selections tailored to your unique profile and style.
                </p>
                <button className="cursor-pointer border border-white/40 text-white bg-white/10 backdrop-blur-sm px-5 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-[0.1em] flex items-center gap-1.5 md:gap-2 w-fit hover:bg-white/25 hover:border-white/80 transition-all">
                   Buy Now <ArrowRight size={10} />
                </button>
             </div>
          </div>

          <div 
            onClick={() => navigate('/select-gender')} 
            className="group cursor-pointer relative overflow-hidden rounded-2xl md:col-span-1 h-[260px] md:h-[300px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          >
             <img src="/BOOK A CONSULTATION.png" alt="BOOK A CONSULTATION" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
             <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                <h4 className="text-[1.4rem] lg:text-[1.7rem] tracking-wide text-white mb-2 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>BOOK A<br/>CONSULTATION</h4>
                <p className="text-[11px] md:text-[12px] text-white/85 leading-relaxed font-medium max-w-[95%] mb-4">
                  Schedule a one-on-one session with our experts.
                </p>
                <button className="cursor-pointer border border-white/40 text-white bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] flex items-center gap-1.5 w-fit hover:bg-white/25 hover:border-white/80 transition-all">
                   Book Now <ArrowRight size={9} />
                </button>
             </div>
          </div>

          {/* Bottom 3 Cards */}
          {[
            { name: "STANDARD FIT", value: "Standard Fit", desc: "Effortless everyday pieces that blend comfort with refined style.", img: "/images/herobannerimage/casual.png", buttonText: "Buy Now" },
            { name: "TAILORED FIT", value: "Tailored Fit", desc: "Elevated craftsmanship for life's most meaningful moments.", img: "/images/herobannerimage/exclusive.png", buttonText: "Buy Now" },
            { name: "BOOK A STYLIST", value: "Book A Stylist", desc: "Fully bespoke creations crafted exclusively for you.", img: "/images/herobannerimage/exclusiveplus.png", buttonText: "Book Now" }
          ].map((cat, idx) => (
            <div key={idx} onClick={() => navigate(`/select-gender?class=${encodeURIComponent(cat.value)}`)} className="group cursor-pointer relative overflow-hidden rounded-2xl h-[220px] md:h-[240px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
               <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
               <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                  <h4 className="text-[1.4rem] lg:text-[1.6rem] tracking-wide text-white mb-1.5 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{cat.name}</h4>
                  <p className="text-[11px] text-white/85 leading-relaxed font-medium max-w-[90%] mb-3">
                    {cat.desc}
                  </p>
                  <button className="border border-white/40 text-white bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] flex items-center gap-1.5 w-fit hover:bg-white/25 transition-colors">
                     {cat.buttonText} <ArrowRight size={9} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Your Personalised Journey */}
      <section className="w-full px-8 lg:px-20 mb-10 max-w-[1350px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12">
          
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
          
          <div className="flex-1 w-full relative pt-6 lg:pt-0 grid grid-cols-2 gap-y-8 lg:flex lg:justify-between lg:items-center lg:gap-0">
            
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
                
                <div className="w-[80px] h-[80px] md:w-[88px] md:h-[88px] rounded-full bg-white/20 border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.95),_inset_0_-2px_4px_rgba(0,0,0,0.15),_0_10px_28px_rgba(0,0,0,0.1)] flex items-center justify-center mb-3 relative z-10">
                  <span className="text-[#8B5A2B] text-[32px] md:text-[38px]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{step.num}</span>
                </div>
                <h4 className="text-[14px] md:text-[16px] 2xl:text-[18px] uppercase tracking-[0.04em] text-[#000000] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{step.title}</h4>
                <p className="text-[12px] md:text-[14px] 2xl:text-[15px] text-[#1A1A1A] max-w-[170px] leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. The Art of Italian Tailoring & Trust Bar */}
      <section className="relative z-20 w-full px-6 lg:px-16 mt-8 lg:-mt-4 mb-8 pb-32 lg:pb-8">
        <div className="max-w-[1350px] mx-auto bg-white/20 border border-white/50 rounded-2xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.85),_inset_0_-1.5px_3px_rgba(0,0,0,0.1),_0_16px_40px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
          
          {/* Top Section: Art of Tailoring */}
          <div className="flex flex-col xl:flex-row p-8 lg:p-10 gap-8 xl:gap-12">
            
            {/* Left Content */}
            <div className="w-full xl:w-[28%] shrink-0">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A87B45] mb-3">THE ART OF ITALIAN TAILORING</h4>
              <h2 className="mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(2rem, 3vw, 2.6rem)', lineHeight: 1.05, color: '#1A1A1A' }}>
                The Finest Italian Fabrics.<br/>Crafted to Perfection.
              </h2>
              <p className="text-[15px] text-[#222] leading-[1.6]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                Every piece begins with a story. Yours.<br/>
                From fabric to final stitch, crafted in Italy, exclusively for you.
              </p>
            </div>
            
            {/* Right Content: 4 Images/Steps */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mt-6 xl:mt-0">
              {[
                { img: "/card image/1.png", num: "01.", title: "PREMIUM MATERIALS", desc: "Sourced from the world's finest mills." },
                { img: "/card image/2.png", num: "02.", title: "TIMELESS ELEGANCE", desc: "Designed to be worn. Loved for a lifetime." },
                { img: "/card image/3.png", num: "03.", title: "FINEST CRAFTSMANSHIP", desc: "Handmade by master artisans, always." },
                { img: "/card image/4.png", num: "04.", title: "PERSONALISED EXPERIENCE", desc: "Crafted around you, in every detail." }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/craftsmanship', { state: { activeSection: idx } });
                  }}
                >
                  <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg shadow-sm border border-white/40 group-hover:shadow-md group-hover:border-[#C49A5C]/60 transition-all duration-300">
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                         onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=400&h=300`; }} />
                  </div>
                  <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#1A1A1A] mb-1.5 flex items-center gap-1.5 group-hover:text-[#A87B45] transition-colors duration-300">
                    <span className="text-[#A87B45] font-serif text-[14px]">{step.num}</span> {step.title}
                  </h4>
                  <p className="text-[14px] text-[#222] font-semibold leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom Section: Dark Glass Trust Bar */}
          <div className="bg-[#1A1A1A]/95 py-6 px-8 lg:px-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/10">
             {[
               { icon: <Leaf className="w-7 h-7 text-[#C49A5C]" strokeWidth={1.5} />, title: "ETHICALLY MADE", desc: "Conscious production, responsible by choice." },
               { icon: <div className="w-7 h-7 rounded-full border-[1.5px] border-[#C49A5C] flex items-center justify-center"><BadgeCheck className="w-[18px] h-[18px] text-[#C49A5C]" strokeWidth={1.5} /></div>, title: "AWARD WINNING", desc: "Recognised for design excellence and client satisfaction." },
               { icon: <Truck className="w-7 h-7 text-[#C49A5C]" strokeWidth={1.5} />, title: "WORLDWIDE DELIVERY", desc: "Complimentary shipping on all orders." },
               { icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C49A5C]"><path d="M7 16V9a5 5 0 0 1 10 0v7"/><path d="M5 18l2-2h10l2 2"/><path d="M8 18v2"/><path d="M16 18v2"/></svg>, title: "PRIVATE CLIENT CARE", desc: "Dedicated support for a seamless experience." }
             ].map((item, idx, arr) => (
               <div key={idx} className="flex items-center gap-4 flex-1 min-w-[220px] cursor-pointer group">
                 <div className="flex items-start gap-3 flex-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                   <div className="shrink-0 mt-0.5">{item.icon}</div>
                   <div>
                     <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#E5CDA7] mb-1">{item.title}</p>
                     <p className="text-[13px] text-white/70 leading-snug max-w-[170px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.desc}</p>
                   </div>
                 </div>
                 {idx < arr.length - 1 && <div className="hidden lg:block w-[1px] h-8 bg-white/10"></div>}
               </div>
             ))}
          </div>

        </div>
      </section>

    </div>
  );
}
