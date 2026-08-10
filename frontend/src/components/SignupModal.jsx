import React, { useState, useRef } from 'react';
import { User, Mail, Lock, EyeOff, Eye, ChevronDown, Check, ShieldCheck, Heart, Sparkles, X, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BodyShapeTooltip from './BodyShapeTooltip';

import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';

const skinColors = ['#F9E4D4', '#F4D3B6', '#E6B999', '#C28E66', '#985F35', '#6A3B18'];

const bodyTypes = [
  { id: 'Inverted Triangle', name: 'Inverted Triangle', img: '/images/shapes/inverted_triangle.png' },
  { id: 'Apple', name: 'Apple', img: '/images/shapes/apple.png' },
  { id: 'Hourglass', name: 'Hourglass', img: '/images/shapes/hourglass.png' },
  { id: 'Pear', name: 'Pear', img: '/images/shapes/pear.png' },
  { id: 'Rectangle', name: 'Rectangle', img: '/images/shapes/rectangle.png' }
];

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [selectedSkin, setSelectedSkin] = useState(skinColors[0]);
  const [selectedBody, setSelectedBody] = useState('Hourglass');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [heightValue, setHeightValue] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [dob, setDob] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Gender');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const fileInputRef = useRef(null);

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculatedAge = calculateAge(dob);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      setProfileImageFile(e.target.files[0]);
    }
  };

  const isFormValid = 
    name.trim() !== '' && 
    gender !== 'Gender' && 
    dob !== '' && 
    heightValue.trim() !== '' && 
    email.trim() !== '' && 
    password !== '' && 
    confirmPassword !== '' && 
    password === confirmPassword && 
    termsAccepted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    try {
      // Calculate height in CM
      let finalHeight = parseInt(heightValue);
      if (heightUnit === 'ft') {
        // crude conversion: assuming input is like "5.8"
        finalHeight = Math.round(parseFloat(heightValue) * 30.48);
      }

      // 1. Sign up the user with Supabase Auth
      // We pass the personalization data in the metadata, which our secure SQL trigger will read!
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            age: calculatedAge,
            gender: gender,
            height_cm: finalHeight,
            body_shape: selectedBody,
            skin_tone: selectedSkin
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.session && profileImageFile) {
        try {
          const fileExt = profileImageFile.name.split('.').pop();
          const fileName = `${authData.session.user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, profileImageFile);
            
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
              
            await supabase
              .from('consumers')
              .update({ avatar_url: publicUrl })
              .eq('user_id', authData.session.user.id)
              .eq('is_primary', true);
          } else {
             console.error("Avatar upload error:", uploadError);
          }
        } catch (uploadErr) {
          console.error("Failed to upload avatar:", uploadErr);
        }
      }
      
      if (!authData.session) {
        toast.success("Account created! Please check your email to confirm.");
      } else {
        toast.success("Account created successfully!");
        if (email.toLowerCase() === 'admin@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/account', { state: { activeTab: 'home' } });
        }
      }
      
      onClose(); // Close the modal
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Close Button (Absolute to Modal) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full text-gray-500 hover:text-black shadow-md transition-colors"
        >
          <X size={20} />
        </button>

        <form className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden" onSubmit={(e) => e.preventDefault()}>
          
          {/* Left Column (Profile & Personalization) */}
          <div className="w-full md:w-[50%] h-auto md:h-full px-6 md:px-10 py-8 flex flex-col justify-start overflow-y-auto bg-white z-10 md:border-r border-gray-100 shrink-0">
            <div className="mb-6 shrink-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-1 font-serif relative inline-block">
                Join VionFashion
                <Sparkles className="absolute -top-2 -right-5 text-purple-300 w-4 h-4" />
              </h2>
              <p className="text-gray-500 text-xs">Create your profile for personalized style recommendations.</p>
            </div>

            <div className="space-y-5 flex-1">
              
              {/* Profile Image & Name */}
              <div className="flex items-center gap-4">
                <div 
                  className="relative w-16 h-16 rounded-full bg-gray-50 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-purple-500 overflow-hidden shrink-0 group transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={20} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
                
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full border border-gray-200 text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full my-2"></div>

              {/* Personalization Fields */}
              <div className="space-y-4">
                {/* Gender & Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative bg-white rounded-lg border border-gray-200">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <span className="text-sm">♂♀</span>
                    </div>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border-none bg-transparent text-xs rounded-lg py-2.5 pl-9 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-600">
                      <option>Gender</option>
                      <option>Female</option>
                      <option>Male</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                  <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <span className="text-sm">📅</span>
                    </div>
                    <input 
                      type="date" 
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full border-none bg-transparent text-xs rounded-lg py-[9px] pl-9 pr-14 focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-600 uppercase"
                    />
                    {calculatedAge !== null && !isNaN(calculatedAge) && (
                      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">
                          {calculatedAge}y
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skin Color */}
                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Skin Color</h3>
                  <div className="flex items-center gap-2">
                    {skinColors.map((color, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSkin(color)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${selectedSkin === color ? 'border-purple-600 scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Body Type */}
                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Body Type</h3>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {bodyTypes.map((type) => (
                      <BodyShapeTooltip key={type.id} id={type.name} img={type.img}>
                        <button
                          type="button"
                          onClick={() => setSelectedBody(type.id)}
                          className={`relative flex flex-col overflow-hidden rounded-xl border transition-all min-w-[70px] flex-1 shrink-0 ${
                            selectedBody === type.id ? 'border-purple-600 ring-1 ring-purple-600' : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="w-full aspect-[4/5] bg-gray-50 flex items-center justify-center">
                            <img src={type.img} alt={type.name} className="w-full h-full object-cover" />
                          </div>
                          <div className={`w-full py-1 text-center border-t ${selectedBody === type.id ? 'bg-purple-50/50 border-purple-600/20' : 'bg-white border-gray-100'}`}>
                            <span className={`text-[9px] font-bold tracking-wide uppercase ${selectedBody === type.id ? 'text-purple-700' : 'text-gray-600'}`}>{type.name}</span>
                          </div>
                          {selectedBody === type.id && (
                            <div className="absolute top-1 right-1 bg-purple-600 text-white rounded-full p-0.5 shadow-sm">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      </BodyShapeTooltip>
                    ))}
                  </div>
                </div>

                {/* Height */}
                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Height</h3>
                  <div className="flex items-center rounded-lg bg-white border border-gray-200 overflow-hidden">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <span className="text-xs">📏</span>
                      </div>
                      <input type="text" value={heightValue} onChange={(e) => setHeightValue(e.target.value)} placeholder="165" className="w-full border-none bg-transparent text-xs py-2 pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-purple-500" />
                    </div>
                    <div className="flex border-l border-gray-200 h-[34px] bg-gray-50">
                      <button 
                        type="button"
                        onClick={() => setHeightUnit('cm')}
                        className={`px-4 text-xs font-semibold transition-colors ${heightUnit === 'cm' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                        cm
                      </button>
                      <button 
                        type="button"
                        onClick={() => setHeightUnit('ft')}
                        className={`px-4 text-xs font-semibold transition-colors border-l border-gray-200 ${heightUnit === 'ft' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                        ft
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Account Security) */}
          <div className="w-full md:w-[50%] h-auto md:h-full bg-gradient-to-br from-[#F5EFFF] to-white relative flex flex-col px-6 md:px-10 py-8 md:py-10 justify-center shrink-0">
            
            <div className="mb-8 shrink-0">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1 relative inline-block">
                Secure Account
                <ShieldCheck className="absolute -top-3 -right-8 text-purple-400 w-6 h-6" />
              </h2>
              <p className="text-gray-500 text-xs">Set up your login details.</p>
            </div>
            
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address or Phone Number" className="w-full border border-gray-200 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white" />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border border-gray-200 text-sm rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full border border-gray-200 text-sm rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="pt-2 space-y-5">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-xs text-gray-500 leading-snug">
                    I agree to the <a href="#" className="text-purple-600 font-medium hover:underline">Terms & Conditions</a> and <a href="#" className="text-purple-600 font-medium hover:underline">Privacy Policy</a>
                  </span>
                </label>

                <button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={!isFormValid || isLoading}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg ${isFormValid && !isLoading ? 'bg-[#111] hover:bg-black text-white shadow-black/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-transparent'}`}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <button type="button" onClick={onSwitchToLogin} className="text-purple-600 font-bold hover:text-purple-800 transition-colors">
                    Login
                  </button>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
