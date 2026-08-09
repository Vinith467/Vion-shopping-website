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
      <div className="relative z-10 w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full text-gray-500 hover:text-black shadow-md transition-colors"
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
          <div className="w-full md:w-[50%] h-auto md:h-full bg-gradient-to-br from-[#F5EFFF] to-white relative flex flex-col px-8 py-10 md:px-12 justify-center shrink-0">
            
            <div className="mb-8 shrink-0">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 relative inline-block">
                Login
                <Sparkles className="absolute -top-3 -right-6 text-purple-400 w-5 h-5" />
              </h2>
              <p className="text-gray-500 text-sm">Enter your details to access your account.</p>
            </div>
            
            <form className="space-y-6 flex-1 flex flex-col justify-center" onSubmit={handleLogin}>
              
              <div className="space-y-4">
                <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email Address or Phone Number" className="w-full border-none bg-transparent text-sm py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-purple-500" />
                </div>
                
                <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full border-none bg-transparent text-sm py-3.5 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                <div className="flex justify-end pt-1">
                  <a href="#" className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors">Forgot Password?</a>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 space-y-6">
                <button disabled={isLoading} type="submit" className="w-full bg-[#111] hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-black/20">
                  {isLoading ? 'Logging in...' : 'Login'}
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
                  <button type="button" className="flex-1 flex justify-center py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  </button>
                  <button type="button" className="flex-1 flex justify-center py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5" />
                  </button>
                  <button type="button" className="flex-1 flex justify-center py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center text-sm text-gray-500 pt-2">
                  Don't have an account?{' '}
                  <button type="button" onClick={onSwitchToSignup} className="text-purple-600 font-bold hover:text-purple-800 transition-colors">
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
