import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Box, Tags, Settings, ShoppingCart, ArrowLeft, Grid, Menu, X, LogOut, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <div className="h-screen overflow-hidden bg-mesh-animated flex flex-col md:flex-row w-full font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <NavLink to="/home" className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors shadow-sm">
            <ArrowLeft size={18} />
          </NavLink>
          <div>
            <h2 className="text-lg font-bold font-serif text-gray-900 tracking-wide leading-none">VION ADMIN</h2>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-gray-100 rounded-lg text-gray-700"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity" 
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-64 glass-panel border-r border-white/50 shrink-0 flex flex-col h-screen z-50 transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-white/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NavLink to="/home" className="hidden md:flex p-1 hover:bg-white/50 rounded-lg text-gray-700 transition-colors shadow-sm">
              <ArrowLeft size={18} />
            </NavLink>
            <div>
              <h2 className="text-xl font-bold font-serif text-gray-900 tracking-wide">VION ADMIN</h2>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase mt-1">Control Panel</p>
            </div>
          </div>
          <button 
            onClick={closeMenu}
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2 px-4">Overview</div>
          <NavLink onClick={closeMenu} to="/admin" end className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-4">Catalog</div>
          <NavLink onClick={closeMenu} to="/admin/inventory" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <Box size={18} />
            Inventory
          </NavLink>
          <NavLink onClick={closeMenu} to="/admin/categories" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <Grid size={18} className={location.pathname === '/admin/categories' ? "text-[#6344D4]" : "text-gray-500"} />
            Categories
          </NavLink>

          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-4">Management</div>
          <NavLink onClick={closeMenu} to="/admin/orders" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <ShoppingCart size={18} />
            Orders
          </NavLink>
          <NavLink onClick={closeMenu} to="/admin/bookings" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <Calendar size={18} />
            Bookings
          </NavLink>
          <NavLink onClick={closeMenu} to="/admin/users" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <Users size={18} />
            Users
          </NavLink>

          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-4">Storefront</div>
          <NavLink onClick={closeMenu} to="/admin/preferences" className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <Tags size={18} />
            Page Content
          </NavLink>
          
          <div className="mt-auto pt-4 border-t border-white/30">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto h-full">
        <Outlet />
      </main>
    </div>
  );
}
