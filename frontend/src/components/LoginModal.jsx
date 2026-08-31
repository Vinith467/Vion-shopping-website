import React, { useState } from 'react';
import { Mail, Lock, EyeOff, Eye, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      login(); // Keep the context updated
      toast.success("Successfully logged in!");
      onClose();
      
      if (email.toLowerCase() === 'admin@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/account', { state: { activeTab: 'members' } });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-5xl h-[90vh] bg-white/70 dark:bg-[#151515]/70 transition-colors duration-500 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/60 flex overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 backdrop-blur-md rounded-full text-gray-600 hover:bg-white dark:bg-[#151515] transition-colors duration-500 hover:text-black shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-white/60 transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden">
          
          {/* Left Column (Image) */}
          <div className="w-full md:w-[50%] h-[40vh] md:h-full bg-black relative shrink-0">
            <img src="/images/fash_fit_hero.jpg" alt="Login Fashion" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-10 md:right-10 text-white">
              <h2 className="text-3xl font-serif font-bold mb-2">Welcome Back</h2>
              <p className="text-sm text-gray-200">Discover new styles, track your orders, and enjoy personalized recommendations tailored just for you.</p>
            </div>
          </div>

          {/* Right Column (Login Form) */}
          <div className="w-full md:w-[50%] h-auto md:h-full bg-gradient-to-br from-white/60 to-white/20 relative flex flex-col px-8 py-10 md:px-12 justify-center shrink-0">
            
            <div className="mb-8 shrink-0">
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-[#F5F0E8] mb-2 relative inline-block drop-shadow-sm">
                Login
                <Sparkles className="absolute -top-3 -right-6 text-[#C49A5C] w-5 h-5 drop-shadow-md" />
              </h2>
              <p className="text-gray-600 text-sm font-medium">Enter your details to access your account.</p>
            </div>
            
            <form className="space-y-6 flex-1 flex flex-col justify-center" onSubmit={handleLogin}>
              
              <div className="space-y-4">
                <div className="relative bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 backdrop-blur-md rounded-xl border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_2px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 focus-within:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 focus-within:shadow-[0_4px_15px_rgba(184,135,70,0.15)]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email Address or Phone Number" className="w-full border-none bg-transparent text-sm py-4 pl-12 pr-4 focus:outline-none placeholder-gray-500 font-medium text-gray-800 dark:text-[#F5F0E8]" />
                </div>
                
                <div className="relative bg-white/40 dark:bg-[#151515]/40 transition-colors duration-500 backdrop-blur-md rounded-xl border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_2px_10px_rgba(0,0,0,0.03)] transition-all hover:bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 focus-within:bg-white/60 dark:bg-[#151515]/60 transition-colors duration-500 focus-within:shadow-[0_4px_15px_rgba(184,135,70,0.15)]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full border-none bg-transparent text-sm py-4 pl-12 pr-12 focus:outline-none placeholder-gray-500 font-medium text-gray-800 dark:text-[#F5F0E8]" />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-800 dark:text-[#F5F0E8] transition-colors">
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-end pt-1">
                <a href="#" className="text-xs font-bold text-[#906227] drop-shadow-sm hover:text-[#704918] transition-colors">Forgot Password?</a>
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{
                    background: isLoading ? 'rgba(255,255,255,0.5)' : 'linear-gradient(135deg, #4A1A18 0%, #2A0C0A 100%)',
                    boxShadow: isLoading ? 'none' : 'inset 0 1px 1px rgba(255,255,255,0.2), 0 8px 20px rgba(74,26,24,0.3)'
                  }}
                  className={`w-full font-bold py-4 rounded-xl border border-white/20 transition-all duration-300 relative overflow-hidden group ${!isLoading ? 'text-[#E5CDA7] hover:scale-[1.02] active:scale-[0.98]' : 'text-gray-400 cursor-not-allowed'}`}
                >
                  {/* Glossy sheen overlay on button */}
                  {!isLoading && <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                  <span className="relative z-10">{isLoading ? 'Logging in...' : 'Login'}</span>
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#fcfaff] px-4 text-gray-400 font-bold tracking-wider uppercase">or continue with</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <button type="button" className="flex-1 flex justify-center py-3 bg-white dark:bg-[#151515] transition-colors duration-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  </button>
                  <button type="button" className="flex-1 flex justify-center py-3 bg-white dark:bg-[#151515] transition-colors duration-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5" />
                  </button>
                  <button type="button" className="flex-1 flex justify-center py-3 bg-white dark:bg-[#151515] transition-colors duration-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600 pt-2 font-medium">
                  Don't have an account?{' '}
                <button type="button" onClick={onSwitchToSignup} className="text-[#906227] font-bold hover:text-[#704918] drop-shadow-sm transition-colors">
                  Sign Up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
