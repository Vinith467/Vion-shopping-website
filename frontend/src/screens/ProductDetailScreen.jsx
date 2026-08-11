import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MoreVertical, Star, Info, Share2, ShoppingBag, Box, User2, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import SizeSelectionModal from "../components/SizeSelectionModal";
import { useAppContext } from "../context/AppContext";


export default function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("Front");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const { members, updateMember, toggleWishlist, isInWishlist } = useAppContext();
  const primaryMember = members?.find(m => m.isPrimary);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset image index when variation changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeVariationIndex]);

  useEffect(() => {
    async function loadProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
    }
    loadProduct();
  }, [id]);



  useEffect(() => {
    if (product?.variations && product.variations.length > 0 && primaryMember) {
      // Logic to auto-select best variation based on skinTone and height
      const userHeightCm = parseInt(primaryMember.height) || 160;
      let heightRange = 'Average';
      if (userHeightCm < 160) heightRange = 'Short';
      if (userHeightCm > 170) heightRange = 'Tall';
      
      const userSkinTone = primaryMember.skinTone || 'Medium';
      const userBodyShape = primaryMember.bodyShape || 'Hourglass';
      
      // Find exact match first
      let bestMatchIndex = product.variations.findIndex(v => 
        (v.skinTone === userSkinTone || v.skinTone === 'all') && 
        (v.heightRange === heightRange || v.heightRange === 'all') &&
        (!v.bodyShape || v.bodyShape === userBodyShape || v.bodyShape === 'all')
      );
      
      if (bestMatchIndex !== -1) {
        setActiveVariationIndex(bestMatchIndex);
      }
    }
  }, [product, primaryMember]);



  if (!product) return <div className="p-10 text-center">Loading...</div>;

  const activeVariation = product.variations && product.variations[activeVariationIndex];
  
  // Combine image_urls array with fallback image_url
  const variationImages = [];
  if (activeVariation?.image_urls && activeVariation.image_urls.length > 0) {
    variationImages.push(...activeVariation.image_urls);
  } else if (activeVariation?.image_url) {
    variationImages.push(activeVariation.image_url);
  } else {
    if (product.images && product.images.length > 0) {
      variationImages.push(...product.images);
    } else {
      variationImages.push('/images/placeholder.jpg');
    }
  }

  const currentImage = variationImages[activeImageIndex] || variationImages[0];
  const currentColorName = activeVariation?.colorName || 'Standard';

  const price = parseFloat(product.price);
  const compareAtPrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
  const discountPercent = (compareAtPrice && compareAtPrice > price) 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) 
    : null;

  const fitScore = product.score ? `${Math.min(100, Math.round((product.score / 5) * 100))}%` : '95%';
  const recommendedSize = primaryMember?.recommendedSize || 'M';
  const bodyShape = primaryMember?.bodyShape || 'Hourglass';

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col bg-white min-h-screen">
      

      
      {/* Mobile Top App Bar (Hidden on Desktop) */}
      <div className="md:hidden flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-gray-50 rounded-full">
          <ArrowLeft size={20} className="text-gray-900" />
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toggleWishlist(product.id)}
            className="p-2 bg-gray-50 rounded-full"
          >
            <Heart size={20} className={`transition-colors ${isInWishlist(product?.id) ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
          </button>
          <button className="p-2 bg-gray-50 rounded-full"><MoreVertical size={20} className="text-gray-900" /></button>
        </div>
      </div>

      {/* Desktop Breadcrumb & Back (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-2 px-10 py-6 max-w-7xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#6344D4] transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-0 md:px-10 pb-32 md:pb-12 gap-10">
        
        {/* LEFT COLUMN: Media / Try On Viewer (Expands on Desktop) */}
        <div className="w-full md:w-[60%] flex flex-col">
          
            <div className="flex flex-col md:flex-row gap-4 px-6 md:px-0">
              
              {/* Vertical Views Selector (Left of image) */}
              <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
                {variationImages.map((img, idx) => {
                  return (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex flex-col items-center justify-center h-20 rounded-2xl border-2 overflow-hidden transition-all ${
                        activeImageIndex === idx ? "border-[#6344D4] ring-2 ring-[#6344D4]/30" : "border-transparent hover:border-gray-200"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>

              {/* Main Image Area */}
              <div className="flex-1 aspect-[3/4] md:aspect-auto md:min-h-[650px] bg-[#F8F8F8] rounded-3xl relative overflow-hidden flex items-center justify-center">
                <img src={currentImage} className="w-full h-full object-cover mix-blend-multiply" />
                
                {/* Image Navigation Arrows */}
                {variationImages.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : variationImages.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={20} className="text-gray-900" />
                    </button>
                    <button 
                      onClick={() => setActiveImageIndex(prev => prev < variationImages.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronRight size={20} className="text-gray-900" />
                    </button>
                  </>
                )}

                {/* Mobile horizontal view selector (overlay at bottom) */}
                {variationImages.length > 1 && (
                  <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-white/90 backdrop-blur p-1.5 rounded-full shadow-lg border border-gray-100 gap-1">
                    {variationImages.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          activeImageIndex === idx ? "bg-[#6344D4] w-6" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* "Try different looks" Vertical Carousel (Right of image) */}
              {product.variations && product.variations.length > 1 && (
                <div className="hidden md:flex flex-col gap-3 w-24 shrink-0">
                  <span className="text-xs font-bold text-gray-900 text-center bg-gray-50 py-2 rounded-lg border border-gray-100">Different<br/>Looks</span>
                  <div className="flex flex-col gap-3 overflow-y-auto hide-scrollbar pb-4">
                    {product.variations.map((v, i) => {
                      const thumb = (v.image_urls && v.image_urls.length > 0) ? v.image_urls[0] : (v.image_url || currentImage);
                      return (
                        <div key={i} onClick={() => setActiveVariationIndex(i)} className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-all shadow-sm ${i === activeVariationIndex ? 'ring-2 ring-offset-2 ring-[#6344D4]' : 'border border-gray-200'}`}>
                          <img src={thumb} className="w-full h-full object-cover bg-gray-50 mix-blend-multiply" />
                          {i === activeVariationIndex && (
                            <div className="absolute inset-0 bg-[#6344D4]/5"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          {/* Mobile "Try different looks" Horizontal Carousel (Below image) */}
          {product.variations && product.variations.length > 1 && (
            <div className="md:hidden mt-6 px-6">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Try different looks</h4>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {product.variations.map((v, i) => {
                  const thumb = (v.image_urls && v.image_urls.length > 0) ? v.image_urls[0] : (v.image_url || currentImage);
                  return (
                    <div key={i} onClick={() => setActiveVariationIndex(i)} className={`relative w-20 shrink-0 aspect-[3/4] rounded-xl overflow-hidden border-2 ${i === activeVariationIndex ? 'border-[#6344D4]' : 'border-transparent'}`}>
                      <img src={thumb} className="w-full h-full object-cover bg-gray-50 mix-blend-multiply" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Product Info & Actions */}
        <div className="w-full md:w-[40%] flex flex-col px-6 md:px-0">
          
          <div className="space-y-3 mt-4 md:mt-0">
            <span className="inline-block text-[10px] md:text-xs font-bold text-[#6344D4] uppercase tracking-widest bg-[#F8F6FF] px-3 py-1.5 rounded-full border border-[#6344D4]/10">New Arrival</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
              <span className="font-bold text-gray-900">4.8</span>
              <span className="underline decoration-gray-300 underline-offset-4">(128 reviews)</span>
              <span className="px-1 text-gray-300">|</span>
              <span className="font-medium">Sold 1.2k</span>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
              {compareAtPrice && compareAtPrice > price && (
                <>
                  <span className="text-lg text-gray-400 line-through font-medium">₹{compareAtPrice.toLocaleString()}</span>
                  <span className="text-sm font-bold text-[#D93025] bg-red-50 px-2 py-1 rounded">{discountPercent}% OFF</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-gradient-to-br from-[#F8F6FF] to-white rounded-3xl p-6 flex flex-col items-center justify-center border border-[#6344D4]/20 shadow-[0_4px_20px_-4px_rgba(99,68,212,0.1)] relative overflow-hidden group hover:border-[#6344D4]/40 transition-colors">
              <div className="absolute inset-0 bg-[#6344D4]/5 group-hover:bg-[#6344D4]/10 transition-colors"></div>
              <p className="text-[10px] md:text-xs text-gray-600 font-extrabold uppercase tracking-widest mb-2 z-10">Fit Score</p>
              <p className="text-4xl font-black text-[#6344D4] z-10 drop-shadow-sm">{fitScore}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center border border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-gray-300 transition-colors">
              <p className="text-[10px] md:text-xs text-gray-500 font-extrabold uppercase tracking-widest mb-2 z-10">Suggested Size</p>
              <p className="text-4xl font-black text-gray-900 z-10">{recommendedSize}</p>
              <Info size={18} className="absolute top-4 right-4 text-gray-300 group-hover:text-gray-500 cursor-pointer transition-colors z-10" />
            </div>
          </div>

          <div className="space-y-4 mt-8 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-start gap-4 text-sm text-gray-700">
              <div className="w-8 h-8 rounded-full bg-[#6344D4]/10 flex items-center justify-center shrink-0">
                <User2 size={16} className="text-[#6344D4]" />
              </div>
              <div className="flex flex-col justify-center h-8">
                <p className="font-medium leading-relaxed">Perfect fit for your body type <span className="font-bold text-gray-900">({bodyShape})</span></p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-sm text-gray-700">
              <div className="w-8 h-8 rounded-full bg-[#6344D4]/10 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-[#6344D4]" />
              </div>
              <div className="flex flex-col justify-center h-8">
                <p className="font-medium leading-relaxed">Looks great in this color palette</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-900">Color: <span className="text-gray-600 font-medium">{currentColorName}</span></p>
            </div>
            {product.variations && product.variations.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {product.variations.map((v, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveVariationIndex(i)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${i === activeVariationIndex ? 'border-[#6344D4] bg-[#F8F6FF] text-[#6344D4]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {v.colorName || `Look ${i+1}`}
                  </button>
                ))}
              </div>
            )}
          </div>



          {/* Desktop Add to Bag (Inline) */}
          <div className="hidden md:flex items-center gap-4 mt-8 pt-8 border-t border-gray-100">
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all shadow-sm ${isInWishlist(product?.id) ? 'border-red-100 bg-red-50 hover:bg-red-100' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <Heart size={24} className={`transition-colors ${isInWishlist(product?.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
            <button 
              onClick={() => setIsSizeModalOpen(true)}
              className="flex-1 bg-gradient-to-r from-[#6344D4] to-[#4c2bb8] text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0_8px_25px_-8px_rgba(99,68,212,0.6)] hover:shadow-[0_12px_35px_-12px_rgba(99,68,212,0.8)] hover:-translate-y-1 transition-all group"
            >
              <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
              Add to Bag
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 pb-6 z-50 flex items-center gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => toggleWishlist(product.id)}
          className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-colors ${isInWishlist(product?.id) ? 'border-red-100 bg-red-50' : 'border-gray-200 bg-white'}`}
        >
          <Heart size={22} className={`transition-colors ${isInWishlist(product?.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        <button 
          onClick={() => setIsSizeModalOpen(true)}
          className="flex-1 bg-gradient-to-r from-[#6344D4] to-[#4c2bb8] text-white h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-[0_8px_20px_-8px_rgba(99,68,212,0.6)] active:scale-95 transition-all"
        >
          <ShoppingBag size={20} />
          Add to Bag
        </button>
      </div>

      {/* Size Selection Modal */}
      <SizeSelectionModal 
        isOpen={isSizeModalOpen} 
        onClose={() => setIsSizeModalOpen(false)} 
        product={product}
        activeVariation={activeVariation}
      />
    </div>
  );
}
