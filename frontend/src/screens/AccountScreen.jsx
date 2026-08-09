import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Ruler, Users, ShoppingBag, Heart, 
  Sliders, Sparkles, MapPin, CreditCard, 
  Settings, HelpCircle, LogOut, ArrowRight, Home as HomeIcon
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
  { id: 'home', label: 'Home', icon: HomeIcon },
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
  const navigate = useNavigate();
  const { logout } = useAppContext();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabClick = async (id) => {
    if (id === 'logout') {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/home');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] pt-4 md:pt-8 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          
          {/* Left Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 md:sticky md:top-24 md:h-fit z-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 overflow-y-auto max-h-[85vh] hide-scrollbar flex flex-col gap-1">
              
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
                          ? 'text-red-500 hover:bg-red-50' 
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
            <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-gray-100 mt-2 flex flex-col gap-3">
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
