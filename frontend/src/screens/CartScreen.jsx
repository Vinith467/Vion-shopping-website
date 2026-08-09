import { ArrowLeft, MoreVertical, Sparkles, Trash2, Plus, Minus, Info, ChevronRight, ShieldCheck, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { supabase } from "../services/supabaseClient";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CartScreen() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, clearCart, members } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const primaryMember = members?.find(m => m.isPrimary) || members?.[0];
  
  // Calculate Totals
  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  const discount = 0; // Can implement coupons later
  const shipping = subtotal > 500 ? 0 : 149;
  const toPay = subtotal > 0 ? (subtotal - discount + shipping) : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Your bag is empty");
    
    setIsProcessing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to checkout");
        navigate('/');
        return;
      }
      
      const userId = session.user.id;
      
      const { error } = await supabase.from('orders').insert({
        user_id: userId,
        items: cart,
        total_amount: toPay,
        status: 'pending'
      });
      
      if (error) throw error;
      
      clearCart();
      toast.success("Order placed successfully!");
      navigate('/account'); // Navigate to account so they can see "My Orders"
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col bg-gray-50 min-h-screen pb-32">
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 bg-white z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-gray-50 rounded-full">
            <ArrowLeft size={20} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Bag</h1>
        </div>
        <button className="p-2 bg-gray-50 rounded-full">
          <MoreVertical size={20} className="text-gray-900" />
        </button>
      </div>

      <div className="px-6 md:px-0 md:max-w-3xl mx-auto w-full mt-4">
        
        {/* Shopping For Header */}
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm mb-4">
          <div className="flex items-center gap-3">
            <img src={primaryMember?.image || "/images/body_hourglass_1785826886362.jpg"} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Shopping for</p>
              <p className="text-sm font-bold text-gray-900">{primaryMember?.name || 'You'}</p>
            </div>
          </div>
          <button className="text-xs font-bold text-[#6344D4] bg-[#F8F6FF] px-3 py-1.5 rounded-full border border-[#6344D4]/10">Change</button>
        </div>

        {/* Free Shipping Banner */}
        {subtotal > 0 && subtotal <= 500 && (
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-green-100 flex flex-col gap-2 mb-6">
            <p className="text-sm font-bold text-green-800">You're ₹{(501 - subtotal).toLocaleString()} away from FREE Shipping!</p>
            <div className="h-1.5 w-full bg-green-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, (subtotal / 501) * 100)}%` }}></div>
            </div>
          </div>
        )}
        {subtotal > 500 && (
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-green-100 flex items-center gap-2 mb-6">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-sm font-bold text-green-800">You've unlocked FREE Shipping!</p>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Your bag is empty</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2 bg-[#6344D4] text-white rounded-xl font-bold hover:bg-[#5235B8] transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <div className="flex gap-4">
                  <div className="w-24 h-32 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                    <img 
                      src={
                        (item.variation?.image_urls && item.variation.image_urls.length > 0) ? item.variation.image_urls[0] : 
                        (item.variation?.image_url || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/images/placeholder.jpg'))
                      } 
                      className="w-full h-full object-cover mix-blend-multiply" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-900 leading-tight">{item.product.title}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.size}
                        {item.variation?.colorName && ` • Color: ${item.variation.colorName}`}
                      </p>
                    </div>
                    
                    <div className="flex items-end justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-lg text-gray-900">₹{parseFloat(item.product.price).toLocaleString()}</span>
                      </div>
                      
                      {/* Quantity Control */}
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Coupons */}
        {cart.length > 0 && (
          <button className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm mb-6 active:scale-[0.99] transition-transform">
            <div className="flex items-center gap-3 text-gray-900">
              <div className="bg-[#F8F6FF] p-2 rounded-full">
                <Sparkles size={20} className="text-[#6344D4]" />
              </div>
              <span className="font-bold">Apply Coupon or Gift Card</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        )}

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Order Summary</h3>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            
            <div className="h-px w-full bg-gray-100 my-2"></div>
            
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-base">To Pay</span>
              <div className="text-right">
                <span className="font-black text-xl text-[#6344D4]">₹{toPay.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="flex justify-center gap-6 mt-8">
          <div className="flex flex-col items-center gap-1.5 text-gray-400">
            <ShieldCheck size={20} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Secure</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-gray-400">
            <RefreshCcw size={20} />
            <span className="text-[9px] font-bold uppercase tracking-wider">14 Days</span>
          </div>
        </div>

      </div>

      {/* Sticky Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 z-50">
          <div className="md:max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden md:block flex-1">
              <span className="text-sm text-gray-500">Total Amount</span>
              <p className="text-xl font-black text-gray-900">₹{toPay.toLocaleString()}</p>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex-1 bg-[#6344D4] text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg shadow-[#6344D4]/30 hover:bg-[#5235B8] transition-colors disabled:opacity-70"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
