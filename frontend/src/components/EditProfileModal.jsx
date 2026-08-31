import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function EditProfileModal({ isOpen, onClose }) {
  const { profile, saveProfile } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Female',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dob: profile.dob || '',
        gender: profile.gender || 'Female',
      });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await saveProfile(formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#3A10E5]">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#F5F0E8] font-serif">Edit Profile</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">First Name</label>
                <input 
                  required
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Last Name</label>
                <input 
                  required
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
              <input 
                required
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number</label>
              <input 
                required
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Date of Birth</label>
                <input 
                  required
                  type="date" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3A10E5] focus:bg-white dark:bg-[#151515] transition-colors duration-500 transition-colors"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3A10E5] hover:bg-[#2A08B5] text-white font-bold py-3.5 rounded-xl transition-all shadow-sm mt-8 disabled:opacity-70 flex justify-center items-center h-12"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Save Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
