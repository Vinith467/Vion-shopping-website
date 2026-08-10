import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import AccountScreen from './screens/AccountScreen';
import ExploreScreen from './screens/ExploreScreen';
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
import { Compass, Sparkles, ShoppingBag, User, Search, Heart, ChevronDown, Mail, Lock, EyeOff } from "lucide-react";
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
  const { isLoggedIn, logout, profile } = useAppContext();
  const isMainTab = ['/home', '/explore', '/wardrobe', '/account'].includes(location.pathname);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => setShowSignupModal(true);
    window.addEventListener('openLoginModal', handleOpenLogin);
    return () => window.removeEventListener('openLoginModal', handleOpenLogin);
  }, []);

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Toaster position="top-center" />
      {/* Desktop Top Navigation (Hidden on Mobile or when not on a main tab) */}
      {isMainTab && (
        <nav className="hidden md:flex items-center justify-between px-10 lg:px-16 py-2 sticky top-0 bg-[#0A0A0A] text-white z-50 border-b border-gray-800">
          
          {/* Brand */}
          <Link to="/home" className="flex flex-col cursor-pointer">
            <span className="text-xl lg:text-2xl font-serif font-bold tracking-widest text-white leading-none mb-1">
              VION<span className="text-gray-400 font-light">FASHION</span>
            </span>
          </Link>

          {/* Centered Navigation */}
          <div className="flex items-center gap-6 lg:gap-8 text-sm font-semibold">
            {["Women", "Men", "Kids", "Ethnic"].map(item => (
              <button 
                key={item} 
                onClick={() => !isLoggedIn && setShowSignupModal(true)}
                className="flex items-center gap-1 hover:text-[#E5B8D9] transition-colors"
              >
                {item} <ChevronDown size={14} className="text-gray-500" />
              </button>
            ))}
            <button onClick={() => !isLoggedIn && setShowSignupModal(true)} className="hover:text-[#E5B8D9] transition-colors">Accessories</button>
            <button onClick={() => !isLoggedIn && setShowSignupModal(true)} className="hover:text-[#E5B8D9] transition-colors">New Arrivals</button>
            <button onClick={() => !isLoggedIn && setShowSignupModal(true)} className="hover:text-[#E5B8D9] transition-colors">Collections</button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button onClick={() => !isLoggedIn && setShowSignupModal(true)} className="hover:text-[#E5B8D9] transition-colors"><Search size={20} /></button>
              <button onClick={() => !isLoggedIn && setShowSignupModal(true)} className="hover:text-[#E5B8D9] transition-colors"><Heart size={20} /></button>
              <button onClick={() => !isLoggedIn && setShowSignupModal(true)} className="hover:text-[#E5B8D9] transition-colors relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#E5B8D9] text-black text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
              </button>
            </div>
            
            {/* Login Container with Hover Popover */}
            <div 
              className="relative"
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
                className="bg-[#E5B8D9] text-black px-6 py-2 rounded-md font-bold text-sm hover:bg-[#d49bc4] transition-colors shadow-[0_0_15px_rgba(229,184,217,0.3)]"
              >
                {isLoggedIn ? (profile?.email === 'admin@gmail.com' ? 'Admin Panel' : 'My Account') : 'Login / Sign Up'}
              </button>

              {/* Hover Dropdown */}
              <div className={`absolute top-full right-0 mt-3 w-40 bg-[#0A0A0A] border border-gray-800 rounded-xl shadow-2xl p-1.5 transition-all duration-300 origin-top-right ${isLoginHovered ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                
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
                        className="w-full text-left px-3 py-2.5 text-sm font-bold text-gray-200 hover:bg-[#E5B8D9] hover:text-black rounded-lg transition-all"
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => { setIsLoginHovered(false); setShowSignupModal(true); }}
                        className="w-full text-left px-3 py-2.5 text-sm font-bold text-gray-200 hover:bg-[#E5B8D9] hover:text-black rounded-lg transition-all"
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

      {/* Main Content Area */}
      <div className={`flex-1 w-full ${isMainTab ? 'pb-24 md:pb-0' : 'pb-0'}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductDetailScreen />} />
          
          <Route path="/login" element={<LoginScreen />} />
          
          {/* Protected Routes */}
          <Route path="/account" element={<ProtectedRoute><AccountScreen /></ProtectedRoute>} />
          <Route path="/add-consumer" element={<ProtectedRoute><PlaceholderScreen title="Add Consumer" /></ProtectedRoute>} />

          <Route path="/select-size" element={<ProtectedRoute><PlaceholderScreen title="Size Selection" /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartScreen /></ProtectedRoute>} />
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
          <Route path="/select-consumer" element={<Navigate to="/account" state={{ activeTab: 'members' }} replace />} />
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
