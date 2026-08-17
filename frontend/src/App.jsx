import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import LoginScreen from './screens/LoginScreen';
import AccountScreen from './screens/AccountScreen';
import ExploreScreen from './screens/ExploreScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AdminLayout from './screens/admin/AdminLayout';
import AdminDashboard from './screens/admin/AdminDashboard';
import AdminUsers from './screens/admin/AdminUsers';
import AdminInventory from './screens/admin/AdminInventory';
import AdminCategories from './screens/admin/AdminCategories';
import AdminPreferences from './screens/admin/AdminPreferences';
import AdminOrders from './screens/admin/AdminOrders';
import BottomNav from './components/BottomNav';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import ScrollToTop from './components/ScrollToTop';
import { Compass, Sparkles, ShoppingBag, User, Search, Heart, ChevronDown, Mail, Lock, EyeOff, Diamond, Truck, Headphones, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

// We'll build these screens in later phases
const PlaceholderScreen = ({ title }) => (
  <div className="flex items-center justify-center h-full text-gray-400 min-h-screen">
    {title} Screen coming soon...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAppContext();
  
  useEffect(() => {
    if (!isLoggedIn) {
      window.dispatchEvent(new Event('openLoginModal'));
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { isLoggedIn, profile } = useAppContext();
  
  useEffect(() => {
    if (!isLoggedIn) {
      window.dispatchEvent(new Event('openLoginModal'));
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/home" replace />;
  }
  
  // We check if the email is our admin email
  if (profile?.email !== 'admin@gmail.com') {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, profile, members, selectedConsumerId } = useAppContext();
  const activeMember = members?.find(m => m.id === selectedConsumerId) || members?.find(m => m.isPrimary) || members?.[0];
  const isMainTab = ['/home', '/explore', '/wardrobe', '/account', '/onboarding'].includes(location.pathname);
  const isHome = location.pathname === '/home';
  const isOnboarding = location.pathname === '/onboarding';
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => setShowSignupModal(true);
    window.addEventListener('openLoginModal', handleOpenLogin);
    return () => window.removeEventListener('openLoginModal', handleOpenLogin);
  }, []);

  return (
    <div className="bg-white min-h-[100dvh] w-full flex flex-col">
      <ScrollToTop />
      <Toaster position="top-center" />
      {/* Desktop Top Navigation */}
      {isMainTab && (
        <nav className="hidden md:flex items-center justify-between px-8 lg:px-14 py-2 sticky top-0 bg-[#F5F0E8]/80 backdrop-blur-md text-[#111111] z-50 border-b border-[#111111]/5 shadow-sm">
          
          {/* Brand & Tagline */}
          <Link to="/home" className="flex flex-col cursor-pointer group whitespace-nowrap">
            <span className="text-3xl lg:text-4xl font-serif font-bold tracking-widest text-[#1A0A08] leading-none">
              VION
            </span>
            <span className="text-[10px] lg:text-[11px] font-serif font-semibold text-[#5A4232] tracking-wide mt-1" style={{ letterSpacing: '0.04em' }}>
              Made For You. Made To Suit You.
            </span>
          </Link>

          {/* Center Section - Nav Links or Trust Badges */}
          {isOnboarding ? (
            <div className="flex items-center gap-3 xl:gap-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border border-[#8B6544]/60 flex items-center justify-center">
                  <Diamond className="text-[#8B6544] w-[14px] h-[14px]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-[900] text-[#000000] tracking-wide leading-none" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>BESPOKE EXPERIENCE</p>
                  <p className="text-[9px] font-[700] text-[#3E2312] leading-none mt-0.5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Tailored just for you.</p>
                </div>
              </div>
              <div className="w-px h-5 bg-[#111111]/20"></div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border border-[#8B6544]/60 flex items-center justify-center">
                  <Award className="text-[#8B6544] w-[14px] h-[14px]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-[900] text-[#000000] tracking-wide leading-none" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>PREMIUM QUALITY</p>
                  <p className="text-[9px] font-[700] text-[#3E2312] leading-none mt-0.5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Finest fabrics</p>
                </div>
              </div>
              <div className="w-px h-5 bg-[#111111]/20"></div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border border-[#8B6544]/60 flex items-center justify-center">
                  <Truck className="text-[#8B6544] w-[14px] h-[14px]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-[900] text-[#000000] tracking-wide leading-none" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>WORLDWIDE DELIVERY</p>
                  <p className="text-[9px] font-[700] text-[#3E2312] leading-none mt-0.5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Complimentary shipping</p>
                </div>
              </div>
              <div className="w-px h-5 bg-[#111111]/20"></div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border border-[#8B6544]/60 flex items-center justify-center">
                  <Headphones className="text-[#8B6544] w-[14px] h-[14px]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-[900] text-[#000000] tracking-wide leading-none" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>EXPERT SUPPORT</p>
                  <p className="text-[9px] font-[700] text-[#3E2312] leading-none mt-0.5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Here for you.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 lg:gap-6 text-[16px] lg:text-[18px] font-bold text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              <button onClick={() => navigate('/explore')} className="hover:text-[#A87B45] transition-colors">Women</button>
              <button onClick={() => navigate('/explore')} className="hover:text-[#A87B45] transition-colors">Men</button>
              <button onClick={() => navigate('/home#occasions')} className="hover:text-[#A87B45] transition-colors">Occasion</button>
              <button onClick={() => navigate('/explore')} className="hover:text-[#A87B45] transition-colors">New In</button>
              <button onClick={() => navigate('/explore')} className="hover:text-[#A87B45] transition-colors">Lookbook</button>
              <button onClick={() => navigate('/explore')} className="hover:text-[#A87B45] transition-colors flex items-center gap-1.5">
                <span>VION For You</span>
                <span className="bg-gradient-to-r from-[#B88746] to-[#906227] text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">NEW</span>
              </button>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-6 text-[#111111]">
            <div className="flex items-center gap-5">
              <button 
                onClick={() => navigate('/explore')} 
                className="hover:text-[#A87B45] transition-colors"
                title="Search"
              >
                <Search size={21} strokeWidth={1.8} />
              </button>
              <button 
                onClick={() => isLoggedIn ? navigate('/account', { state: { activeTab: 'saved' } }) : setShowSignupModal(true)} 
                className="hover:text-[#A87B45] transition-colors"
                title="Wishlist"
              >
                <Heart size={21} strokeWidth={1.8} />
              </button>
              <button 
                onClick={() => isLoggedIn ? navigate('/cart') : setShowSignupModal(true)} 
                className="hover:text-[#A87B45] transition-colors relative"
                title="Cart"
              >
                <ShoppingBag size={21} strokeWidth={1.8} />
                <span className="absolute -top-1.5 -right-2 w-4.5 h-4.5 bg-[#9C733F] text-white text-[10px] font-sans font-bold rounded-full flex items-center justify-center shadow-xs">2</span>
              </button>
            </div>
            
            {/* Login Container with Hover Popover */}
            <div 
              className="relative flex items-center pl-2"
              onMouseEnter={() => setIsLoginHovered(true)}
              onMouseLeave={() => setIsLoginHovered(false)}
            >
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    if (profile?.email === 'admin@gmail.com') navigate('/admin');
                    else navigate('/account');
                  } else {
                    setShowSignupModal(true);
                  }
                }}
                className="hover:text-[#A87B45] transition-colors flex items-center gap-1.5"
              >
                {isLoggedIn ? (
                  profile?.email === 'admin@gmail.com' ? (
                    <span className="text-[12px] font-bold uppercase tracking-wider bg-[#3E1210] text-[#E5CDA7] px-3 py-1 rounded-full">Admin</span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {activeMember?.image ? (
                        <img src={activeMember.image} alt="Profile" className="w-7 h-7 rounded-full object-cover border border-[#BFA679]" />
                      ) : (
                        <div className="w-7 h-7 rounded-full border border-[#BFA679] flex items-center justify-center bg-[#f5ece3] text-[#986427]">
                          <User size={16} />
                        </div>
                      )}
                      <span className="text-[14px] lg:text-[15px] font-bold tracking-wide hidden xl:block text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Hi, {activeMember?.name || profile?.firstName || 'User'}</span>
                      <ChevronDown size={14} className="text-[#111111]" />
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <User size={21} strokeWidth={1.8} />
                    <span className="text-[14px] lg:text-[15px] font-bold text-[#111111] tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Login / Sign Up</span>
                    <ChevronDown size={14} className="text-[#111111]" />
                  </div>
                )}
              </button>

              {/* Hover Dropdown */}
              <div className={`absolute top-full right-0 mt-4 w-40 bg-white border border-gray-100 rounded-xl shadow-xl p-1.5 transition-all duration-300 origin-top-right ${isLoginHovered ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                
                {/* Invisible hover bridge to prevent mouseleave when moving from button to popover */}
                <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent"></div>

                <div className="flex flex-col gap-1">
                  {isLoggedIn ? (
                    <>
                      <button 
                        onClick={() => { setIsLoginHovered(false); logout(); navigate('/home'); }}
                        className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setIsLoginHovered(false); setShowLoginModal(true); }}
                        className="w-full text-left px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-all"
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => { setIsLoginHovered(false); setShowSignupModal(true); }}
                        className="w-full text-left px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-all"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Top Navigation (Visible only on Mobile) */}
      {isMainTab && (
        <nav className="md:hidden flex items-center justify-between px-5 py-3 sticky top-0 bg-[#0A0A0A] text-white z-50 border-b border-gray-800">
          <Link to="/home" className="flex flex-col cursor-pointer">
            <span className="text-lg font-serif font-bold tracking-widest text-white leading-none">
              VION
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/explore')} 
              className="text-white hover:text-[#E5B8D9] transition-colors"
            >
              <Search size={18} />
            </button>
            <button 
              onClick={() => isLoggedIn ? navigate('/account', { state: { activeTab: 'saved' } }) : setShowSignupModal(true)} 
              className="text-white hover:text-[#E5B8D9] transition-colors"
            >
              <Heart size={18} />
            </button>
            <button 
              onClick={() => isLoggedIn ? navigate('/cart') : setShowSignupModal(true)} 
              className="text-white hover:text-[#E5B8D9] transition-colors relative"
            >
              <ShoppingBag size={18} />
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-[#E5B8D9] text-black text-[8px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 w-full ${isMainTab ? 'pb-24 md:pb-0' : 'pb-0'}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductDetailScreen />} />
          
          <Route path="/login" element={<LoginScreen />} />
          
          {/* Protected Routes */}
          <Route path="/account" element={<ProtectedRoute><AccountScreen /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingScreen /></ProtectedRoute>} />
          <Route path="/add-consumer" element={<ProtectedRoute><PlaceholderScreen title="Add Consumer" /></ProtectedRoute>} />

          <Route path="/select-size" element={<ProtectedRoute><PlaceholderScreen title="Size Selection" /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartScreen /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutScreen /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccessScreen /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetailsScreen /></ProtectedRoute>} />
          <Route path="/explore" element={<ExploreScreen />} />
          <Route path="/wardrobe" element={<ProtectedRoute><PlaceholderScreen title="Wardrobe" /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="preferences" element={<AdminPreferences />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
          
          {/* Fallback & Redirects */}
          <Route path="/select-consumer" element={<Navigate to="/account" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>

      {/* Mobile Bottom Navigation (Hidden on Desktop or when not on a main tab) */}
      {isMainTab && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }} 
      />
      
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)} 
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }} 
      />
    </div>
  );
}

export default App;
