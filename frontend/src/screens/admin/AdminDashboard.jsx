import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { 
  Users, Package, ShoppingBag, DollarSign, 
  TrendingUp, ArrowUpRight, Clock, CheckCircle, Package as PackageIcon, Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    bookings: 0,
    upcoming: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    // Fetch total users (profiles)
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Fetch total products
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Fetch total bookings
    const { data: bookingsData } = await supabase
      .from('consultant_bookings')
      .select('status');
      
    let totalBookings = 0;
    let upcomingAppointments = 0;
    
    if (bookingsData) {
      totalBookings = bookingsData.length;
      upcomingAppointments = bookingsData.filter(b => b.status === 'Pending' || b.status === 'Scheduled').length;
    }

    setStats({
      users: usersCount || 0,
      products: productsCount || 0,
      bookings: totalBookings,
      upcoming: upcomingAppointments
    });

    // Fetch recent 5 bookings
    const { data: recentBookingsData } = await supabase
      .from('consultant_bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentBookingsData && recentBookingsData.length > 0) {
      setRecentBookings(recentBookingsData);
    } else {
      setRecentBookings([]);
    }

    setIsLoading(false);
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider"><CheckCircle size={12} /> Delivered</span>;
      case 'shipped':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider"><Truck size={12} /> Shipped</span>;
      case 'processing':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider"><PackageIcon size={12} /> Processing</span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider"><Clock size={12} /> Pending</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#3A10E5] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Here is what's happening in your store today.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue Card */}
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <DollarSign size={120} className="text-[#3A10E5]" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3A10E5] to-[#9D44D4] text-white flex items-center justify-center mb-5 shadow-lg shadow-[#3A10E5]/30 border border-white/20">
              <DollarSign size={24} />
            </div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Total Bookings</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.bookings}</h3>
            <Link to="/admin/bookings" className="flex items-center gap-1 mt-4 text-[#3A10E5] text-xs font-bold hover:underline w-fit">
              View all bookings <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Orders Card */}
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <ShoppingBag size={120} className="text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30 border border-white/20">
              <ShoppingBag size={24} />
            </div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Upcoming Appointments</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.upcoming}</h3>
            <Link to="/admin/bookings" className="flex items-center gap-1 mt-4 text-[#3A10E5] text-xs font-bold hover:underline w-fit">
              Manage schedule <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Products Card */}
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <Package size={120} className="text-orange-500" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-orange-500/30 border border-white/20">
              <Package size={24} />
            </div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Active Products</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.products}</h3>
            <Link to="/admin/inventory" className="flex items-center gap-1 mt-4 text-[#3A10E5] text-xs font-bold hover:underline w-fit">
              Manage inventory <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Users Card */}
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <Users size={120} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30 border border-white/20">
              <Users size={24} />
            </div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Registered Users</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.users}</h3>
            <Link to="/admin/users" className="flex items-center gap-1 mt-4 text-[#3A10E5] text-xs font-bold hover:underline w-fit">
              View customer list <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area: Charts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fake Chart / Analytics Summary */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 font-serif">Bookings Overview</h3>
            <select className="glass-input text-sm font-bold text-gray-700 rounded-xl px-4 py-2 cursor-pointer shadow-sm">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          {/* Aesthetic Fake Chart representation using flex bars */}
          <div className="flex-1 flex items-end gap-2 md:gap-4 h-48 mt-auto border-b border-gray-100 pb-2">
            {[35, 60, 45, 80, 55, 95, 75].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                {/* Tooltip */}
                <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white bg-gray-900 px-2 py-1 rounded transition-opacity absolute -mt-8">
                  ₹{(height * 1250).toLocaleString()}
                </span>
                <div 
                  className="w-full bg-[#3A10E5]/10 group-hover:bg-[#3A10E5] rounded-t-lg transition-colors relative overflow-hidden" 
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#3A10E5]/40 to-transparent h-1/2"></div>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 font-serif">Recent Bookings</h3>
            <Link to="/admin/bookings" className="p-2 bg-white/50 text-gray-700 hover:text-[#3A10E5] hover:bg-white rounded-xl transition-colors shadow-sm">
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            {recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <ShoppingBag size={32} className="text-gray-200 mb-3" />
                <p className="text-sm font-medium text-gray-500">No bookings yet.<br/>Your scheduled consultations will appear here!</p>
              </div>
            ) : (
              recentBookings.map(booking => {
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/40 bg-white/40 hover:bg-white/60 hover:border-white transition-all group shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3A10E5]/20 to-pink-500/20 border border-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="font-bold text-[#3A10E5] text-sm">
                          {booking.customer_name?.charAt(0).toUpperCase() || 'G'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{booking.customer_name || 'Guest'}</p>
                        <p className="text-xs font-medium text-gray-500">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
