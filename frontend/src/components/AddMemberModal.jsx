import React, { useState, useRef, useEffect } from 'react';
import { X, UserPlus, Upload, Camera, Check, Edit2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import heic2any from 'heic2any';
const sizes = [
  { id: 'S', name: 'S' },
  { id: 'M', name: 'M' },
  { id: 'L', name: 'L' },
  { id: 'XL', name: 'XL' },
  { id: 'XXL', name: 'XXL' }
];

export default function AddMemberModal({ isOpen, onClose, memberToEdit = null }) {
  const { addMember, updateMember } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Female',
    height: '',
    weight: '',
    size: 'M',
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (memberToEdit) {
        setFormData({
          name: memberToEdit.name || '',
          dob: memberToEdit.age ? `${new Date().getFullYear() - memberToEdit.age}-01-01` : '',
          gender: memberToEdit.gender || 'Female',
          height: memberToEdit.height ? memberToEdit.height.toString().replace(' cm', '') : '',
          weight: memberToEdit.weight ? memberToEdit.weight.toString().replace(' kg', '') : '',
          size: memberToEdit.size || 'M',
        });
        setAvatarPreview(memberToEdit.image && !memberToEdit.image.includes('body_') ? memberToEdit.image : null);
      } else {
        setFormData({ name: '', dob: '', gender: 'Female', height: '', weight: '', size: 'M' });
        setAvatarPreview(null);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, memberToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        const toastId = toast.loading("Converting HEIC photo...");
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8
          });
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          file = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
          toast.dismiss(toastId);
        } catch (error) {
          toast.dismiss(toastId);
          toast.error("Could not process HEIC photo");
          console.error(error);
          return;
        }
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let avatarUrl = null;
    
    try {
      if (avatarFile) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${session.user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile);
            
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            avatarUrl = publicUrl;
          } else {
            console.error("Upload error", uploadError);
            toast.error("Could not upload photo, saving member without it.");
          }
        }
      }

      let calculatedAge = null;
      if (formData.dob) {
        const today = new Date();
        const birthDate = new Date(formData.dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        calculatedAge = age;
      }

      if (memberToEdit) {
        await updateMember(memberToEdit.id, {
          ...formData,
          age: calculatedAge,
          height: `${formData.height} cm`,
          weight: formData.weight ? `${formData.weight} kg` : null,
          avatarUrl: avatarUrl || (memberToEdit.image && !memberToEdit.image.includes('body_') ? memberToEdit.image : null),
        });
      } else {
        await addMember({
          ...formData,
          age: calculatedAge,
          height: `${formData.height} cm`,
          weight: formData.weight ? `${formData.weight} kg` : null,
          avatarUrl,
        });
      }
      
      // Reset form
      setAvatarFile(null);
      setAvatarPreview(null);
      setFormData({
        name: '',
        dob: '',
        gender: 'Female',
        height: '',
        weight: '',
        size: 'M',
      });
      
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-md transition-all">
      <div className="min-h-full flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-[2rem] w-full max-w-[800px] shadow-2xl overflow-hidden border border-white/50 relative my-8"
          onClick={e => e.stopPropagation()}
        >
          {/* Header Background Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-50 via-white dark:via-[#0A0A0A] transition-colors duration-500 to-white dark:to-[#0A0A0A] transition-colors duration-500 opacity-80" />
        
        <div className="relative flex justify-between items-center p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3A10E5] to-[#7B5CF6] flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              {memberToEdit ? <Edit2 size={22} /> : <UserPlus size={22} />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F5F0E8] font-serif tracking-tight">{memberToEdit ? 'Edit Member' : 'Add Member'}</h2>
              <p className="text-xs text-gray-500 font-medium">{memberToEdit ? 'Update profile details' : 'Create a new profile for someone else'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 bg-white dark:bg-[#151515] transition-colors duration-500 hover:bg-gray-50 rounded-full p-2.5 transition-all shadow-sm border border-gray-100"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative p-6 pt-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Avatar & Basic Info */}
            <div className="flex flex-col">
              {/* Avatar Upload */}
              <div className="flex justify-center mb-6 mt-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#3A10E5] to-[#7B5CF6] rounded-full blur-sm opacity-20 scale-110" />
                  <div 
                    className="w-28 h-28 rounded-full bg-white dark:bg-[#151515] transition-colors duration-500 border-[3px] border-white shadow-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#3A10E5]/30 transition-all relative overflow-hidden group z-10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <>
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={24} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#3A10E5]/60 group-hover:text-[#3A10E5] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-[#3A10E5]/5 flex items-center justify-center mb-2 group-hover:bg-[#3A10E5]/10">
                          <Upload size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Add small floating icon */}
                  {!avatarPreview && (
                    <div className="absolute bottom-1 right-1 w-8 h-8 bg-white dark:bg-[#151515] transition-colors duration-500 rounded-full shadow-md border border-gray-100 flex items-center justify-center z-20 text-[#3A10E5]">
                      <Camera size={14} />
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/80 hover:border-[#3A10E5]/30 transition-colors focus-within:bg-white dark:bg-[#151515] transition-colors duration-500 focus-within:border-[#3A10E5] focus-within:ring-4 focus-within:ring-[#3A10E5]/10">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-3 pt-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Vinith S Shetty" 
                    className="w-full px-3 pb-2 pt-1 bg-transparent text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] focus:outline-none placeholder-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/80 hover:border-[#3A10E5]/30 transition-colors focus-within:bg-white dark:bg-[#151515] transition-colors duration-500 focus-within:border-[#3A10E5] focus-within:ring-4 focus-within:ring-[#3A10E5]/10">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-3 pt-2">Date of Birth</label>
                    <input 
                      required
                      type="date" 
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-3 pb-2 pt-1 bg-transparent text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] focus:outline-none placeholder-gray-300"
                    />
                  </div>
                  <div className="bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/80 hover:border-[#3A10E5]/30 transition-colors focus-within:bg-white dark:bg-[#151515] transition-colors duration-500 focus-within:border-[#3A10E5] focus-within:ring-4 focus-within:ring-[#3A10E5]/10 relative">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-3 pt-2">Gender</label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 pb-2 pt-1 bg-transparent text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Measurements & Body Shape */}
            <div className="flex flex-col space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/80 hover:border-[#3A10E5]/30 transition-colors focus-within:bg-white dark:bg-[#151515] transition-colors duration-500 focus-within:border-[#3A10E5] focus-within:ring-4 focus-within:ring-[#3A10E5]/10">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-3 pt-2">Height (cm)</label>
                  <input 
                    required
                    type="number" 
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="e.g. 175" 
                    className="w-full px-3 pb-2 pt-1 bg-transparent text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] focus:outline-none placeholder-gray-300"
                  />
                </div>
                <div className="bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/80 hover:border-[#3A10E5]/30 transition-colors focus-within:bg-white dark:bg-[#151515] transition-colors duration-500 focus-within:border-[#3A10E5] focus-within:ring-4 focus-within:ring-[#3A10E5]/10">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-3 pt-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Optional" 
                    className="w-full px-3 pb-2 pt-1 bg-transparent text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] focus:outline-none placeholder-gray-300"
                  />
                </div>
              </div>
              <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100/80 flex-1 flex flex-col">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Size</label>
                <div className="grid grid-cols-5 gap-2 flex-1 items-center justify-center">
                  {sizes.map((sizeObj) => (
                    <div 
                      key={sizeObj.id}
                      onClick={() => handleChange({ target: { name: 'size', value: sizeObj.id } })}
                      className={`relative flex items-center justify-center aspect-square rounded-full border-2 transition-all cursor-pointer h-10 w-10 mx-auto ${formData.size === sizeObj.id ? 'border-[#3A10E5] bg-[#3A10E5] text-white shadow-md' : 'border-gray-200 bg-white dark:bg-[#151515] transition-colors duration-500 text-gray-700 hover:border-gray-300 shadow-sm'}`}
                    >
                      <span className="text-[12px] font-bold uppercase tracking-wider">{sizeObj.name}</span>
                      {formData.size === sizeObj.id && (
                        <div className="absolute -top-1 -right-1 bg-white dark:bg-[#151515] transition-colors duration-500 text-[#3A10E5] rounded-full shadow-sm">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#3A10E5] to-[#6A3DE8] hover:from-[#2A08B5] hover:to-[#5A2DE8] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#3A10E5]/25 mt-8 disabled:opacity-70 flex justify-center items-center h-[56px] hover:shadow-xl hover:shadow-[#3A10E5]/30 hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              memberToEdit ? 'Save Changes' : 'Save Member Profile'
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
