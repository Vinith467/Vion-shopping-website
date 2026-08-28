import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Sparkles, Check, X, Calendar, Clock, User } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { useAppContext } from "../context/AppContext";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, members, toggleWishlist, isInWishlist } = useAppContext();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedFitMode, setSelectedFitMode] = useState("size");
  const [showStandardSizeModal, setShowStandardSizeModal] = useState(false);
  const [showBespokeFitModal, setShowBespokeFitModal] = useState(false);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);

  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const heroWrapperRef = useRef(null);
  const heroMediaContainerRef = useRef(null);
  const heroMediaElementRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const heroContentRef = useRef(null);

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

  // Hero Scroll Animation
  useEffect(() => {
    if (isLoading || !product) return;
    
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroWrapperRef.current,
          start: "top top",
          end: "+=150%", // Pin for 1.5x screen height
          pin: true,
          scrub: 1, 
        }
      });

      // 1. Initial State
      gsap.set(heroMediaContainerRef.current, { width: "100%", height: "100vh", borderRadius: "0px", x: 0 });
      gsap.set(heroContentRef.current, { opacity: 0, x: -50 });

      // 2. Animation sequence
      tl.to(heroMediaContainerRef.current, {
        width: "45vw",
        height: "25.3vw", // approx 16:9 ratio for 45vw width
        borderRadius: "16px",
        x: "50vw", // Move to right half of screen
        ease: "power2.inOut",
        duration: 1
      }, 0)
      .to(heroMediaElementRef.current, {
        scale: 1.05,
        duration: 1,
        ease: "power2.inOut"
      }, 0)
      .to(heroOverlayRef.current, {
        opacity: 0,
        y: -100,
        duration: 0.5,
        ease: "power2.in"
      }, 0)
      .to(heroContentRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.4);
    });

    return () => ctx.revert();
  }, [isLoading, product]);

  if (isLoading || !product) {
    return <div className="min-h-screen flex items-center justify-center bg-[#111] text-[#E8DFD8]">Loading...</div>;
  }

  const currentImage = variationImages[0] || '/images/placeholder.jpg';
  const price = parseFloat(product.price);
  const compareAtPrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
  const isWishlisted = isInWishlist && isInWishlist(product.id);

  const heroMedia = product.video_url || currentImage;
  const isVideo = heroMedia && (heroMedia.includes('.mp4') || heroMedia.includes('video'));

  return (
    <div className="bg-[#FDFBF7] min-h-[100dvh] w-full font-sans pb-24 lg:pb-0">
      
      {/* Cinematic Hero Header with Scroll Animation */}
      <div ref={heroWrapperRef} className="relative w-full h-screen bg-[#FDFBF7] overflow-hidden flex items-center">
        
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
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full z-10 overflow-hidden shadow-2xl"
        >
          {isVideo ? (
             <video ref={heroMediaElementRef} src={heroMedia} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
             <img ref={heroMediaElementRef} src={heroMedia} alt={product.name} className="w-full h-full object-cover" />
          )}
          {/* Dark gradient to make initial text readable */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Fullscreen Overlay Text (Fades out on scroll) */}
        <div 
          ref={heroOverlayRef} 
          className="absolute inset-0 flex flex-col items-center justify-end z-20 text-white text-center px-6 pb-20 pointer-events-none"
        >
          <span className="text-[#A87B45] text-xs font-bold uppercase tracking-[0.4em] mb-4">
            {product.category?.name || 'VION Collection'}
          </span>
          <h1 className="text-4xl md:text-7xl mb-6 drop-shadow-2xl max-w-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>
            {product.name}
          </h1>
          <div className="w-16 h-[2px] bg-white/30 mx-auto mb-10"></div>
          <div className="animate-bounce flex flex-col items-center">
             <span className="text-xs uppercase tracking-widest text-white/70 mb-2">Scroll to explore</span>
             <div className="w-[1px] h-10 bg-[#A87B45]"></div>
          </div>
        </div>

        {/* The Text Content (Hidden initially, slides in on left) */}
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-30 flex h-full items-center pointer-events-none">
          <div ref={heroContentRef} className="w-full md:w-[45%] pointer-events-auto">
            <span className="text-[#A87B45] text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
              The Design Story
            </span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-6 leading-tight text-[#1A0A08]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {product.name}
            </h2>
            <div className="space-y-4 text-sm lg:text-base text-gray-600 font-sans font-light leading-relaxed">
              <p>
                [Placeholder Text: This section will contain the narrative description of the garment, detailing its inspiration, the cut, and the craftsmanship that brings it to life. The user will provide the exact copy later.]
              </p>
              <p>
                [Placeholder Text: Discover how traditional tailoring techniques merge seamlessly with modern aesthetics to create a silhouette that defines effortless elegance.]
              </p>
            </div>
          </div>
        </div>

      </div>


    </div>
  );
}
