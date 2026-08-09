import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Box, Tags, Settings, ShoppingCart, ArrowLeft, Grid } from 'lucide-react';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-mesh-animated flex flex-col md:flex-row w-full font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-white/50 shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-50">
        <div className="p-6 border-b border-white/30 flex items-center gap-3">
          <NavLink to="/home" className="p-1 hover:bg-white/50 rounded-lg text-gray-700 transition-colors shadow-sm">
            <ArrowLeft size={18} />
          </NavLink>
          <div>
            <h2 className="text-xl font-bold font-serif text-gray-900 tracking-wide">VION ADMIN</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase mt-1">Control Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <NavLink to="/admin" end className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/inventory" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <Box size={20} />
            Inventory
          </NavLink>
          <NavLink to="/admin/categories" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <Grid size={20} className={location.pathname === '/admin/categories' ? "text-[#6344D4]" : "text-gray-500"} />
            Collections
          </NavLink>
          <NavLink to="/admin/preferences" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <Settings size={20} />
            Preference Tags
          </NavLink>
          <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <Users size={20} />
            Users
          </NavLink>
          <NavLink to="/admin/orders" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-white/60 shadow-sm text-[#6344D4] border border-white/50 font-bold' : 'text-gray-700 hover:bg-white/40 hover:text-[#6344D4]'}`}>
            <ShoppingCart size={20} />
            Orders
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
