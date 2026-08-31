import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Sparkles, Check, ArrowRight, X, Calendar, Clock, MapPin, User } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { useAppContext } from "../context/AppContext";

export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, members, toggleWishlist, isInWishlist } = useAppContext();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFitMode, setSelectedFitMode] = useState("size");
  const [showStandardSizeModal, setShowStandardSizeModal] = useState(false);
  const [showBespokeFitModal, setShowBespokeFitModal] = useState(false);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);

  // We map the primary member to profile to reuse the design logic easily
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

  if (isLoading || !product) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] dark:bg-[#151515] transition-colors duration-500 ">Loading...</div>;
  }

  const activeVariation = product.variations && product.variations[activeVariationIndex];
  
  // Combine image_urls array with fallback image_url
  let variationImages = [];
  if (activeVariation?.image_urls && activeVariation.image_urls.length > 0) {
    variationImages.push(...activeVariation.image_urls);
  } else if (activeVariation?.image_url) {
    variationImages.push(activeVariation.image_url);
  } else {
    if (product.images && product.images.length > 0) {
      variationImages.push(...product.images);
    } else if (product.image_url) {
      variationImages.push(...product.image_url.split(','));
    } else {
      variationImages.push('/images/placeholder.jpg');
    }
  }
  variationImages = variationImages.filter(Boolean);

  const currentImage = variationImages[activeImageIndex] || variationImages[0];
  const price = parseFloat(product.price);
  const compareAtPrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
  const isWishlisted = isInWishlist && isInWishlist(product.id);

  return (
    <div className="bg-[#F5F0E8] dark:bg-[#151515] transition-colors duration-500 min-h-[100dvh] w-full font-sans pb-24 lg:pb-0">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="sticky top-0 z-40 bg-[#F5F0E8]/95 dark:bg-[#151515]/95 transition-colors duration-500 backdrop-blur-md pt-4 lg:pt-6 pb-4 mb-4 flex items-center gap-4 -mx-4 px-4 md:-mx-8 md:px-8">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 hover:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 backdrop-blur-md border border-white/50 text-[#1A0A08] dark:text-[#F5F0E8] rounded-full transition-colors shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-4xl font-serif text-[#1A0A08] dark:text-[#F5F0E8]">Product Details</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-12 lg:mb-16 lg:items-start">
            {/* LEFT COLUMN: Gallery */}
            <div className="flex flex-col gap-4 w-full lg:w-[42%] xl:w-[45%] lg:sticky lg:top-24 lg:h-max">
              <div className="flex gap-4">
                <div className="flex flex-col gap-3 w-16 xl:w-20 shrink-0 hidden sm:flex">
                  {variationImages.slice(0, 5).map((img, idx) => (
                    <div key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-full aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === idx ? 'border-[#986427]' : 'border-transparent hover:border-[#986427]/50'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 rounded-2xl overflow-hidden relative h-auto flex items-start justify-center group shadow-sm border border-gray-100">
                  <img src={currentImage} alt={product.name} className="w-full h-auto mix-blend-multiply" />
                  <button 
                    onClick={() => toggleWishlist && toggleWishlist(product)}
                    className={`absolute top-4 right-4 p-2.5 rounded-full transition-colors shadow-sm backdrop-blur-md ${isWishlisted ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 hover:bg-white dark:bg-[#151515] transition-colors duration-500 text-[#1A0A08] dark:text-[#F5F0E8] hover:text-red-500'}`}
                  >
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
              {variationImages.length > 5 && (
                <div className="flex gap-4 hidden sm:flex">
                  {variationImages.slice(5, 11).map((img, idx) => {
                    const actualIdx = idx + 5;
                    return (
                      <div key={actualIdx} onClick={() => setActiveImageIndex(actualIdx)} className={`w-16 xl:w-20 aspect-square shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === actualIdx ? 'border-[#986427]' : 'border-transparent hover:border-[#986427]/50'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Details & Actions */}
            <div className="flex-1 flex flex-col pt-2 lg:pr-4">
              
              <div className="mb-6">
                <div className="mb-3">
                  <span className="bg-[#f0e6dd] text-[#986427] text-[9px] font-extrabold px-2.5 py-1 rounded-sm tracking-widest uppercase shadow-sm">Bestseller</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1A0A08] dark:text-[#F5F0E8] leading-tight mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</h2>
                
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex text-[#986427] gap-0.5">
                    {'★★★★☆'.split('').map((star, i) => <span key={i} className="text-[14px]">{star}</span>)}
                  </div>
                  <span className="text-[11px] text-gray-500 font-bold underline cursor-pointer hover:text-[#1A0A08] dark:text-[#F5F0E8] transition-colors">128 Reviews</span>
                </div>
                
                <div className="flex items-baseline gap-2.5 mb-1.5">
                  <span className="text-2xl text-[#1A0A08] dark:text-[#F5F0E8] font-bold font-sans tracking-tight">
                    ₹ {price.toLocaleString()}
                  </span>
                  {compareAtPrice > price && (
                    <>
                      <span className="text-sm text-gray-400 font-medium line-through font-sans">
                        ₹ {compareAtPrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-[#986427] bg-[#f0e6dd] px-2 py-0.5 rounded-sm tracking-wide ml-1 font-sans">
                        {Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                  Inclusive of all taxes
                </div>
              </div>

              <div className="space-y-6">
                {/* Colors */}
                {(() => {
                  const uniqueColors = Array.from(new Set(
                    (product.variations || [])
                      .map(v => v.color)
                      .filter(c => c && c.trim() !== '')
                  ));
                  
                  if (uniqueColors.length > 0) {
                    return (
                      <div className="mb-2">
                        <span className="text-[11px] font-bold text-[#1A0A08] dark:text-[#F5F0E8] block mb-3 uppercase tracking-wide">Color</span>
                        <div className="flex gap-2 flex-wrap">
                          {uniqueColors.map((color, idx) => {
                             const isSelected = activeVariation?.color === color || (!activeVariation?.color && idx===0);
                             return (
                                <button key={idx} onClick={() => {
                                   const newIndex = product.variations.findIndex(v => v.color === color);
                                   if (newIndex !== -1) setActiveVariationIndex(newIndex);
                                }} title={color} className={`px-5 py-2 rounded-md border-2 text-[11px] font-bold transition-all shadow-sm ${isSelected ? 'border-[#986427] text-[#986427] bg-[#986427]/10' : 'border-white/60 text-gray-600 bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 backdrop-blur-sm hover:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 hover:border-[#986427]/30'}`}>
                                  {color}
                                </button>
                             );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Fit Options */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold text-[#1A0A08] dark:text-[#F5F0E8] uppercase tracking-wide">Select Fit & Size</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => setShowStandardSizeModal(true)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selectedFitMode === 'size' ? 'border-[#986427] bg-[#986427]/10 text-[#986427]' : 'border-white/60 bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 backdrop-blur-sm text-[#1A0A08] dark:text-[#F5F0E8] hover:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 hover:border-[#986427]/30'}`}
                    >
                      <span className="text-[12px] font-bold">Standard Size</span>
                      <span className="text-[9px] opacity-70 font-medium mt-0.5">Pick from S, M, L, XL</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowBespokeFitModal(true)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selectedFitMode === 'expert' ? 'border-[#986427] bg-[#986427]/10 text-[#986427]' : 'border-white/60 bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 backdrop-blur-sm text-[#1A0A08] dark:text-[#F5F0E8] hover:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 hover:border-[#986427]/30'}`}
                    >
                      <span className="text-[12px] font-bold">Book Our Expert</span>
                      <span className="text-[9px] opacity-70 font-medium mt-0.5">We measure you</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F5F0E8]/90 dark:bg-[#151515]/90 transition-colors duration-500 backdrop-blur-md border-t border-gray-200/50 p-4 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] lg:static lg:p-0 lg:border-none lg:shadow-none lg:bg-transparent lg:pt-2 -mx-4 md:-mx-8 px-4 md:px-8 lg:mx-0">
                  <button 
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        title: product.name,
                        price: price.toString(),
                        images: [currentImage],
                        fitMode: selectedFitMode,
                        size_top: profile.size,
                        size_bottom: profile.size
                      }, profile.size);
                      navigate('/cart');
                    }}
                    className="flex-1 bg-[#1A0A08] hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2.5 text-[13px] tracking-wide"
                  >
                    <ShoppingBag size={16} /> Add to Bag
                  </button>
                  <button onClick={() => toggleWishlist && toggleWishlist(product)} className="flex-1 bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 backdrop-blur-md hover:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 border border-white/60 text-[#1A0A08] dark:text-[#F5F0E8] py-4 rounded-xl font-bold transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_6px_16px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2.5 text-[13px] tracking-wide">
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} /> Wishlist
                  </button>
                </div>

                <div className="pt-8 space-y-6 lg:pb-8">
                  {/* Why it suits you */}
                  <div className="bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.05)]">
                    <h4 className="font-bold text-[13px] text-[#1A0A08] dark:text-[#F5F0E8] mb-4 uppercase tracking-wide">Why it suits you</h4>
                    {product.suitability_points && product.suitability_points.filter(p => p.trim()).length > 0 ? (
                      <ul className="space-y-3 text-xs text-gray-700 font-medium">
                        {product.suitability_points.filter(p => p.trim()).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check size={14} className="text-[#986427] shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : primaryMember ? (
                      <ul className="space-y-3 text-xs text-gray-700 font-medium">
                        <li className="flex items-start gap-2.5">
                          <Check size={14} className="text-[#986427] shrink-0 mt-0.5" />
                          <span>Flattering for your <strong className="text-[#1A0A08] dark:text-[#F5F0E8]">{profile.bodyShape || 'Hourglass'}</strong> body shape</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <Check size={14} className="text-[#986427] shrink-0 mt-0.5" />
                          <span>Perfect for your <strong className="text-[#1A0A08] dark:text-[#F5F0E8]">{profile.height}</strong> height</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <Check size={14} className="text-[#986427] shrink-0 mt-0.5" />
                          <span>Colors that complement your <strong className="text-[#1A0A08] dark:text-[#F5F0E8]">{profile.skinTone || 'complexion'}</strong></span>
                        </li>
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        Log in and set up your Bespoke Profile to see personalized fit and styling recommendations just for you.
                      </p>
                    )}
                    <button className="text-[10px] font-bold text-gray-500 underline mt-4 hover:text-[#1A0A08] dark:text-[#F5F0E8] transition-colors">View Details</button>
                  </div>

                  {/* Our Services */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-[13px] text-[#1A0A08] dark:text-[#F5F0E8] uppercase tracking-wide">Our Services</h3>
                      <span className="text-[10px] font-bold text-gray-500 cursor-pointer flex items-center hover:text-[#1A0A08] dark:text-[#F5F0E8] transition-colors">Explore all services <ArrowRight size={10} className="ml-0.5"/></span>
                    </div>
                    <div className="bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 backdrop-blur-md rounded-2xl border border-white/60 divide-y divide-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.05)]">
                      <div className="p-3.5 flex gap-3.5 items-start group">
                        <div className="w-8 h-8 rounded-full bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 backdrop-blur-sm text-[#986427] flex items-center justify-center shrink-0 border border-white/80 shadow-sm group-hover:scale-105 transition-transform"><User size={14}/></div>
                        <div>
                          <h4 className="text-[13px] font-bold text-[#1A0A08] dark:text-[#F5F0E8] mb-1">Standard Fit</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed">Affordable styles for everyday you.<br/>Give size or measurements.</p>
                        </div>
                      </div>
                      <div className="p-3.5 flex gap-3.5 items-start group">
                        <div className="w-8 h-8 rounded-full bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 backdrop-blur-sm text-[#986427] flex items-center justify-center shrink-0 border border-white/80 shadow-sm group-hover:scale-105 transition-transform"><User size={14}/><User size={14} className="-ml-1.5"/></div>
                        <div>
                          <h4 className="text-[13px] font-bold text-[#1A0A08] dark:text-[#F5F0E8] mb-1">Tailored Fit</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed">Perfect fit guaranteed.<br/>We send an expert for measurements.</p>
                        </div>
                      </div>
                      <div className="p-3.5 flex gap-3.5 items-start group">
                        <div className="w-8 h-8 rounded-full bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 backdrop-blur-sm text-[#986427] flex items-center justify-center shrink-0 border border-white/80 shadow-sm group-hover:scale-105 transition-transform"><Sparkles size={14}/></div>
                        <div>
                          <h4 className="text-[13px] font-bold text-[#1A0A08] dark:text-[#F5F0E8] mb-1">Book A Stylist</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed">Personal shopper. Curated just for you.<br/>Style, fit & delivery - we handle it all.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Description */}
                  <div className="pt-4 mt-6">
                    <h3 className="font-bold text-[13px] text-[#1A0A08] dark:text-[#F5F0E8] uppercase tracking-wide mb-3">Product Details</h3>
                    <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{product.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Standard Size Modal */}
      {showStandardSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowStandardSizeModal(false)}></div>
          <div className="relative w-full max-w-sm bg-[#E8DFD8] border border-white/40 shadow-2xl rounded-3xl p-8 animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowStandardSizeModal(false)} className="absolute top-4 right-4 text-[#1A0A08] dark:text-[#F5F0E8] hover:opacity-70"><X size={20} /></button>
            <h3 className="text-2xl font-bold text-[#1A0A08] dark:text-[#F5F0E8] mb-6 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Select Standard Size
            </h3>
            
            <div className="space-y-6">
              {(() => {
                const SIZES_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];
                const sortSizes = (sizes) => sizes.sort((a, b) => SIZES_ORDER.indexOf(a) - SIZES_ORDER.indexOf(b));
                
                const uniqueTopSizes = Array.from(new Set(
                  (product?.variations || [])
                    .flatMap(v => {
                       let sizes = [];
                       if (Array.isArray(v.size_top)) sizes.push(...v.size_top);
                       else if (v.size_top) sizes.push(v.size_top);
                       if (Array.isArray(v.size)) sizes.push(...v.size);
                       else if (v.size) sizes.push(v.size);
                       return sizes;
                    })
                    .filter(s => s && s !== 'all')
                ));
                const displayTopSizes = uniqueTopSizes.length > 0 ? sortSizes(uniqueTopSizes) : ['S', 'M', 'L', 'XL', 'XXL'];

                const uniqueBottomSizes = Array.from(new Set(
                  (product?.variations || [])
                    .flatMap(v => {
                       let sizes = [];
                       if (Array.isArray(v.size_bottom)) sizes.push(...v.size_bottom);
                       else if (v.size_bottom) sizes.push(v.size_bottom);
                       if (Array.isArray(v.size)) sizes.push(...v.size);
                       else if (v.size) sizes.push(v.size);
                       return sizes;
                    })
                    .filter(s => s && s !== 'all')
                ));
                const displayBottomSizes = uniqueBottomSizes.length > 0 ? sortSizes(uniqueBottomSizes) : displayTopSizes;

                // Handle size group pre-selection
                import('../utils/sizeGroups').then(({ getSizeGroupArray }) => {
                  const groupSizes = getSizeGroupArray(primaryMember?.size || '');
                  if (!displayTopSizes.includes(profile.size)) {
                    const match = displayTopSizes.find(s => groupSizes.includes(s));
                    if (match && profile.size !== match) {
                      setProfile(prev => ({ ...prev, size: match }));
                    } else if (displayTopSizes.length > 0 && profile.size !== displayTopSizes[0] && !match) {
                      setProfile(prev => ({ ...prev, size: displayTopSizes[0] }));
                    }
                  }
                });

                return (
                  <>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-bold text-[#1A0A08] dark:text-[#F5F0E8] uppercase tracking-wide">Size (Top)</span>
                        <span className="text-[9px] font-bold text-gray-500 hover:text-[#986427] cursor-pointer transition-colors underline">Guide</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {displayTopSizes.map(s => (
                          <button 
                            key={s} 
                            onClick={() => setProfile({...profile, size: s})}
                            className={`min-w-[48px] h-[40px] flex items-center justify-center border-2 font-bold text-[13px] rounded-md shadow-sm transition-all ${profile.size === s ? 'border-[#986427] bg-[#986427]/10 text-[#986427]' : 'border-white/60 bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 text-gray-700 hover:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 hover:border-[#986427]/30'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-bold text-[#1A0A08] dark:text-[#F5F0E8] uppercase tracking-wide">Size (Bottom)</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {displayBottomSizes.map(s => (
                          <button 
                            key={s}
                            onClick={() => setProfile({...profile, size: s})} 
                            className={`min-w-[48px] h-[40px] flex items-center justify-center border-2 font-bold text-[13px] rounded-md shadow-sm transition-all ${profile.size === s ? 'border-[#986427] bg-[#986427]/10 text-[#986427]' : 'border-white/60 bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 text-gray-700 hover:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 hover:border-[#986427]/30'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}

              <button 
                onClick={() => {
                  setSelectedFitMode('size');
                  setShowStandardSizeModal(false);
                }}
                className="w-full mt-2 bg-gradient-to-b from-[#3A2419] to-[#1A0A08] text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_12px_rgba(26,10,8,0.3)] hover:from-[#4A3022] hover:to-[#240E0C]"
              >
                Confirm Sizes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Our Expert Modal */}
      {showBespokeFitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setShowBespokeFitModal(false)}></div>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto md:overflow-hidden bg-[#E8DFD8] border border-white/40 shadow-2xl rounded-3xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowBespokeFitModal(false)} className="absolute top-4 right-4 z-10 p-2 bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 rounded-full text-[#1A0A08] dark:text-[#F5F0E8] hover:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors"><X size={20} /></button>
            
            {/* Left Column: Image */}
            <div className="w-full md:w-1/2 bg-[#F9F7F5] flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-200">
              <img 
                src={profile.gender === 'Male' ? '/images/mens_measurement_guide.png' : '/images/womens_measurement_guide.png'} 
                alt="Measurement Guide" 
                className="w-full h-auto max-h-[500px] object-contain mix-blend-multiply"
              />
            </div>
            
            {/* Right Column: Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-2">
                <span className="bg-[#f0e6dd] text-[#986427] text-[10px] font-extrabold px-2.5 py-1 rounded-sm tracking-widest uppercase shadow-sm">Premium Service</span>
              </div>
              <h3 className="text-3xl font-bold text-[#1A0A08] dark:text-[#F5F0E8] mb-3 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Book Our Expert
              </h3>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                Our tailoring expert will visit you to take exact measurements for a flawless bespoke fit. Please select a convenient time and location.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-wider uppercase text-[#1A0A08]/70 dark:text-[#F5F0E8]/70 mb-2">Date</label>
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 border border-white/60 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors shadow-inner">
                      <Calendar size={16} className="text-[#986427]" />
                      <input type="date" className="text-[13px] w-full focus:outline-none text-[#1A0A08] dark:text-[#F5F0E8] font-bold bg-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold tracking-wider uppercase text-[#1A0A08]/70 dark:text-[#F5F0E8]/70 mb-2">Time</label>
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 border border-white/60 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors shadow-inner">
                      <Clock size={16} className="text-[#986427]" />
                      <input type="time" className="text-[13px] w-full focus:outline-none text-[#1A0A08] dark:text-[#F5F0E8] font-bold bg-transparent" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-[#1A0A08]/70 dark:text-[#F5F0E8]/70 mb-2">Address</label>
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 border border-white/60 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors shadow-inner">
                    <MapPin size={16} className="text-[#986427] shrink-0" />
                    <input type="text" placeholder="Enter full address for the visit" className="text-[13px] w-full focus:outline-none text-[#1A0A08] dark:text-[#F5F0E8] font-bold bg-transparent" />
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedFitMode('expert');
                    setShowBespokeFitModal(false);
                  }}
                  className="w-full mt-4 bg-[#986427] text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:bg-[#7D5220] flex items-center justify-center gap-2 text-[14px]"
                >
                   Confirm Appointment <ArrowRight size={16}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
