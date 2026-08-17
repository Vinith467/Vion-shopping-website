import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAppContext } from '../context/AppContext';
import { 
  User, MapPin, ShoppingBag, Heart, LogOut, ChevronRight, 
  Phone, Plus, Edit2, Trash2, CheckCircle2, Save, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountScreen() {
  const navigate = useNavigate();
  const { selectedConsumerId } = useAppContext();
  const [activeTab, setActiveTab] = useState('details');
  const [profile, setProfile] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Phone Editing State
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  
  // UI States
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    full_name: '', phone: '', street_address: '', city: '', state: '', zip_code: '', country: 'India', is_default: false
  });

  const handleSavePhone = async () => {
    if (!profile || !profile.id) return;
    setIsSavingPhone(true);
    try {
      const currentMeasurements = profile.measurements || {};
      const newMeasurements = { ...currentMeasurements, phone: phoneInput };
      
      const { error } = await supabase
        .from('consumers')
        .update({ measurements: newMeasurements })
        .eq('id', profile.id);

      if (error) throw error;
      
      setProfile({ ...profile, measurements: newMeasurements });
      setIsEditingPhone(false);
      toast.success('Phone number saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save phone number');
    } finally {
      setIsSavingPhone(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [selectedConsumerId]);

  const fetchAccountData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserEmail(user.email);

      // 1. Fetch Profile (Prefer selected profile, fallback to primary, then just latest)
      let profileQuery = supabase.from('consumers').select('*').eq('user_id', user.id);
      
      if (selectedConsumerId) {
        profileQuery = profileQuery.eq('id', selectedConsumerId);
      } else {
        // Fallback to primary if no selected ID exists
        profileQuery = profileQuery.eq('is_primary', true);
      }

      const { data: profileData } = await profileQuery.limit(1).single();
      
      // If we still didn't get one (e.g., they only have one profile and it's not primary), fetch the first one available
      if (!profileData) {
        const { data: fallbackData } = await supabase.from('consumers').select('*').eq('user_id', user.id).limit(1).single();
        setProfile(fallbackData);
      } else {
        setProfile(profileData);
      }

      // 2. Fetch Addresses
      const { data: addressData } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });
      
      setAddresses(addressData || []);

      // 3. Fetch Orders (Basic)
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setOrders(orderData || []);

    } catch (err) {
      console.error('Error fetching account data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('addresses')
        .insert({ ...addressForm, user_id: user.id })
        .select()
        .single();
        
      if (error) throw error;
      
      setAddresses(prev => [data, ...prev].sort((a, b) => b.is_default - a.is_default));
      setShowAddAddress(false);
      setAddressForm({ full_name: '', phone: '', street_address: '', city: '', state: '', zip_code: '', country: 'India', is_default: false });
      toast.success('Address saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save address');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      // Optistic UI update
      setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })).sort((a, b) => b.is_default - a.is_default));
      
      // Update in DB (in reality we need an RPC or a 2-step update to remove old default)
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
      await supabase.from('addresses').update({ is_default: true }).eq('id', id);
      toast.success('Default address updated');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      setAddresses(prev => prev.filter(a => a.id !== id));
      await supabase.from('addresses').delete().eq('id', id);
      toast.success('Address removed');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const tabs = [
    { id: 'details', label: 'My Details', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-[#e8d5c4] flex items-center justify-center font-serif italic text-gray-500">Loading your account...</div>;
  }

  return (
    <div className="min-h-screen relative overflow-clip bg-[#e8d5c4] pt-12 pb-24">
      {/* Background Glossy Elements (similar to Onboarding) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[#986427]/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60 sticky top-24">
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/80 shadow-sm bg-white/50">
                {profile?.avatar_url || profile?.image ? (
                  <img src={profile?.avatar_url || profile?.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5ece3] to-[#e8d5c4] text-[#986427]">
                    <User size={24} strokeWidth={2} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1A0A08]">{profile?.name || 'My Profile'}</h3>
                <p className="text-sm text-gray-500">Manage your details</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                      active 
                        ? 'bg-[#986427] text-white shadow-lg' 
                        : 'hover:bg-white/60 text-gray-600 hover:text-[#986427]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && <ChevronRight size={16} />}
                  </button>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-white/40">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60 min-h-[500px]">
            
            {activeTab === 'details' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-serif text-3xl font-bold text-[#1A0A08] mb-6">My Details</h2>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/60 relative shadow-sm">
                  {/* Global Edit Button for Details */}
                  <button onClick={() => navigate('/onboarding')} className="absolute top-6 right-6 text-[#986427] text-sm font-bold flex items-center gap-1 hover:underline">
                    <Edit2 size={14} /> Edit
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Full Name</label>
                      <p className="text-gray-900 font-medium text-lg">{profile?.name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
                      <p className="text-gray-900 font-medium text-lg">{userEmail || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                      {isEditingPhone ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="text" 
                            className="bg-white/60 border border-white/80 rounded-lg px-3 py-1.5 outline-none focus:border-[#986427] text-gray-900 w-full"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            placeholder="Enter phone number"
                            autoFocus
                          />
                          <button 
                            onClick={handleSavePhone}
                            disabled={isSavingPhone}
                            className="bg-[#986427] text-white px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setIsEditingPhone(false)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-gray-900 font-medium text-lg">{profile?.measurements?.phone || 'Not provided'}</p>
                          <button 
                            onClick={() => {
                              setPhoneInput(profile?.measurements?.phone || '');
                              setIsEditingPhone(true);
                            }} 
                            className="text-[#986427] text-sm font-bold flex items-center gap-1 hover:underline"
                          >
                            <Edit2 size={14} /> {profile?.measurements?.phone ? 'Edit' : 'Add'}
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Skin Tone</label>
                      <p className="text-gray-900 font-medium text-lg">{profile?.skin_tone || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Size</label>
                      <p className="text-gray-900 font-medium text-lg">{profile?.measurements?.size || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Height</label>
                      <p className="text-gray-900 font-medium text-lg">{profile?.measurements?.height_string || (profile?.height_cm ? `${profile.height_cm} cm` : 'Not set')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-3xl font-bold text-[#1A0A08]">Saved Addresses</h2>
                  <button onClick={() => setShowAddAddress(!showAddAddress)} className="flex items-center gap-2 text-[#986427] font-bold text-sm bg-[#986427]/10 px-4 py-2 rounded-full hover:bg-[#986427]/20 transition-colors">
                    {showAddAddress ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add New</>}
                  </button>
                </div>
                
                {showAddAddress && (
                  <form onSubmit={handleSaveAddress} className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border-2 border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.05)] mb-6 animate-in fade-in zoom-in-95">
                    <h3 className="font-bold text-lg mb-4 text-[#1A0A08]">Add a new address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required type="text" placeholder="Full Name" className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 outline-none focus:border-[#986427] transition-colors" value={addressForm.full_name} onChange={e => setAddressForm({...addressForm, full_name: e.target.value})} />
                      <input required type="text" placeholder="Phone Number" className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 outline-none focus:border-[#986427] transition-colors" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
                      <input required type="text" placeholder="Street Address (Flat, House no., Building, Company, Apartment)" className="w-full md:col-span-2 bg-white/60 border border-white/80 rounded-xl px-4 py-3 outline-none focus:border-[#986427] transition-colors" value={addressForm.street_address} onChange={e => setAddressForm({...addressForm, street_address: e.target.value})} />
                      <input required type="text" placeholder="City / Town" className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 outline-none focus:border-[#986427] transition-colors" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                      <input required type="text" placeholder="State" className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 outline-none focus:border-[#986427] transition-colors" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                      <input required type="text" placeholder="PIN Code / Zip Code" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#986427] transition-colors" value={addressForm.zip_code} onChange={e => setAddressForm({...addressForm, zip_code: e.target.value})} />
                    </div>
                    <label className="flex items-center gap-2 mt-4 cursor-pointer">
                      <input type="checkbox" checked={addressForm.is_default} onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})} className="w-4 h-4 text-[#986427] rounded focus:ring-[#986427]" />
                      <span className="text-sm font-medium text-gray-700">Make this my default address</span>
                    </label>
                    <button type="submit" className="mt-6 w-full md:w-auto bg-[#1A0A08] text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#3E2312] transition-colors">
                      <Save size={18} /> Save Address
                    </button>
                  </form>
                )}
                
                {addresses.length === 0 && !showAddAddress && (
                  <div className="text-center py-12 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60">
                    <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No saved addresses found</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`p-6 rounded-2xl border-2 transition-all relative ${
                      addr.is_default 
                        ? 'border-[#986427] bg-[#986427]/5 shadow-sm' 
                        : 'border-white/60 bg-white/50 backdrop-blur-sm hover:border-[#986427]/30'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{addr.full_name}</h3>
                            {addr.is_default && <span className="bg-[#986427] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Default</span>}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                            {addr.street_address}, {addr.city}, {addr.state} {addr.zip_code}, {addr.country}
                          </p>
                          <p className="text-gray-900 font-medium text-sm mt-2 flex items-center gap-1"><Phone size={14} className="text-gray-400" /> {addr.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!addr.is_default && (
                            <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-xs font-bold text-gray-500 hover:text-[#986427] bg-gray-100 hover:bg-[#986427]/10 px-3 py-1.5 rounded-full transition-colors">
                              Set Default
                            </button>
                          )}
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-serif text-3xl font-bold text-[#1A0A08] mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-[#986427]/10 text-[#986427]'}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="text-gray-900 font-bold mt-2">₹{(order.total_amount || 0).toLocaleString()}</p>
                        </div>
                        <button className="flex items-center gap-1 text-[#986427] font-bold text-sm hover:underline">
                          View Details <ChevronRight size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-3xl font-bold text-[#1A0A08]">My Wishlist & Bag</h2>
                </div>
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                  <Heart size={48} className="mx-auto text-[#986427]/40 mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Your saved outfits and cart items are tied to this profile.</p>
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => window.location.href = '/explore'} className="bg-[#1A0A08] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#3E2312] transition-colors">
                      Browse Lookbook
                    </button>
                    <button onClick={() => window.location.href = '/cart'} className="bg-[#986427]/10 text-[#986427] px-6 py-2 rounded-full text-sm font-bold hover:bg-[#986427]/20 transition-colors">
                      View Cart
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
