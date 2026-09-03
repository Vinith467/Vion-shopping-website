import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Sparkles, Check, X, Calendar, Clock, User } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { useAppContext } from "../context/AppContext";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const ProductStackingSection = ({ product }) => {
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useAppContext();
  
  const isWishlisted = isInWishlist && isInWishlist(product.id);

  // Use product images
  const mediaUrls = (product.images || [product.image_url]).filter(Boolean);

  useEffect(() => {
    if (!mediaUrls || mediaUrls.length < 2) return;
    
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        }
      });

      imagesRef.current.forEach((img, i) => {
        if (i === 0) return; 
        
        gsap.set(img, { yPercent: 100 });
        
        tl.to(img, {
          yPercent: 0,
          ease: "none"
        });
      });
      
      tl.to({}, { duration: 0.25 });
      
    }, sectionRef);
    return () => ctx.revert();
  }, [product.id, mediaUrls.length]);

  if (!mediaUrls || mediaUrls.length === 0) return null;

  const sectionHeight = mediaUrls.length > 1 ? `${mediaUrls.length * 80}vh` : '100vh';

  return (
    <section ref={sectionRef} className="relative w-full border-b border-[#E8E1D7] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 " style={{ height: sectionHeight }}>
      <div className="sticky top-[60px] md:top-[90px] w-full h-[calc(100dvh-60px)] md:h-[calc(100dvh-90px)] overflow-hidden bg-[#FDFBF7] dark:bg-[#0A0A0A] flex flex-col lg:flex-row transition-colors duration-500 ">
        
        {/* Images (Top on mobile, Right on desktop) */}
        <div className="w-full h-[55vh] lg:h-full lg:flex-1 lg:w-7/12 relative z-10 p-4 pt-6 lg:p-6 flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0A0A0A] order-1 lg:order-2 transition-colors duration-500 ">
          <div 
            className="relative w-full h-full lg:aspect-[4/5] max-w-[min(100%,70vh)] overflow-hidden rounded-xl shadow-2xl bg-white dark:bg-[#151515]"
            style={{ 
              transform: 'translateZ(0)', 
              backfaceVisibility: 'hidden', 
              WebkitMaskImage: '-webkit-radial-gradient(white, black)' 
            }}
          >
            {mediaUrls.map((mediaUrl, i) => (
              <div 
                key={i}
                ref={el => { if (el) imagesRef.current[i] = el; }}
                className="absolute inset-0 w-full h-full will-change-transform origin-bottom bg-white dark:bg-[#151515]"
                style={{ zIndex: 10 + i }}
              >
                <img 
                  src={mediaUrl} 
                  alt={`${product.title || product.name} view ${i+1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info (Bottom on mobile, Left on desktop) */}
        <div className="w-full lg:w-5/12 flex-1 lg:h-full relative z-20 flex flex-col justify-start lg:justify-center px-6 pt-4 pb-24 lg:py-0 lg:pl-24 lg:pr-12 bg-[#FDFBF7] dark:bg-[#0A0A0A] order-2 lg:order-1 overflow-hidden transition-colors duration-500 ">
          
          <div className="flex-none">
            <h2 className="text-2xl md:text-5xl lg:text-[3.25rem] font-medium mb-2 lg:mb-4 leading-[1.1] text-[#1A0A08] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {product.title || product.name}
            </h2>
            
            <div className="mb-3 lg:mb-6"></div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-[50px] mb-4 pr-2">
            <p className="text-xs lg:text-base text-gray-600 dark:text-gray-400 font-sans font-light leading-relaxed whitespace-pre-wrap">
              {product.description ? product.description.replace(/###/g, '\n').replace(/[*]{2}/g, '') : "Discover how traditional tailoring techniques merge seamlessly with modern aesthetics to create a silhouette that defines effortless elegance."}
            </p>
          </div>
          
          <div className="flex-none flex flex-col gap-3 lg:gap-4">
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => window.dispatchEvent(new Event('openBookConsultantModal'))}
                className="w-full bg-[#1A1A1A] dark:bg-[#C49A5C] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#A87B45] dark:hover:bg-[#E5CDA7] dark:hover:text-[#1A0A08] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Book Your Stylist
              </button>
              <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                (This includes no charges for the booking of stylist)
              </p>
            </div>
            
            <button 
              onClick={() => toggleWishlist && toggleWishlist(product)}
              className="w-full bg-transparent border border-[#E8E1D7] dark:border-white/10 text-gray-600 dark:text-gray-400 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-white/5 dark:bg-[#151515]/5 transition-colors duration-500 transition-all flex items-center justify-center gap-2"
            >
              <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
              {isWishlisted ? "Saved" : "Wishlist"}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

const ProductShowcaseSection = ({ videoUrl, content }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const mediaContainerRef = useRef(null);
  const mediaElementRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  // CHANGED to useLayoutEffect
  useLayoutEffect(() => {
    if (!videoUrl) return;
    
    // CHANGED: Pass the containerRef as the scope right here
    let mm = gsap.matchMedia(containerRef);

    mm.add("(min-width: 768px)", () => {
        // Desktop Animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1, 
          }
        });

        gsap.set(mediaContainerRef.current, { width: "100%", height: "100vh", borderRadius: "0px", x: 0, y: 0, yPercent: -50 });
        gsap.set(contentRef.current, { opacity: 0, x: 50, y: 0 }); // Coming from the right

        tl.to(mediaContainerRef.current, {
          width: "45vw",
          height: "25.3vw", // Keeps cinematic width/height ratio roughly
          borderRadius: "16px",
          x: "5vw", // Move to the left (instead of x: "50vw" like hero)
          yPercent: -50,
          y: 0, // Center vertically
          ease: "power2.inOut",
          duration: 1
        }, 0)
        .to(mediaElementRef.current, { scale: 1.05, duration: 1, ease: "power2.inOut" }, 0)
        .to(overlayRef.current, { opacity: 0, y: -100, duration: 0.5, ease: "power2.in" }, 0)
        .to(contentRef.current, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 0.4);
      });

      mm.add("(max-width: 767px)", () => {
        // Mobile Animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1, 
          }
        });

        gsap.set(mediaContainerRef.current, { width: "100%", height: "100vh", borderRadius: "0px", x: 0, y: 0 });
        gsap.set(contentRef.current, { opacity: 0, x: 0, y: 50 });

        tl.to(mediaContainerRef.current, {
          width: "90vw", // Boxed width
          height: "45vh",
          borderRadius: "16px",
          x: "5vw",
          yPercent: -50,
          y: "-25vh", // Center in top half
          ease: "power2.inOut",
          duration: 1
        }, 0)
        .to(mediaElementRef.current, { scale: 1.05, duration: 1, ease: "power2.inOut" }, 0)
        .to(overlayRef.current, { opacity: 0, y: -50, duration: 0.5, ease: "power2.in" }, 0)
        .to(contentRef.current, { opacity: 1, y: "25vh", duration: 0.8, ease: "power2.out" }, 0.4); // Slide down into bottom half
      });

    return () => mm.revert();
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <div ref={containerRef} className="w-full h-[250vh] relative">
      <div ref={sectionRef} className="sticky top-0 w-full h-screen bg-[#FDFBF7] dark:bg-[#0A0A0A] overflow-hidden flex items-center transition-colors duration-500">
        
        {/* The Media Container (Starts Fullscreen, Shrinks to Left) */}
      <div 
        ref={mediaContainerRef} 
        className="absolute top-1/2 left-0 w-full h-full z-10 overflow-hidden shadow-2xl"
      >
        <video ref={mediaElementRef} src={videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
      </div>

      {/* Fullscreen Overlay Text (Fades out on scroll) */}
      <div 
        ref={overlayRef} 
        className="absolute inset-0 flex flex-col items-center justify-end z-20 text-white text-center px-6 pb-20 pointer-events-none"
      >
        <span className="text-[#A87B45] text-xs font-bold uppercase tracking-[0.4em] mb-4">
          {content?.overlay_subtitle || 'The Craftsmanship'}
        </span>
        <h1 className="text-4xl md:text-6xl mb-6 drop-shadow-2xl max-w-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
          {content?.overlay_title || 'Every Detail Tells a Story'}
        </h1>
        <div className="w-16 h-[2px] bg-white/30 dark:bg-[#151515]/30 transition-colors duration-500 mx-auto mb-10"></div>
        <div className="animate-bounce flex flex-col items-center">
           <span className="text-xs uppercase tracking-widest text-white/70 mb-2">Scroll for details</span>
           <div className="w-[1px] h-10 bg-[#A87B45]"></div>
        </div>
      </div>

      {/* The Text Content (Hidden initially, slides in on right) */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-30 flex h-full items-center justify-end pointer-events-none">
        <div ref={contentRef} className="w-full md:w-[45%] pointer-events-auto">
          <span className="text-[#A87B45] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
            {content?.content_subtitle || 'Exclusive Luxury'}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6 leading-tight text-[#1A0A08] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {content?.content_title || 'Uncompromising Details'}
          </h2>
          <div className="space-y-4 text-sm lg:text-base text-gray-600 dark:text-gray-400 font-sans font-light leading-relaxed">
            <p>
              {content?.desc1 || 'Experience the quiet luxury of our tailoring. From the structured shoulders to the precise check pattern, explore the intricate details that define our exclusive creations.'}
            </p>
            <p>
              {content?.desc2 || 'Every element, down to the small round lapel pin and fitted waist, reflects our commitment to perfection and timeless elegance.'}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, members, toggleWishlist, isInWishlist } = useAppContext();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isWishlisted = isInWishlist && product ? isInWishlist(product.id) : false;

  const cleanDescription = (text) => {
    if (!text) return "Discover how traditional tailoring techniques merge seamlessly with modern aesthetics to create a silhouette that defines effortless elegance.";
    return text.replace(/###|[*]{2,}/g, '').trim();
  };
  
  const [selectedFitMode, setSelectedFitMode] = useState("size");
  const [showStandardSizeModal, setShowStandardSizeModal] = useState(false);
  const [showBespokeFitModal, setShowBespokeFitModal] = useState(false);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);

  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const heroContainerRef = useRef(null); // ADD THIS REF
  const heroWrapperRef = useRef(null);
  const heroMediaContainerRef = useRef(null);
  const heroMediaElementRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const heroContentRefs = useRef([]);

  const primaryMember = members?.find(m => m.isPrimary) || null;
  const [profile, setProfile] = useState({
    gender: primaryMember?.gender || 'Female',
    size: primaryMember?.size || 'M',
    height: primaryMember?.height || 'Average',
    bodyShape: primaryMember?.bodyShape || 'Hourglass',
    skinTone: primaryMember?.skinTone || 'Medium'
  });

  useEffect(() => {
    if (primaryMember) {
      setProfile({
        gender: primaryMember.gender || 'Female',
        size: primaryMember.size || 'M',
        height: primaryMember.height || 'Average',
        bodyShape: primaryMember.bodyShape || 'Hourglass',
        skinTone: primaryMember.skinTone || 'Medium'
      });
    }
  }, [primaryMember]);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
      setIsLoading(false);
    }
    loadProduct();
  }, [id]);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
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

  useEffect(() => {
    if (product?.variations && product.variations.length > 0 && primaryMember) {
      const userHeightCm = parseInt(primaryMember.height) || 160;
      let heightRange = 'Average';
      if (userHeightCm < 160) heightRange = 'Short';
      if (userHeightCm > 170) heightRange = 'Tall';
      
      const userSkinTone = primaryMember.skinTone || 'Medium';
      const userSize = primaryMember.size || 'M';
      
      let bestMatchIndex = product.variations.findIndex(v => 
        (v.skinTone === userSkinTone || v.skinTone === 'all') && 
        (v.heightRange === heightRange || v.heightRange === 'all') &&
        (!v.size || v.size === userSize || v.size === 'all')
      );
      
      if (bestMatchIndex !== -1) {
        setActiveVariationIndex(bestMatchIndex);
      }
    }
  }, [product, primaryMember]);

  // Determine images based on active variation
  const activeVariation = product?.variations && product.variations[activeVariationIndex];
  let variationImages = [];
  if (activeVariation?.image_urls && activeVariation.image_urls.length > 0) {
    variationImages.push(...activeVariation.image_urls);
  } else if (activeVariation?.image_url) {
    variationImages.push(activeVariation.image_url);
  } else if (product) {
    if (product.images && product.images.length > 0) {
      variationImages.push(...product.images);
    } else if (product.image_url) {
      variationImages.push(...product.image_url.split(','));
    } else {
      variationImages.push('/images/placeholder.jpg');
    }
  }
  variationImages = variationImages.filter(Boolean);

  // Re-run GSAP pinning when variationImages change
  useEffect(() => {
    if (!product || variationImages.length === 0) return;
    
    // Clear the ref array to match the new image count
    cardsRef.current = cardsRef.current.slice(0, variationImages.length);

    let ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top " + (120 + i * 40) + "px",
          endTrigger: containerRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [product, activeVariationIndex, variationImages.length]);

  // CHANGED to useLayoutEffect
  useLayoutEffect(() => {
    if (isLoading || !product) return;
    
    // CHANGED: Pass heroContainerRef as scope
    let mm = gsap.matchMedia(heroContainerRef);

    mm.add("(min-width: 768px)", () => {
        // Desktop Animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1, 
          }
        });

        gsap.set(heroMediaContainerRef.current, { width: "100%", height: "100vh", borderRadius: "0px", x: 0, y: 0, yPercent: -50 });
        heroContentRefs.current.forEach(el => {
           if (el) gsap.set(el, { opacity: 0, x: -50, yPercent: -50, y: 0 });
        });

        tl.to(heroMediaContainerRef.current, {
          width: "45vw",
          height: "25.3vw",
          borderRadius: "16px",
          x: "50vw",
          yPercent: -50,
          y: 0,
          ease: "power2.inOut",
          duration: 1
        }, 0)
        .to(heroMediaElementRef.current, { scale: 1.05, duration: 1, ease: "power2.inOut" }, 0)
        .to(heroOverlayRef.current, { opacity: 0, y: -100, duration: 0.5, ease: "power2.in" }, 0);

        heroContentRefs.current.forEach((el, index) => {
          if (!el) return;
          const startTime = index * 1.5;
          
          tl.to(el, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "power2.out" }, startTime + 0.4);
          
          if (index < heroContentRefs.current.length - 1) {
             tl.to(el, { opacity: 0, y: "-20vh", duration: 0.6, ease: "power2.in" }, startTime + 1.8);
          }
        });
      });

      mm.add("(max-width: 767px)", () => {
        // Mobile Animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1, 
          }
        });

        gsap.set(heroMediaContainerRef.current, { width: "100%", height: "100vh", borderRadius: "0px", x: 0, y: 0, yPercent: -50 });
        heroContentRefs.current.forEach(el => {
           if (el) gsap.set(el, { opacity: 0, x: 0, yPercent: -50, y: "35vh" }); // Start lower to slide up
        });

        tl.to(heroMediaContainerRef.current, {
          width: "90vw",
          height: "45vh",
          borderRadius: "16px",
          x: "5vw",
          yPercent: -50,
          y: "-25vh", // Center in top half
          ease: "power2.inOut",
          duration: 1
        }, 0)
        .to(heroMediaElementRef.current, { scale: 1.05, duration: 1, ease: "power2.inOut" }, 0)
        .to(heroOverlayRef.current, { opacity: 0, y: -50, duration: 0.5, ease: "power2.in" }, 0);
        
        heroContentRefs.current.forEach((el, index) => {
          if (!el) return;
          const startTime = index * 1.5;
          
          // Move text to bottom half of the screen
          tl.to(el, { opacity: 1, y: "25vh", duration: 0.8, ease: "power2.out" }, startTime + 0.5);
          
          if (index < heroContentRefs.current.length - 1) {
             tl.to(el, { opacity: 0, y: "15vh", duration: 0.6, ease: "power2.in" }, startTime + 1.8);
          }
        });
      });

    return () => mm.revert();
  }, [isLoading, product]);

  const currentImage = product ? (product.images && product.images.length > 0 ? product.images[0] : (product.image_url ? product.image_url.split(',')[0] : '/images/placeholder.jpg')) : '/images/placeholder.jpg';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDFBF7] dark:bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A87B45]"></div>
      </div>
    );
  }

  const heroMedia = product.video_url || currentImage;
  const isVideo = heroMedia && (heroMedia.includes('.mp4') || heroMedia.includes('video'));

  // Calculate dynamic height for Hero container based on number of text blocks
  const heroBlocks = Array.isArray(product?.marketing_content?.hero) && product.marketing_content.hero.length > 0 
    ? product.marketing_content.hero 
    : [{ subtitle: 'The Design Story', title: product.name, desc1: '[Placeholder Text: This section will contain the narrative description of the garment, detailing its inspiration, the cut, and the craftsmanship that brings it to life. The user will provide the exact copy later.]', desc2: '[Placeholder Text: Discover how traditional tailoring techniques merge seamlessly with modern aesthetics to create a silhouette that defines effortless elegance.]' }];
  
  const heroContainerHeight = `${250 + (heroBlocks.length - 1) * 250}vh`;

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#0A0A0A] min-h-[100dvh] w-full font-sans pb-24 lg:pb-0 transition-colors duration-500 ">
      
      {/* ADDED WRAPPER HERE to protect React from GSAP's pin-spacer */}
      <div ref={heroContainerRef} className="w-full relative" style={{ height: heroContainerHeight }}>

        {/* Cinematic Hero Header with Scroll Animation */}
        <div ref={heroWrapperRef} className="sticky top-0 w-full h-screen bg-[#FDFBF7] dark:bg-[#0A0A0A] overflow-hidden flex items-center transition-colors duration-500 ">
        
        {/* Floating Action Buttons (Fixed on top of hero during pin) */}
        <div className="absolute top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-start pointer-events-none">
          <button onClick={() => navigate(-1)} className="p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full transition-colors shadow-sm pointer-events-auto">
            <ArrowLeft size={20} />
          </button>
          <button 
            onClick={() => toggleWishlist && toggleWishlist(product)}
            className={`p-3 rounded-full transition-colors backdrop-blur-md border border-white/20 shadow-sm pointer-events-auto ${isWishlisted ? 'bg-red-500/20 text-red-500' : 'bg-black/20 hover:bg-black/40 text-white'}`}
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* The Media Container (Starts Fullscreen, Shrinks to Right) */}
        <div 
          ref={heroMediaContainerRef} 
          className="absolute top-1/2 left-0 w-full h-full z-10 overflow-hidden shadow-2xl"
        >
          {isVideo ? (
             <video ref={heroMediaElementRef} src={heroMedia} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
             <img ref={heroMediaElementRef} src={heroMedia} alt={product.name} className="w-full h-full object-cover" />
          )}
          {/* Subtle gradient at the bottom to make initial text readable without graying out the whole video */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
        </div>

        {/* Fullscreen Overlay Text (Fades out on scroll) */}
        <div 
          ref={heroOverlayRef} 
          className="absolute inset-0 flex flex-col items-center justify-end z-20 text-white text-center px-6 pb-20 pointer-events-none"
        >
          <span className="text-[#A87B45] text-xs font-bold uppercase tracking-[0.4em] mb-4">
            {heroBlocks[0]?.subtitle || product.category?.name || 'VION Collection'}
          </span>
          <h1 className="text-4xl md:text-7xl mb-6 drop-shadow-2xl max-w-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            {heroBlocks[0]?.title || product.name}
          </h1>
          <div className="w-16 h-[2px] bg-white/30 dark:bg-[#151515]/30 transition-colors duration-500 mx-auto mb-10"></div>
          <div className="animate-bounce flex flex-col items-center">
             <span className="text-xs uppercase tracking-widest text-white/70 mb-2">Scroll to explore</span>
             <div className="w-[1px] h-10 bg-[#A87B45]"></div>
          </div>
        </div>

        {/* The Text Content Container (Hidden initially, slides in on left) */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-30 flex h-full items-center pointer-events-none">
          <div className="w-full md:w-[45%] h-full relative pointer-events-auto">
            {heroBlocks.map((block, index) => (
              <div 
                key={index} 
                ref={el => heroContentRefs.current[index] = el} 
                className="absolute top-1/2 w-full left-0 opacity-0"
              >
                <span className="text-[#A87B45] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                  {block.subtitle || 'The Design Story'}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6 leading-tight text-[#1A0A08] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {block.title || product.name}
                </h2>
                <div className="space-y-4 text-sm lg:text-base text-gray-600 dark:text-gray-400 font-sans font-light leading-relaxed">
                  {block.desc1 && <p>{block.desc1}</p>}
                  {block.desc2 && <p>{block.desc2}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div> {/* CLOSING WRAPPER DIV */}

      {/* Secondary Video Showcases */}
      {product.marketing_content?.showcases && product.marketing_content.showcases.length > 0 ? (
        product.marketing_content.showcases.map((showcase, index) => (
          <ProductShowcaseSection 
            key={index}
            videoUrl={product.secondary_video_url || 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-gray-suit-41973-large.mp4'} 
            content={showcase}
          />
        ))
      ) : (
        <ProductShowcaseSection 
          videoUrl={product.secondary_video_url || 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-gray-suit-41973-large.mp4'} 
          content={null}
        />
      )}

    </div>
  );
}
