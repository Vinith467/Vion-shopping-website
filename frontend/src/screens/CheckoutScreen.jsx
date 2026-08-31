import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, CreditCard, Wallet, Banknote, ShieldCheck, CheckCircle2, Home, Briefcase, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const { cart, clearCart } = useAppContext();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add Address Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ type: 'Home', name: '', phone: '', address: '', city: '' });
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // Totals
  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 149;
  const toPay = subtotal > 0 ? (subtotal + shipping) : 0;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.addresses) {
        setAddresses(user.user_metadata.addresses);
        const defaultAddr = user.user_metadata.addresses.find(a => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else if (user.user_metadata.addresses.length > 0) setSelectedAddressId(user.user_metadata.addresses[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsSubmittingAddress(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const newAddress = {
        id: Date.now(),
        type: formData.type,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        isDefault: addresses.length === 0
      };
      
      const updatedAddresses = [...addresses, newAddress];
      const { error } = await supabase.auth.updateUser({
        data: { addresses: updatedAddresses }
      });
      
      if (error) throw error;
      
      setAddresses(updatedAddresses);
      setSelectedAddressId(newAddress.id);
      setShowAddModal(false);
      setFormData({ type: 'Home', name: '', phone: '', address: '', city: '' });
      toast.success("Address added");
    } catch (err) {
      toast.error("Failed to add address");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return toast.error("Please select a delivery address");
    
    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login");
        return navigate('/');
      }
      
      const selectedAddress = addresses.find(a => a.id === selectedAddressId);
      
      // Append metadata item to cart array to avoid schema modifications
      const metadataItem = {
        _type: 'metadata',
        shippingAddress: selectedAddress,
        paymentMethod: selectedPayment
      };
      
      const finalItems = [...cart, metadataItem];
      
      const { data: orderData, error } = await supabase.from('orders').insert({
        user_id: session.user.id,
        items: finalItems,
        total_amount: toPay,
        status: 'pending'
      }).select('id').single();
      
      if (error) throw error;
      
      clearCart();
      navigate('/order-success', { state: { orderId: orderData.id } });
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center font-medium text-gray-500 dark:text-gray-400 transition-colors duration-500 ">Loading Checkout...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col bg-gray-50 dark:bg-[#0A0A0A] min-h-screen pb-32 transition-colors duration-500 ">
      {/* App Bar */}
      <div className="flex items-center px-6 pt-12 pb-4 sticky top-0 bg-white dark:bg-[#111] z-40 shadow-sm transition-colors duration-500 ">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-gray-50 dark:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 rounded-full hover:bg-gray-100 dark:hover:bg-white/20 dark:bg-[#151515]/20 transition-colors duration-500 transition-colors">
          <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#F5F0E8] ml-4">Checkout</h1>
      </div>

      <div className="px-6 md:px-0 md:max-w-3xl mx-auto w-full mt-6 flex flex-col gap-8">
        
        {/* Section 1: Address */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#F5F0E8] flex items-center gap-2">
              <MapPin size={20} className="text-[#6344D4] dark:text-[#A882FF]" /> Delivery Address
            </h2>
            <button onClick={() => setShowAddModal(true)} className="text-xs font-bold text-[#6344D4] dark:text-[#A882FF] bg-[#F8F6FF] dark:bg-[#6344D4]/20 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
              <Plus size={14} /> Add New
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {addresses.length === 0 ? (
              <div className="p-6 bg-white dark:bg-[#151515] rounded-2xl border border-dashed border-gray-300 dark:border-white/20 text-center transition-colors">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">No addresses found</p>
                <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-gray-900 dark:bg-white dark:bg-[#151515] transition-colors duration-500 text-white dark:text-black text-sm font-bold rounded-xl transition-colors">Add Address</button>
              </div>
            ) : (
              addresses.map(addr => (
                <div 
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedAddressId === addr.id ? 'border-[#6344D4] dark:border-[#A882FF] bg-[#F8F6FF] dark:bg-[#6344D4]/10' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-[#151515] hover:border-gray-200 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? 'bg-[#6344D4] dark:bg-[#A882FF] text-white dark:text-[#111] dark:text-[#F5F0E8]' : 'bg-gray-100 dark:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 text-gray-500 dark:text-gray-400'}`}>
                      {addr.type === 'Work' ? <Briefcase size={18} /> : <Home size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-[#F5F0E8]">{addr.name || 'Anonymous User'}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-white/20 dark:bg-[#151515]/20 transition-colors duration-500 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">{addr.type || 'Home'}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{addr.address || addr.addressLine1}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{addr.city || addr.cityField}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-300 mt-2">{addr.phone}</p>
                    </div>
                  </div>
                  {selectedAddressId === addr.id && (
                    <div className="absolute top-4 right-4 text-[#6344D4]">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 2: Payment Method */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#F5F0E8] flex items-center gap-2 mb-4">
            <Wallet size={20} className="text-[#6344D4] dark:text-[#A882FF]" /> Payment Method
          </h2>
          
          <div className="flex flex-col gap-3">
            {[
              { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: Banknote },
              { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)', desc: 'Pay instantly via UPI apps', icon: ShieldCheck },
              { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard }
            ].map(method => (
              <div 
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedPayment === method.id ? 'border-[#6344D4] dark:border-[#A882FF] bg-[#F8F6FF] dark:bg-[#6344D4]/10' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-[#151515] hover:border-gray-200 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedPayment === method.id ? 'bg-[#6344D4] dark:bg-[#A882FF] text-white dark:text-[#111] dark:text-[#F5F0E8]' : 'bg-gray-100 dark:bg-white/10 dark:bg-[#151515]/10 transition-colors duration-500 text-gray-500 dark:text-gray-400'}`}>
                    <method.icon size={18} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${selectedPayment === method.id ? 'text-[#6344D4] dark:text-[#A882FF]' : 'text-gray-900 dark:text-[#F5F0E8]'}`}>{method.label}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{method.desc}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-[#6344D4] dark:border-[#A882FF]' : 'border-gray-300 dark:border-white/20'}`}>
                  {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[#6344D4] dark:bg-[#A882FF]" />}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm mb-10 transition-colors">
          <h3 className="font-bold text-gray-900 dark:text-[#F5F0E8] mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600 dark:text-green-400 font-bold" : ""}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex justify-between font-bold text-lg text-gray-900 dark:text-[#F5F0E8]">
              <span>Total to Pay</span>
              <span>₹{toPay.toLocaleString()}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-white/10 p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors duration-500 ">
        <div className="max-w-3xl mx-auto flex gap-4 items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Amount</p>
            <p className="text-xl font-bold text-gray-900 dark:text-[#F5F0E8]">₹{toPay.toLocaleString()}</p>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="flex-[2] bg-[#6344D4] dark:bg-[#A882FF] text-white dark:text-[#111] dark:text-[#F5F0E8] py-3.5 rounded-xl font-bold shadow-md hover:bg-[#5235B8] dark:hover:bg-[#976DF3] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Processing...' : `Place Order • ${selectedPayment}`}
          </button>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center md:p-4">
          <div className="bg-white dark:bg-[#151515] transition-colors duration-500 w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-6 animate-slide-up md:animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#F5F0E8]">Add New Address</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddAddress} className="flex flex-col gap-4">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                {['Home', 'Work'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, type})}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === type ? 'bg-white dark:bg-[#151515] transition-colors duration-500 shadow-sm text-gray-900 dark:text-[#F5F0E8]' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6344D4]" placeholder="E.g. Priya Sharma" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6344D4]" placeholder="E.g. +91 9876543210" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Street Address</label>
                <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6344D4]" placeholder="House No, Building, Street" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">City, State, Pincode</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6344D4]" placeholder="Bangalore, Karnataka 560038" />
              </div>
              
              <button type="submit" disabled={isSubmittingAddress} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold mt-2 hover:bg-black transition-colors">
                {isSubmittingAddress ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
