import { ArrowLeft, MoreVertical, Sparkles, Trash2, Plus, Minus, Info, ChevronRight, ShieldCheck, RefreshCcw, CheckCircle, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { supabase } from "../services/supabaseClient";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CartScreen() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, clearCart, members, selectedConsumerId } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fallback to primary member or first member if selectedConsumerId is not found
  const activeMember = members?.find(m => m.id === selectedConsumerId) || members?.find(m => m.isPrimary) || members?.[0];
  
  // Calculate Totals
  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  const discount = 0; // Can implement coupons later
  const shipping = subtotal > 500 ? 0 : 149;
  const toPay = subtotal > 0 ? (subtotal - discount + shipping) : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Your bag is empty");
    navigate('/checkout');
  };

  return (
    <div className="w-full mx-auto flex flex-col min-h-screen bg-[#F5F0E8] dark:bg-[#0A0A0A] transition-colors duration-500 pb-32">
      
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 z-50">
        <div className="absolute inset-0 bg-[#F5F0E8]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md"></div>
        <div className="relative flex items-center gap-4 w-full max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-white/2 dark:bg-[#151515]/2 transition-colors duration-500 0 dark:bg-black/20 hover:bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 dark:hover:bg-black/40 border border-white/50 dark:border-white/10 rounded-full transition-all text-[#1A0A08] dark:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-[#1A0A08] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>My Bag</h1>
        </div>
      </div>

      <div className="px-6 md:px-0 md:max-w-4xl mx-auto w-full mt-4">
        
        {/* Shopping For Header */}
        <div className="bg-white/2 dark:bg-[#151515]/2 transition-colors duration-500 0 dark:bg-[#151515]/60 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between border border-white/50 dark:border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_4px_12px_rgba(0,0,0,0.05)] mb-6 transition-colors duration-500 ">
          <div className="flex items-center gap-4">
            <img src={activeMember?.image || "/images/body_hourglass_1785826886362.jpg"} className="w-12 h-12 rounded-full object-cover border-2 border-white/80 dark:border-white/20 shadow-sm" alt="Profile" />
            <div>
              <p className="text-[11px] text-[#1A0A08]/6 dark:text-[#F5F0E8]/60 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">Shopping for</p>
              <p className="text-lg font-bold text-[#1A0A08] dark:text-[#F5F0E8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{activeMember?.name || 'You'}</p>
            </div>
          </div>
          <button className="text-xs font-bold text-[#8B6544] bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 hover:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 px-4 py-2 rounded-full border border-white/50 transition-colors shadow-sm">
            Change
          </button>
        </div>

        {/* Free Shipping Banner */}
        {subtotal > 0 && subtotal <= 500 && (
          <div className="bg-gradient-to-r from-white/30 to-white/10 dark:from-white/5 dark:to-white/5 p-4 rounded-2xl border border-white/40 dark:border-white/10 flex flex-col gap-2 mb-6 shadow-sm">
            <p className="text-sm font-bold text-[#1A0A08] dark:text-[#F5F0E8]">You're <span className="text-[#8B6544] dark:text-[#C49A5C]">₹{(501 - subtotal).toLocaleString()}</span> away from FREE Shipping!</p>
            <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-[#8B6544] rounded-full" style={{ width: `${Math.min(100, (subtotal / 501) * 100)}%` }}></div>
            </div>
          </div>
        )}
        {subtotal > 500 && (
          <div className="bg-gradient-to-r from-white/30 to-white/10 dark:from-white/5 dark:to-white/5 p-4 rounded-2xl border border-white/40 dark:border-white/10 flex items-center gap-3 mb-6 shadow-sm">
            <CheckCircle size={20} className="text-[#8B6544] dark:text-[#C49A5C]" />
            <p className="text-sm font-bold text-[#1A0A08] dark:text-[#F5F0E8]">You've unlocked FREE Shipping!</p>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white/1 dark:bg-[#151515]/1 transition-colors duration-500 0 dark:bg-white/5 dark:bg-[#151515]/5 transition-colors duration-500 backdrop-blur-md rounded-3xl border border-white/40 dark:border-white/10 shadow-sm mb-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/3 dark:bg-[#151515]/3 transition-colors duration-500 0 dark:bg-black/30 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/50 dark:border-white/10">
              <ShoppingBag size={32} className="text-[#8B6544] dark:text-[#C49A5C]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1A0A08] dark:text-[#F5F0E8] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your bag is empty</h2>
            <p className="text-[#1A0A08]/6 dark:text-[#F5F0E8]/60 dark:text-gray-400 font-medium max-w-xs mx-auto mb-8">Looks like you haven't added any bespoke items to your bag yet.</p>
            <button 
              onClick={() => navigate('/home')}
              className="px-8 py-3.5 bg-gradient-to-b from-[#3A2419] to-[#1A0A08] dark:from-[#C49A5C] dark:to-[#8B5A2B] text-white rounded-xl font-bold hover:from-[#4A3022] hover:to-[#240E0C] dark:hover:from-[#E5CDA7] dark:hover:to-[#C49A5C] transition-colors shadow-md uppercase tracking-wider text-sm"
            >
              Discover VION
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white/1 dark:bg-[#151515]/1 transition-colors duration-500 0 dark:bg-white/5 dark:bg-[#151515]/5 transition-colors duration-500 backdrop-blur-md p-4 rounded-2xl border border-white/40 dark:border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),_0_4px_12px_rgba(0,0,0,0.03)] group">
                  <div className="flex gap-4">
                    <div className="w-24 h-32 md:w-32 md:h-40 rounded-xl bg-black/5 dark:bg-white/5 dark:bg-[#151515]/5 transition-colors duration-500 overflow-hidden shadow-inner relative shrink-0">
                      <img 
                        src={
                          (item.variation?.image_urls && item.variation.image_urls.length > 0) ? item.variation.image_urls[0] : 
                          (item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/images/placeholder.jpg')
                        } 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={item.product.title}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-[#1A0A08] dark:text-[#F5F0E8] text-lg leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.product.title}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-[#1A0A08]/4 dark:text-[#F5F0E8]/40 dark:text-gray-400 hover:text-red-500 transition-colors p-1 bg-white/2 dark:bg-[#151515]/2 transition-colors duration-500 0 dark:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 rounded-full">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-[#1A0A08]/7 dark:text-[#F5F0E8]/70 dark:text-gray-400 font-medium">
                            <span className="font-bold">Size:</span> {item.size}
                          </p>
                          {item.variation?.colorName && (
                            <p className="text-xs text-[#1A0A08]/7 dark:text-[#F5F0E8]/70 dark:text-gray-400 font-medium flex items-center gap-1.5">
                              <span className="font-bold">Color:</span> {item.variation.colorName}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between mt-4">
                        <span className="font-bold text-xl text-[#1A0A08] dark:text-[#F5F0E8]">₹{parseFloat(item.product.price).toLocaleString()}</span>
                        
                        {/* Quantity Control */}
                        <div className="flex items-center bg-white/3 dark:bg-[#151515]/3 transition-colors duration-500 0 dark:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 rounded-full border border-white/50 dark:border-white/10 shadow-inner">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#1A0A08]/6 dark:text-[#F5F0E8]/60 dark:text-gray-400 hover:text-[#1A0A08] dark:text-[#F5F0E8] dark:hover:text-white hover:bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 dark:hover:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 rounded-l-full transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-[#1A0A08] dark:text-[#F5F0E8]">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#1A0A08]/6 dark:text-[#F5F0E8]/60 dark:text-gray-400 hover:text-[#1A0A08] dark:text-[#F5F0E8] dark:hover:text-white hover:bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 dark:hover:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 rounded-r-full transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Summary & Checkout */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Coupons */}
              <button className="w-full bg-white/2 dark:bg-[#151515]/2 transition-colors duration-500 0 dark:bg-white/5 dark:bg-[#151515]/5 transition-colors duration-500 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between border border-white/50 dark:border-white/10 shadow-sm active:scale-[0.99] transition-transform group">
                <div className="flex items-center gap-3 text-[#1A0A08] dark:text-[#F5F0E8]">
                  <div className="bg-white/4 dark:bg-[#151515]/4 transition-colors duration-500 0 dark:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 p-2 rounded-full border border-white/60 dark:border-white/10 shadow-inner group-hover:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 dark:group-hover:bg-white/20 dark:bg-[#151515]/20 transition-colors duration-500 transition-colors">
                    <Sparkles size={18} className="text-[#8B6544] dark:text-[#C49A5C]" />
                  </div>
                  <span className="font-bold text-sm">Apply Coupon or Gift Card</span>
                </div>
                <ChevronRight size={18} className="text-[#1A0A08]/4 dark:text-[#F5F0E8]/40 dark:text-gray-400 group-hover:text-[#1A0A08] dark:text-[#F5F0E8] dark:group-hover:text-white transition-colors" />
              </button>

              {/* Order Summary */}
              <div className="bg-white/1 dark:bg-[#151515]/1 transition-colors duration-500 0 dark:bg-white/5 dark:bg-[#151515]/5 transition-colors duration-500 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_10px_30px_rgba(0,0,0,0.05)]">
                <h3 className="font-bold text-[#1A0A08] dark:text-[#F5F0E8] text-2xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-[#1A0A08]/7 dark:text-[#F5F0E8]/70 dark:text-gray-400 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1A0A08] dark:text-[#F5F0E8]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#1A0A08]/7 dark:text-[#F5F0E8]/70 dark:text-gray-400 font-medium">
                    <span>Shipping</span>
                    <span className="font-bold text-[#1A0A08] dark:text-[#F5F0E8]">{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span>
                  </div>
                  
                  <div className="h-px w-full bg-[#1A0A08]/10 dark:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#1A0A08] dark:text-[#F5F0E8] text-lg">Total</span>
                    <span className="font-black text-2xl text-[#8B6544] dark:text-[#C49A5C]">₹{toPay.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full mt-8 bg-gradient-to-b from-[#3A2419] to-[#1A0A08] dark:from-[#C49A5C] dark:to-[#8B5A2B] text-white py-4 rounded-xl font-bold transition-all shadow-[0_4px_12px_rgba(26,10,8,0.3)] hover:from-[#4A3022] hover:to-[#240E0C] dark:hover:from-[#E5CDA7] dark:hover:to-[#C49A5C] uppercase tracking-wider text-sm disabled:opacity-70 flex justify-center"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center gap-8 mt-4 bg-white/5 dark:bg-white/5 dark:bg-[#151515]/5 transition-colors duration-500 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-white/10">
                <div className="flex flex-col items-center gap-2 text-[#1A0A08]/6 dark:text-[#F5F0E8]/60 dark:text-gray-400">
                  <ShieldCheck size={24} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Secure</span>
                </div>
                <div className="w-px h-10 bg-[#1A0A08]/10 dark:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 "></div>
                <div className="flex flex-col items-center gap-2 text-[#1A0A08]/6 dark:text-[#F5F0E8]/60 dark:text-gray-400">
                  <RefreshCcw size={24} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">14 Days</span>
                </div>
              </div>
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
