import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle2, MapPin, Wallet, ShoppingBag, Clock } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function OrderDetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
      if (data) setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-medium">Loading Order...</div>;
  if (!order) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-medium">Order Not Found</div>;

  // Extract metadata and actual items
  const metadataItem = order.items.find(item => item._type === 'metadata') || {};
  const actualItems = order.items.filter(item => item._type !== 'metadata');
  
  const address = metadataItem.shippingAddress || null;
  const paymentMethod = metadataItem.paymentMethod || 'N/A';

  const orderStatuses = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStatusIndex = orderStatuses.indexOf(order.status) >= 0 ? orderStatuses.indexOf(order.status) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col bg-gray-50 min-h-screen pb-32">
      {/* App Bar */}
      <div className="flex items-center px-6 pt-12 pb-4 sticky top-0 bg-white z-40 shadow-sm border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-gray-50 rounded-full">
          <ArrowLeft size={20} className="text-gray-900" />
        </button>
        <div className="ml-4 flex flex-col">
          <h1 className="text-lg font-bold text-gray-900 leading-tight">Order Details</h1>
          <span className="text-xs text-gray-500 font-medium tracking-wide">#{order.id.substring(0, 8)}</span>
        </div>
      </div>

      <div className="px-6 md:px-0 md:max-w-3xl mx-auto w-full mt-6 flex flex-col gap-6">
        
        {/* Status Tracker */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-6">Order Status</h2>
          
          <div className="relative flex justify-between items-start">
            <div className="absolute top-4 left-6 right-6 h-1 bg-gray-100 -z-0"></div>
            <div className={`absolute top-4 left-6 h-1 bg-[#6344D4] transition-all duration-500 -z-0`} style={{ width: `${(currentStatusIndex / 3) * 100}%`, right: '1.5rem' }}></div>
            
            {[
              { label: 'Placed', icon: Package },
              { label: 'Processing', icon: Clock },
              { label: 'Shipped', icon: Truck },
              { label: 'Delivered', icon: CheckCircle2 }
            ].map((step, idx) => {
              const isCompleted = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 z-10 relative bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                    isCompleted ? 'bg-[#6344D4] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <step.icon size={16} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Shipping & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-[#6344D4]" /> Delivery Address
            </h2>
            {address ? (
              <div>
                <p className="font-bold text-gray-900 mb-1">{address.name}</p>
                <p className="text-sm text-gray-600 mb-1">{address.address}</p>
                <p className="text-sm text-gray-600 mb-3">{address.city}</p>
                <p className="text-sm font-medium text-gray-900">{address.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No address provided</p>
            )}
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Wallet size={16} className="text-[#6344D4]" /> Payment Info
            </h2>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Method</span>
              <span className="font-bold text-gray-900">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="font-bold text-[#6344D4]">₹{order.total_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Status</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                paymentMethod === 'COD' && order.status !== 'delivered' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
              }`}>
                {paymentMethod === 'COD' && order.status !== 'delivered' ? 'Pending' : 'Paid'}
              </span>
            </div>
          </section>
        </div>

        {/* Items list */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-10">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag size={16} className="text-[#6344D4]" /> Order Items
          </h2>
          
          <div className="flex flex-col gap-4">
            {actualItems.map((item, idx) => {
              const variation = item.variation;
              const img = (variation?.image_urls && variation.image_urls.length > 0) ? variation.image_urls[0] : 
                          (variation?.image_url || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/images/placeholder.jpg'));
              
              return (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-20 h-24 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <img src={img} alt="Product" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h5 className="font-bold text-gray-900 leading-tight">{item.product.title}</h5>
                      <span className="font-bold text-gray-900">₹{item.product.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Qty: {item.quantity}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-gray-700 px-2 py-1 border border-gray-200 rounded">Size: {item.size}</span>
                      {variation?.colorName && <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-gray-700 px-2 py-1 border border-gray-200 rounded">Color: {variation.colorName}</span>}
                    </div>

                    {/* Custom Measurements Display */}
                    {item.customMeasurements && Object.keys(item.customMeasurements).length > 0 && (
                      <div className="mt-3 bg-white p-3 rounded border border-purple-100">
                        <p className="text-[10px] font-bold text-[#6344D4] uppercase tracking-wider mb-2">Custom Measurements Provided</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-1">
                          {Object.entries(item.customMeasurements).filter(([_, val]) => val).map(([key, val]) => (
                            <div key={key} className="flex justify-between text-xs">
                              <span className="text-gray-500 capitalize">{key}:</span>
                              <span className="font-bold text-gray-900">{val}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
