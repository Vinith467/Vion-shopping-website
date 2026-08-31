import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, Ruler, Weight, User, Save, Upload, AlertCircle, ArrowRight, Check, Target, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';

const sizes = [
  { id: 'S', name: 'S' },
  { id: 'M', name: 'M' },
  { id: 'L', name: 'L' },
  { id: 'XL', name: 'XL' },
  { id: 'XXL', name: 'XXL' }
];

export default function MyMeasurementsTab() {
  const location = useLocation();
  const { measurements: globalMeasurements, saveMeasurements, members, updateMemberImage, updateMember } = useAppContext();
  
  const targetMemberId = location.state?.memberId;
  const targetConsumer = targetMemberId ? members.find(m => m.id === targetMemberId) : (members.find(m => m.isPrimary) || members[0] || {});
  
  const [activeUnit, setActiveUnit] = useState('inches');
  // For secondary members, globalMeasurements might not apply, but we fallback to it or parse their height.
  const initialHeightUnit = globalMeasurements.heightUnit || 'cm';
  const initialHeight = targetConsumer.height ? targetConsumer.height.replace(/[^0-9.]/g, '') : '';
  const initialSize = targetConsumer.size || globalMeasurements.size || 'M';
  
  const skinTones = [
    { id: 'Light', color: '#E8BE95' },
    { id: 'Medium Light', color: '#D89F70' },
    { id: 'Medium', color: '#B57B52' },
    { id: 'Medium Deep', color: '#8B5A33' }
  ];

  const initialSkinTone = targetConsumer.skinTone || 'Light';

  const [heightUnit, setHeightUnit] = useState(initialHeightUnit);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedSkinTone, setSelectedSkinTone] = useState(initialSkinTone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMeasurements, setLocalMeasurements] = useState({ ...globalMeasurements, ...(targetConsumer.measurements || {}), height: initialHeight });

  const [name, setName] = useState(targetConsumer.name || '');
  const [gender, setGender] = useState(targetConsumer.gender || 'Female');
  const [age, setAge] = useState(targetConsumer.age || 25);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = React.useRef(null);

  useEffect(() => {
    if (!targetMemberId) {
      setLocalMeasurements(prev => ({ ...prev, ...globalMeasurements }));
    }
  }, [globalMeasurements, targetMemberId]);

  useEffect(() => {
    setName(targetConsumer.name || '');
    setGender(targetConsumer.gender || 'Female');
    setAge(targetConsumer.age || 25);
    setSelectedSize(targetConsumer.size || 'M');
    if (targetConsumer.height) {
      setLocalMeasurements(prev => ({ ...prev, height: targetConsumer.height.replace(/[^0-9.]/g, '') }));
    }
    setSelectedSkinTone(targetConsumer.skinTone || 'Very Light');
  }, [targetConsumer]);

  const handleMeasurementChange = (key, value) => {
    setLocalMeasurements(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in first.");

      const consumerId = targetConsumer.id;
      if (!consumerId) throw new Error("No consumer profile found.");

      const updatedHeightCm = heightUnit === 'cm' ? parseInt(localMeasurements.height || 0) : Math.round(parseFloat(localMeasurements.height || 0) * 30.48);

      // Update local members state and backend consumers table
      await updateMember(consumerId, {
        name: name,
        gender: gender,
        age: parseInt(age) || 25,
        size: selectedSize,
        height: updatedHeightCm,
        skinTone: selectedSkinTone,
        measurements: localMeasurements
      });

      // Save locally to context for primary consumer only if we're editing primary
      if (targetConsumer.isPrimary) {
        await saveMeasurements({
          ...localMeasurements,
          size: selectedSize,
          heightUnit,
        });
      }

      toast.success("Measurements saved to your profile! Refresh to see updated details everywhere.");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save measurements.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      await supabase
        .from('consumers')
        .update({ avatar_url: publicUrl })
        .eq('id', targetConsumer.id);
        
      updateMemberImage(targetConsumer.id, publicUrl);
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const bodyTypes = [
    { id: 'Inverted Triangle', img: '/images/shapes/inverted_triangle.png' },
    { id: 'Apple', img: '/images/shapes/apple.png' },
    { id: 'Hourglass', img: '/images/shapes/hourglass.png' },
    { id: 'Pear', img: '/images/shapes/pear.png' },
    { id: 'Rectangle', img: '/images/shapes/rectangle.png' }
  ];

  const measurementsConfig = [
    { id: 'height', label: 'Height', valKey: 'height' },
    { id: 'shoulder_width', label: 'Shoulder Width', valKey: 'shoulder_width' },
    { id: 'chest_bust', label: 'Chest / Bust', valKey: 'chest_bust' },
    { id: 'arms_length', label: 'Arms Length', valKey: 'arms_length' },
    { id: 'biceps', label: 'Biceps (Around)', valKey: 'biceps' },
    { id: 'waist', label: 'Waist', valKey: 'waist' },
    { id: 'hips', label: 'Hips', valKey: 'hips' },
    { id: 'wrist', label: 'Wrist', valKey: 'wrist' },
    { id: 'thigh', label: 'Thigh', valKey: 'thigh' },
    { id: 'calf', label: 'Calf', valKey: 'calf' },
    { id: 'ankle', label: 'Ankle', valKey: 'ankle' },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* 1. Header & Summary */}
      <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F5F0E8] mb-1 font-serif">My Measurements</h2>
          <p className="text-sm text-gray-500">Keep your measurements up to date for perfect fit recommendations.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-green-800">Profile Complete</span>
              <span className="text-[10px] text-green-600">You'll get size recommendations</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Measurements Content Area */}
      <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-[#F5F0E8] mb-6">Detailed Measurements</h3>
        
        <div className="flex flex-col xl:flex-row gap-8 mb-8 items-start">
          
          {/* Visual Guide (User Provided Image) */}
          <div className="w-full xl:w-[50%] flex justify-center items-start rounded-2xl shrink-0 overflow-visible pt-4 xl:sticky xl:top-6">
            <img 
              src={gender === 'Male' ? "/images/mens_measurement_guide.png" : "/images/womens_measurement_guide.png"} 
              alt="Measurement Guide" 
              className="w-full h-auto max-w-[600px] object-contain mix-blend-multiply drop-shadow-md transform scale-[1.05] origin-top" 
            />
          </div>

          {/* Form Fields & Unit Toggle */}
          <div className="w-full xl:w-[50%] flex flex-col gap-5 py-2 z-10 relative">
            <div className="flex justify-end">
              {/* Unit Toggle */}
              <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200 shrink-0">
                <button 
                  onClick={() => setActiveUnit('inches')}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeUnit === 'inches' ? 'bg-white dark:bg-[#151515] transition-colors duration-500 text-[#3A10E5] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Inches
                </button>
                <button 
                  onClick={() => setActiveUnit('cm')}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeUnit === 'cm' ? 'bg-white dark:bg-[#151515] transition-colors duration-500 text-[#3A10E5] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  CM
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {measurementsConfig.map((item, index) => (
                <div key={item.id} className="group flex items-center gap-3 bg-gray-50/50 hover:bg-[#3A10E5]/5 p-2.5 rounded-xl border border-gray-100 hover:border-[#3A10E5]/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#3A10E5] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-700 mb-0.5 block">{item.label}</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={localMeasurements[item.valKey] || ''}
                        onChange={(e) => handleMeasurementChange(item.valKey, e.target.value)}
                        className="w-full bg-white dark:bg-[#151515] transition-colors duration-500 border border-gray-200 rounded-lg py-2 px-3 text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] focus:outline-none focus:border-[#3A10E5] focus:ring-1 focus:ring-[#3A10E5]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                        {activeUnit === 'inches' ? 'in' : 'cm'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center pt-6 border-t border-gray-100 gap-4">
          
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-[#3A10E5] hover:bg-[#2A08B5] text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>

      </div>

      {/* 3. Personal Information Card */}
      <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-[#F5F0E8] mb-6">Personal Information</h3>
        
        {/* Profile Basic Info Row */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {/* Avatar */}
          <div className="relative shrink-0 w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm self-center sm:self-start group cursor-pointer" onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}>
            <img src={targetConsumer.image || "/images/shapes/hourglass.png"} alt="Profile" className={`w-full h-full object-cover transition-opacity ${isUploadingAvatar ? 'opacity-50' : 'group-hover:opacity-80'}`} />
            {isUploadingAvatar ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              </div>
            ) : (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-[#151515] transition-colors duration-500 rounded-full border border-gray-200 flex items-center justify-center text-[#3A10E5] shadow-sm hover:bg-gray-50 transition-colors pointer-events-none group-hover:scale-110">
                <Camera size={14} />
              </button>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={avatarInputRef}
              onChange={handleAvatarUpload}
            />
          </div>
          
          {/* Form Fields */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="border border-gray-200 rounded-xl p-3 flex flex-col justify-center bg-white dark:bg-[#151515] transition-colors duration-500 relative">
              <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider absolute top-2 left-3">Name</label>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
                  <span className="text-xs">👤</span>
                </div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] outline-none" />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 border border-gray-200 rounded-xl p-3 flex flex-col justify-center bg-white dark:bg-[#151515] transition-colors duration-500 relative">
                <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider absolute top-2 left-3">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-3 w-full bg-transparent text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] outline-none appearance-none">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-3 bottom-3 pointer-events-none">
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1 border border-gray-200 rounded-xl p-3 flex flex-col justify-center bg-white dark:bg-[#151515] transition-colors duration-500 relative">
                <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider absolute top-2 left-3">Age</label>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-gray-400 text-xs">📅</span>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-transparent text-sm font-semibold text-gray-900 dark:text-[#F5F0E8] outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">Size</h4>
          <p className="text-xs text-gray-500 mb-4">Select the option that best represents you</p>
          <div className="grid grid-cols-5 gap-3">
            {sizes.map((sizeObj) => (
              <div 
                key={sizeObj.id}
                onClick={() => setSelectedSize(sizeObj.id)}
                className={`relative flex items-center justify-center aspect-square rounded-full border-2 transition-all cursor-pointer h-12 w-12 mx-auto ${selectedSize === sizeObj.id ? 'border-[#3A10E5] bg-[#3A10E5] text-white shadow-md' : 'border-gray-200 bg-white dark:bg-[#151515] transition-colors duration-500 text-gray-700 hover:border-gray-300 shadow-sm'}`}
              >
                <span className="text-[12px] font-bold uppercase tracking-wider">{sizeObj.name}</span>
                {selectedSize === sizeObj.id && (
                  <div className="absolute -top-1 -right-1 bg-white dark:bg-[#151515] transition-colors duration-500 text-[#3A10E5] rounded-full shadow-sm">
                    <Check size={12} strokeWidth={4} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Height & Skin Tone Row */}
        <div className="flex flex-col sm:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-[#F5F0E8] mb-3">Height</h4>
            <div className="flex items-center border border-gray-200 rounded-xl p-2 bg-white dark:bg-[#151515] transition-colors duration-500 ">
              <span className="text-gray-400 pl-2">📏</span>
              <input 
                type="text" 
                value={localMeasurements.height || ''} 
                onChange={(e) => handleMeasurementChange('height', e.target.value)}
                className="flex-1 w-full bg-transparent px-3 text-sm font-semibold outline-none" 
              />
              <div className="flex bg-gray-100 rounded-lg p-1 shrink-0">
                <button onClick={() => setHeightUnit('cm')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${heightUnit === 'cm' ? 'bg-[#3A10E5] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>cm</button>
                <button onClick={() => setHeightUnit('ft')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${heightUnit === 'ft' ? 'bg-[#3A10E5] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>ft</button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">Skin Tone</h4>
            <p className="text-xs text-gray-500 mb-3">Select your skin tone</p>
            <div className="flex gap-2.5">
              {skinTones.map((tone) => (
                <div 
                  key={tone.id}
                  onClick={() => setSelectedSkinTone(tone.id)}
                  className={`relative w-8 h-8 rounded-full cursor-pointer transition-all ${selectedSkinTone === tone.id ? 'ring-2 ring-offset-2 ring-[#3A10E5]' : 'ring-1 ring-gray-200 hover:scale-110'}`}
                  style={{ backgroundColor: tone.color }}
                >
                  {selectedSkinTone === tone.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check size={12} className="text-[#3A10E5]" strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#3A10E5]/5 rounded-xl p-4 flex items-start gap-4 mb-8 border border-[#3A10E5]/10">
          <div className="text-[#3A10E5] mt-1 shrink-0">
            <Sparkles size={20} />
          </div>
          <p className="text-sm text-[#3A10E5] font-medium leading-relaxed">
            This helps us recommend outfits that fit and flatter you the best.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-auto">
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 bg-[#3A10E5] hover:bg-[#2A08B5] text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Save & Continue <ArrowRight size={16} /></>
            )}
          </button>
          <button className="flex-1 bg-white dark:bg-[#151515] transition-colors duration-500 hover:bg-gray-50 text-[#3A10E5] border border-[#3A10E5]/20 text-sm font-bold py-3.5 rounded-xl transition-all">
            Skip for now
          </button>
        </div>
      </div>

          </div>
  );
}