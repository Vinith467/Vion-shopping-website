import React, { useState } from 'react';
import { MapPin, Plus, MoreVertical, CheckCircle2, Home, Briefcase, X } from 'lucide-react';
import toast from 'react-hot-toast';

const initialAddresses = [
  {
    id: 1,
    type: 'Home',
    icon: Home,
    name: 'Priya Sharma',
    address: 'A-102, Sunshine Apartments, Indiranagar',
    city: 'Bangalore, Karnataka 560038',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Work',
    icon: Briefcase,
    name: 'Priya Sharma',
    address: 'Tech Park Phase 2, Whitefield',
    city: 'Bangalore, Karnataka 560066',
    phone: '+91 98765 43210',
    isDefault: false,
  }
];

import { supabase } from '../services/supabaseClient';
import { useEffect } from 'react';

export default function AddressBookTab() {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Home',
    firstName: '',
    lastName: '',
    countryCode: '+91',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
  });

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.addresses) {
        // Hydrate icons based on type
        const parsedAddresses = user.user_metadata.addresses.map(addr => ({
          ...addr,
          icon: addr.type === 'Work' ? Briefcase : Home
        }));
        setAddresses(parsedAddresses);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const saveAddressesToSupabase = async (updatedAddresses) => {
    try {
      // we remove the icon property before saving as it's a React component
      const cleanAddresses = updatedAddresses.map(({ icon, ...rest }) => rest);
      const { error } = await supabase.auth.updateUser({
        data: { addresses: cleanAddresses }
      });
      if (error) throw error;
      setAddresses(updatedAddresses);
    } catch (err) {
      console.error('Error saving addresses:', err);
      toast.error('Failed to save changes');
    }
  };

  const setDefault = async (id) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    await saveAddressesToSupabase(updated);
    toast.success('Default address updated');
  };

  const handleDelete = async (id) => {
    const updated = addresses.filter(addr => addr.id !== id);
    // If we deleted the default, make the first remaining one default
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    await saveAddressesToSupabase(updated);
    toast('Address deleted', { icon: '🗑️' });
  };

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({
      type: addr.type || 'Home',
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      countryCode: addr.countryCode || '+91',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      landmark: addr.landmark || '',
      pincode: addr.pincode || '',
      city: addr.cityField || '',
      state: addr.state || '',
      country: addr.country || 'India',
    });
    setIsModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newAddress = {
        type: formData.type,
        firstName: formData.firstName,
        lastName: formData.lastName,
        countryCode: formData.countryCode,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        landmark: formData.landmark,
        pincode: formData.pincode,
        cityField: formData.city,
        state: formData.state,
        country: formData.country,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        address: [formData.addressLine1, formData.addressLine2, formData.landmark].filter(Boolean).join(', '),
        city: `${formData.city}, ${formData.state} ${formData.pincode}, ${formData.country}`,
        id: editingId ? editingId : Date.now(),
        isDefault: editingId ? (addresses.find(a=>a.id===editingId)?.isDefault || false) : addresses.length === 0,
        icon: formData.type === 'Work' ? Briefcase : Home
      };
      
      let updated;
      if (editingId) {
        updated = addresses.map(a => a.id === editingId ? newAddress : a);
      } else {
        updated = [...addresses, newAddress];
      }
      await saveAddressesToSupabase(updated);
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ type: 'Home', firstName: '', lastName: '', countryCode: '+91', phone: '', addressLine1: '', addressLine2: '', landmark: '', pincode: '', city: '', state: '', country: 'India' });
      toast.success(editingId ? 'Address updated successfully' : 'Address added successfully');
    } catch (err) {
      // Error handled in saveAddressesToSupabase
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 -mt-4 relative min-h-[500px]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-gray-900 dark:text-[#F5F0E8] mb-2 font-serif">Address Book</h2>
          <p className="text-sm text-gray-500 font-medium">Manage your shipping and billing addresses.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ type: 'Home', firstName: '', lastName: '', countryCode: '+91', phone: '', addressLine1: '', addressLine2: '', landmark: '', pincode: '', city: '', state: '', country: 'India' });
            setIsModalOpen(true);
          }}
          className="bg-[#3A10E5] hover:bg-[#2A08B5] text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
        >
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {addresses.map(addr => {
          const Icon = addr.icon;
          return (
            <div 
              key={addr.id} 
              className={`bg-white dark:bg-[#151515] transition-colors duration-500 rounded-2xl p-6 border transition-all ${
                addr.isDefault ? 'border-[#3A10E5] shadow-md ring-1 ring-[#3A10E5]/10' : 'border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${addr.isDefault ? 'bg-[#3A10E5] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon size={14} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${addr.isDefault ? 'bg-[#3A10E5]/10 text-[#3A10E5]' : 'bg-gray-100 text-gray-600'}`}>
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[#3A10E5] flex items-center gap-1 text-xs font-bold ml-1">
                      <CheckCircle2 size={12} /> Default
                    </span>
                  )}
                </div>
                
                <div className="group relative">
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <MoreVertical size={18} />
                  </button>
                  <div className="absolute right-0 top-full pt-1 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                      {!addr.isDefault && (
                        <button onClick={() => setDefault(addr.id)} className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Set Default</button>
                      )}
                      <button onClick={() => handleEdit(addr)} className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Edit</button>
                      <button onClick={() => handleDelete(addr.id)} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">{addr.name}</h4>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  {addr.address}<br />
                  {addr.city}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] mt-4 flex items-center gap-2">
                  <span className="text-gray-400 text-xs">Ph:</span> {addr.countryCode || '+91'} {addr.phone}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-[#F5F0E8] font-serif">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto">
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div className="flex gap-4 mb-4">
                  {['Home', 'Work', 'Other'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, type})}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        formData.type === type ? 'border-[#3A10E5] bg-[#3A10E5]/5 text-[#3A10E5]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">First Name</label>
                    <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Last Name</label>
                    <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Mobile Number</label>
                  <div className="flex gap-2">
                    <select value={formData.countryCode} onChange={e => setFormData({...formData, countryCode: e.target.value})} className="w-28 px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors appearance-none text-center font-medium">
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                    </select>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Flat, House no., Building, Company, Apartment</label>
                  <input required type="text" value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Area, Street, Sector, Village</label>
                  <input required type="text" value={formData.addressLine2} onChange={e => setFormData({...formData, addressLine2: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Landmark (Optional)</label>
                    <input type="text" value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors" placeholder="E.g. near Apollo Hospital" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Pincode</label>
                    <input required type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Town/City</label>
                    <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">State</label>
                    <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Country</label>
                  <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors appearance-none font-medium">
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#3A10E5] hover:bg-[#2A08B5] text-white font-bold py-3.5 rounded-xl transition-all shadow-sm mt-8 flex justify-center items-center h-12">
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Address'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
