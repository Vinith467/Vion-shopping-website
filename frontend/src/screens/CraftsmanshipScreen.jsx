import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const CRAFTSMANSHIP_DATA = [
  {
    id: "premium-materials",
    number: "01.",
    title: "PREMIUM MATERIALS",
    subtitle: "Sourced from the world's finest mills.",
    description: "Our fabrics are the foundation of our legacy. We travel the globe to source the rarest, most exquisite wools, silks, and cashmeres. Each thread is chosen for its unparalleled softness, durability, and drape, ensuring that every VION garment feels as exceptional as it looks. This meticulous selection process is the first step in our commitment to uncompromising quality.",
    images: [
      { src: "/images/craftsmanship/craft_01_hero.jpg", alt: "Premium suiting fabrics on a tailoring table", type: "hero" },
      { src: "/images/craftsmanship/craft_01_macro.jpg", alt: "Macro detail of fabric texture", type: "macro" },
      { src: "/images/craftsmanship/craft_01_selection.jpg", alt: "Clients selecting fabrics with a master tailor", type: "editorial" },
    ]
  },
  {
    id: "timeless-elegance",
    number: "02.",
    title: "TIMELESS ELEGANCE",
    subtitle: "Designed to be worn. Loved for a lifetime.",
    description: "VION designs transcend fleeting trends. We focus on clean lines, perfect proportions, and a silhouette that flatters the individual. Our aesthetic is one of sophisticated understatement, where true luxury is found in the subtle details and the confidence it instills in the wearer. A VION piece is not just for a season; it is an investment in enduring style.",
    images: [
      { src: "/images/craftsmanship/craft_02_hero.jpg", alt: "Elegant couple in bespoke formalwear", type: "hero" },
      { src: "/images/craftsmanship/craft_02_woman.jpg", alt: "Sophisticated woman in a tailored blazer", type: "portrait" },
      { src: "/images/craftsmanship/craft_02_man.jpg", alt: "Sophisticated man in a deep navy bespoke suit", type: "portrait" },
    ]
  },
  {
    id: "finest-craftsmanship",
    number: "03.",
    title: "FINEST CRAFTSMANSHIP",
    subtitle: "Handmade by master artisans, always.",
    description: "Every VION garment is a testament to the art of tailoring. Our master artisans employ time-honored techniques, dedicating countless hours to hand-stitching, pressing, and finishing each piece. From the precise cut of the lapel to the perfect roll of the shoulder, this dedication to handcraftsmanship ensures a fit and feel that machines simply cannot replicate.",
    images: [
      { src: "/images/craftsmanship/craft_03_hero.jpg", alt: "Tailor hand-stitching a lapel", type: "hero" },
      { src: "/images/craftsmanship/craft_03_cutting.jpg", alt: "Tailor cutting fabric", type: "editorial" },
      { src: "/images/craftsmanship/craft_03_details.jpg", alt: "Macro detail of hand-finished buttonhole", type: "macro" },
      { src: "/images/craftsmanship/craft_03_artisans.jpg", alt: "Artisans working in the atelier", type: "editorial" },
    ]
  },
  {
    id: "personalised-experience",
    number: "04.",
    title: "PERSONALISED EXPERIENCE",
    subtitle: "Crafted around you, in every detail.",
    description: "The VION bespoke experience is an intimate collaboration. We begin by understanding your lifestyle, preferences, and unique physique. Through a series of personalized fittings, we sculpt the garment to your exact measurements, making adjustments until it becomes a second skin. It is a journey of co-creation, resulting in a piece that is unmistakably yours.",
    images: [
      { src: "/images/craftsmanship/craft_04_hero.jpg", alt: "Stylist conducting a private consultation", type: "hero" },
      { src: "/images/craftsmanship/craft_04_measuring.jpg", alt: "Stylist measuring a client", type: "editorial" },
      { src: "/images/craftsmanship/craft_04_male_fitting.jpg", alt: "Male fitting session", type: "editorial" },
      { src: "/images/craftsmanship/craft_04_measuring.jpg", alt: "Female fitting session", type: "editorial" }, // Fallback for missing female fitting
    ]
  }
];

export default function CraftsmanshipScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const sectionRefs = useRef([]);
  const { scrollYProgress } = useScroll();
  const [craftsmanshipData, setCraftsmanshipData] = useState(CRAFTSMANSHIP_DATA);

  useEffect(() => {
    // Load dynamic data from admin panel if it exists
    const savedData = localStorage.getItem('vion_craftsmanship_content');
    if (savedData) {
      try {
        setCraftsmanshipData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved craftsmanship data");
      }
    }
  }, []);

  useEffect(() => {
    // Check if we need to scroll to a specific section based on navigation state
    if (location.state?.activeSection !== undefined) {
      const sectionIndex = location.state.activeSection;
      setTimeout(() => {
        sectionRefs.current[sectionIndex]?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // slight delay to ensure rendering
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.state]);

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="bg-[#F5F0E8] dark:bg-[#151515] transition-colors duration-500 min-h-screen text-[#1A1A1A] dark:text-[#F5F0E8] font-sans selection:bg-[#BFA679] selection:text-white pb-0">
      
      {/* Sticky Header Actions (if any specific ones needed besides global nav) */}
      <div className="fixed top-24 left-6 z-40 hidden md:block">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 backdrop-blur-md border border-white/80 shadow-sm flex items-center justify-center hover:bg-white dark:bg-[#151515] transition-colors duration-500 transition-all text-[#1A1A1A] dark:text-[#F5F0E8]"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Intro Hero */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
           <img 
             src="/images/craftsmanship/craft_04_hero.jpg" 
             alt="Vion Craftsmanship" 
             className="w-full h-full object-cover object-center opacity-40 grayscale-[20%]" 
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0E8] dark:from-[#151515] transition-colors duration-500 via-transparent to-[#F5F0E8] dark:to-[#151515] transition-colors duration-500 "></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B6544] mb-4">THE ART OF ITALIAN TAILORING</h4>
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-[1.1]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
              The Finest Italian Fabrics.<br />
              <span className="italic text-[#8B6544] font-medium">Crafted to Perfection.</span>
            </h1>
            <p className="text-sm md:text-base text-[#444] max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
              Every piece begins with a story. Yours. From fabric to final stitch, discover the uncompromising dedication behind every VION creation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Sections */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pb-32">
        {craftsmanshipData.map((section, idx) => (
          <section 
            key={section.id} 
            id={section.id}
            ref={(el) => (sectionRefs.current[idx] = el)}
            className="pt-24 pb-20 border-b border-[#A87B45]/20 last:border-0"
          >
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
              
              {/* Text Content - Sticky on Desktop */}
              <div className="w-full lg:w-[35%] lg:sticky lg:top-32 h-fit">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                >
                  <span className="text-[#A87B45] text-5xl md:text-6xl mb-4 block" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{section.number}</span>
                  <h2 className="text-3xl md:text-4xl uppercase tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{section.title}</h2>
                  <h3 className="text-lg md:text-xl text-[#8B6544] mb-6 italic" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{section.subtitle}</h3>
                  <p className="text-base text-[#333] dark:text-gray-300 leading-[1.8]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                    {section.description}
                  </p>
                </motion.div>
              </div>
              
              {/* Images Grid */}
              <div className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {section.images.map((img, imgIdx) => (
                  <motion.div 
                    key={imgIdx}
                    className={`relative overflow-hidden rounded-xl shadow-lg group ${img.type === 'hero' ? 'md:col-span-2 aspect-[16/9]' : img.type === 'portrait' ? 'aspect-[4/5]' : 'aspect-square md:aspect-[4/3]'}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: imgIdx * 0.15 }}
                  >
                    <img 
                      src={img.src} 
                      alt={img.alt} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                    />
                    {/* Optional subtle overlay for luxury feel */}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 "></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Signature CTA Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
         <img 
           src="/images/craftsmanship/craft_04_hero.jpg" // Using craft_04_hero as fallback for CTA
           alt="Made Around You" 
           className="absolute inset-0 w-full h-full object-cover object-top"
         />
         <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="relative z-10 text-center px-6"
         >
            <h2 className="text-5xl md:text-7xl text-white mb-6 uppercase tracking-wider drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
              Made Around You
            </h2>
            <div className="w-16 h-[1px] bg-[#C49A5C] mx-auto mb-8"></div>
            <p className="text-white/95 text-lg md:text-xl max-w-xl mx-auto mb-10 drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Experience the pinnacle of bespoke tailoring. Book a consultation with our master stylists today.
            </p>
            <button 
              onClick={() => navigate('/onboarding')}
              className="px-8 py-4 bg-[#C49A5C] hover:bg-[#A87B45] cursor-pointer text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Book a Consultation
            </button>
         </motion.div>
      </section>

    </div>
  );
}
