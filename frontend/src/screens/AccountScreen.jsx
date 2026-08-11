import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Ruler, Users, ShoppingBag, Heart, 
  Sliders, Sparkles, MapPin, CreditCard, 
  Settings, HelpCircle, LogOut, ArrowRight, Home as HomeIcon,
  Menu, X, ArrowLeft
} from 'lucide-react';
import HomeTab from '../components/HomeTab';
import MyMeasurementsTab from '../components/MyMeasurementsTab';
import MembersTab from '../components/MembersTab';
import MyOrdersTab from '../components/MyOrdersTab';
import SavedOutfitsTab from '../components/SavedOutfitsTab';
import PreferencesTab from '../components/PreferencesTab';
import StyleFeedTab from '../components/StyleFeedTab';
import AddressBookTab from '../components/AddressBookTab';
import AccountSettingsTab from '../components/AccountSettingsTab';
import HelpSupportTab from '../components/HelpSupportTab';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const sidebarItems = [
  { id: 'app_home', label: 'Home', icon: HomeIcon },
  { id: 'home', label: 'Profile', icon: User },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'measurements', label: 'Measurements', icon: Ruler },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'saved', label: 'Saved Outfits', icon: Heart },
  { id: 'preferences', label: 'Preferences', icon: Sliders },
  { id: 'stylefeed', label: 'Style Feed', icon: Sparkles },
  { id: 'address', label: 'Address Book', icon: MapPin },
  { id: 'settings', label: 'Account Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
  { id: 'logout', label: 'Logout', icon: LogOut, isDanger: true },
];

export default function AccountScreen() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAppContext();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabClick = async (id) => {
    setIsMobileMenuOpen(false);
    if (id === 'logout') {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/home');
    } else if (id === 'app_home') {
      navigate('/home');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] pb-12">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-bold font-serif text-gray-900 tracking-wide leading-none">
              {sidebarItems.find(i => i.id === activeTab)?.label || 'Account'}
            </h2>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-gray-100 rounded-lg text-gray-700 shadow-sm"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-4 md:mt-8">
        
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          
          {/* Left Sidebar / Mobile Drawer */}
          <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-72 md:w-64 bg-[#F9FAFB] md:bg-transparent shrink-0 flex flex-col gap-1 md:sticky md:top-28 md:self-start z-[70] md:z-40 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none overflow-y-auto md:overflow-visible h-full md:h-max`}>
            
            <div className="md:hidden flex items-center justify-between p-6 border-b border-gray-200 bg-white">
               <div>
                 <h2 className="text-xl font-bold font-serif text-gray-900 tracking-wide">MY ACCOUNT</h2>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-lg transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="bg-white md:rounded-2xl md:shadow-sm md:border border-gray-100 p-3 overflow-y-auto md:max-h-[85vh] hide-scrollbar flex flex-col gap-1 flex-1 md:flex-none">
              
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-[#F8F6FF] text-[#3A10E5]' 
                        : item.isDanger 
                          ? 'text-red-500 hover:bg-red-50 mt-auto md:mt-0 border-t border-gray-100 md:border-none' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </button>
                );
              })}

            </div>

            {/* Unlock More Benefits Promo Card */}
            <div className="bg-[#F8F9FA] md:rounded-2xl p-5 border-t md:border border-gray-100 mt-auto md:mt-2 flex flex-col gap-3 shrink-0">
              <div className="flex items-center gap-2 text-[#3A10E5] font-bold text-sm">
                <Sparkles size={16} />
                Unlock More Benefits
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                Complete your profile and get better size & style recommendations.
              </p>
              <button className="w-full bg-[#3A10E5] hover:bg-[#2A08B5] text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 mt-2">
                Complete Profile <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0 bg-transparent min-h-[500px]">
            {activeTab === 'home' ? (
              <HomeTab />
            ) : activeTab === 'measurements' ? (
              <MyMeasurementsTab />
            ) : activeTab === 'members' ? (
              <MembersTab />
            ) : activeTab === 'orders' ? (
              <MyOrdersTab />
            ) : activeTab === 'saved' ? (
              <SavedOutfitsTab />
            ) : activeTab === 'preferences' ? (
              <PreferencesTab />
            ) : activeTab === 'stylefeed' ? (
              <StyleFeedTab />
            ) : activeTab === 'address' ? (
              <AddressBookTab />
            ) : activeTab === 'settings' ? (
              <AccountSettingsTab />
            ) : activeTab === 'help' ? (
              <HelpSupportTab />
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
}
