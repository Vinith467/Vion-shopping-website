import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, EyeOff, Eye } from "lucide-react";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full min-h-screen flex bg-white">
      
      {/* Left Side - Image (Hidden on Mobile) */}
      <div className="hidden md:block w-1/2 relative bg-black">
        <img 
          src="/images/fash_fit_hero.jpg" 
          alt="Fashion Lifestyle" 
          className="w-full h-full object-cover opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Overlay Content */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h1 className="text-4xl font-serif font-bold mb-4">Your Personal Style, Perfected.</h1>
          <p className="text-sm font-medium text-gray-300">
            Join VionFashion to unlock AI-powered try-ons, personalized size recommendations, and a wardrobe curated just for you.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 py-12 relative h-screen overflow-y-auto">
        
        {/* Back Button (Mobile only) */}
        <button 
          onClick={() => navigate('/home')} 
          className="md:hidden absolute top-6 left-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-900" />
        </button>

        {/* Desktop Close/Back Button */}
        <button 
          onClick={() => navigate('/home')} 
          className="hidden md:flex absolute top-8 right-8 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors items-center gap-2"
        >
          Close <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Logo (Mobile only, Desktop relies on back button/image) */}
        <div className="md:hidden flex flex-col items-center mb-10 mt-6">
          <h1 className="text-3xl font-serif tracking-widest text-gray-900">VION<span className="text-[#a14088]">FASHION</span></h1>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-2">Login to continue your style journey</p>
          </div>
          
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); navigate('/home'); }}>
            <div className="space-y-4">
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Email or Phone Number" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a14088] focus:bg-white transition-colors"
                />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a14088] focus:bg-white transition-colors"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#a14088] focus:ring-[#a14088]" />
                <span className="text-xs text-gray-600 font-medium">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-[#a14088] hover:text-[#853470]">
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#a14088] text-white font-bold text-sm py-3.5 rounded-xl mt-6 hover:bg-[#853470] transition-colors shadow-lg shadow-pink-900/20"
            >
              Login securely
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="bg-white border border-gray-200 h-12 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            </button>
            <button className="bg-white border border-gray-200 h-12 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
              <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5" alt="Apple" />
            </button>
            <button className="bg-white border border-gray-200 h-12 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
            </button>
          </div>

          <p className="text-center text-sm font-medium text-gray-500 mt-10">
            Don't have an account? <button className="text-[#a14088] font-bold hover:underline ml-1">Sign Up</button>
          </p>

        </div>
      </div>

    </div>
  );
}
