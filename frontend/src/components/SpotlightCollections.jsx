import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppContext } from '../context/AppContext';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true }); // Prevent blinking on mobile when address bar hides/shows

// Sub-component for each product's stacking section
const ProductStackingSection = ({ product, index }) => {
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);
  const navigate = useNavigate();

  // Prefer spotlight_images (the 5 slots uploaded in Admin), fallback to first 5 main images
  let mediaUrls = (product.spotlight_images && product.spotlight_images.length > 0)
    ? product.spotlight_images.slice(0, 5)
    : (product.images || [product.image_url]).filter(Boolean).slice(0, 5);

  if (product.video_url) {
    mediaUrls = [product.video_url, ...mediaUrls.slice(0, 4)];
  }

  useEffect(() => {
    if (!mediaUrls || mediaUrls.length < 2) return;
    
    let ctx = gsap.context(() => {
      // Create a timeline scrubbed by scrolling the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5, // Reduced from 1 to 0.5 for tighter tracking
        }
      });

      imagesRef.current.forEach((img, i) => {
        if (i === 0) return; // First image is base, already visible
        
        // Start below the container
        gsap.set(img, { yPercent: 100 });
        
        // Slide up to cover
        tl.to(img, {
          yPercent: 0,
          ease: "none" // Linear ease is best for scrubbing
        });
      });
      
      // Add a small pause at the end so the final image can fully settle before the section unpins
      tl.to({}, { duration: 0.25 });
      
    }, sectionRef);
    return () => ctx.revert();
  }, [product.id, mediaUrls.length]);

  if (!mediaUrls || mediaUrls.length === 0) return null;

  // Height determines how long the scroll lasts.
  // 1 image = 100vh. 5 images = 500vh.
  const sectionHeight = mediaUrls.length > 1 ? `${mediaUrls.length * 80}vh` : '100vh';
  const isReversed = index % 2 !== 0;

  return (
    <section ref={sectionRef} className="relative w-full border-b border-[#E8E1D7] bg-[#FDFBF7]" style={{ height: sectionHeight }}>
      <div className={`sticky top-[90px] w-full h-[calc(100dvh-90px)] overflow-hidden bg-[#FDFBF7] flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
        
        {/* Product Info */}
        <div className={`w-full lg:w-5/12 h-auto lg:h-full relative z-20 flex flex-col justify-center px-6 pt-10 pb-4 lg:py-0 ${isReversed ? 'lg:pl-12 lg:pr-24' : 'lg:pl-24 lg:pr-12'} bg-[#FDFBF7]`}>
          <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#A87B45] mb-4">
            {product.category?.name || 'VION Collection'}
          </h3>
          <h2 
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-4xl md:text-5xl lg:text-[3.25rem] font-medium mb-8 leading-[1.1] text-[#1A0A08] cursor-pointer hover:text-[#986427] transition-colors" 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.title}
          </h2>
          
          <Link 
            to={`/product/${product.id}`}
            className="group inline-flex items-center justify-center bg-[#1A1A1A] text-white px-8 md:px-10 py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#A87B45] transition-all duration-300 w-max overflow-hidden relative shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-4">
              Discover
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Images */}
        <div className={`w-full lg:w-7/12 relative z-10 p-2 pb-12 lg:p-6 flex items-center ${isReversed ? 'lg:justify-start' : 'lg:justify-end'} bg-[#FDFBF7]`}>
          {/* 1:1 Aspect Ratio Container */}
          <div 
            className="relative w-full max-w-[min(100%,78vh)] aspect-square overflow-hidden rounded-xl shadow-2xl bg-white"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {mediaUrls.map((mediaUrl, i) => {
              const isVideo = mediaUrl && (mediaUrl.includes('.mp4') || mediaUrl.includes('video'));
              return (
                <div 
                  key={i}
                  ref={el => { if (el) imagesRef.current[i] = el; }}
                  className="absolute inset-0 w-full h-full cursor-pointer will-change-transform origin-bottom"
                  style={{ zIndex: 10 + i }}
                >
                  {isVideo ? (
                    <video 
                      src={mediaUrl} 
                      autoPlay muted loop playsInline 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                    />
                  ) : (
                    <img 
                      src={mediaUrl} 
                      alt={`${product.title} view ${i+1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                    />
                  )}
                  <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500"></div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default function SpotlightCollections({ products, categoryName }) {
  const containerRef = useRef(null);

  // A premium fashion placeholder image for the collection hero to prevent 403 video errors
  const heroImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop";

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let ctx = gsap.context(() => {
      // Hero Video Parallax
      gsap.to('.hero-video-wrapper', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: '.hero-container',
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Fade up text elements as they scroll into view
      gsap.utils.toArray('.fade-up').forEach((elem) => {
        gsap.from(elem, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [products]);

  if (!products || products.length === 0) return null;

  return (
    <div ref={containerRef} className="w-full bg-[#FAFAFA]">
      
      {/* Cinematic Hero Image Section */}
      <div className="hero-container relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-black">
        <div className="hero-video-wrapper absolute inset-0 w-full h-[120%] -top-[10%]">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src={heroImage} 
            alt="Collection Hero"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white text-center px-6 fade-up">
          <span className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-5">
            Discover The Look
          </span>
          <h1 className="text-5xl md:text-8xl mb-8 drop-shadow-2xl text-white" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            {categoryName || 'The Collection'}
          </h1>
          <div className="w-16 h-[2px] bg-[#A87B45] mx-auto mb-6"></div>
          <p className="max-w-xl mx-auto text-white/90 text-sm md:text-base font-light tracking-wide leading-relaxed">
            Explore our curated selection of masterful designs. Each piece tells a story of global inspiration and Indian craftsmanship.
          </p>
        </div>
      </div>

      {/* Intro Header */}
      <div className="w-full py-24 text-center bg-[#FDFBF7]">
        <h2 className="text-3xl md:text-4xl text-[#1A0A08] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
          The Editorial Lookbook
        </h2>
        <p className="text-gray-500 uppercase tracking-widest text-[11px] font-bold max-w-lg mx-auto leading-relaxed">
          Scroll to explore the stories behind the silhouettes
        </p>
      </div>

      {/* Map through products, rendering a Stacking Section for each */}
      <div className="products-container bg-[#FDFBF7]">
        {products.map((product, productIndex) => (
          <ProductStackingSection key={product.id} product={product} index={productIndex} />
        ))}
      </div>

    </div>
  );
}
