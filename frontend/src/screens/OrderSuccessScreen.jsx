import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default function OrderSuccessScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderId = location.state?.orderId || "VION-0000";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-white dark:bg-[#151515] transition-colors duration-500 rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-[#F8F6FF] text-[#6344D4] rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-[#F5F0E8] mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Thank you for your purchase. We've received your order and our tailoring team will begin processing it shortly.
        </p>

        <div className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-[#151515] transition-colors duration-500 rounded-full flex items-center justify-center shadow-sm">
              <Package size={20} className="text-[#6344D4]" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Order ID</p>
              <p className="font-bold text-gray-900 dark:text-[#F5F0E8]">#{orderId.substring(0, 8)}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/order/${orderId}`)}
          className="w-full bg-[#6344D4] text-white py-4 rounded-xl font-bold shadow-md hover:bg-[#5235B8] transition-colors flex items-center justify-center gap-2 mb-3"
        >
          View Order Details <ArrowRight size={18} />
        </button>
        
        <button 
          onClick={() => navigate('/home')}
          className="w-full bg-white dark:bg-[#151515] transition-colors duration-500 text-gray-900 dark:text-[#F5F0E8] py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
