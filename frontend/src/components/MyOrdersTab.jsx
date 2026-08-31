import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, RotateCcw, 
  ShoppingBag, Clock, Truck, CheckCircle2, 
  XCircle, ChevronRight, HelpCircle, PhoneCall
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MyOrdersTab() {
  const { session } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = ['All Orders', 'Processing', 'Shipped', 'Delivered', 'Returns'];

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load orders');
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  const getStatusProps = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 };
      case 'shipped':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: Truck };
      case 'processing':
        return { color: 'text-purple-600', bg: 'bg-purple-50', icon: Clock };
      case 'cancelled':
        return { color: 'text-red-500', bg: 'bg-red-50', icon: XCircle };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock }; // pending
    }
  };

  const formattedOrders = orders.map(order => {
    const items = Array.isArray(order.items) ? order.items.filter(i => i._type !== 'metadata') : [];
    
    let totalQuantity = 0;
    const images = [];
    
    items.forEach(item => {
      totalQuantity += (item.quantity || 1);
      const variation = item.variation;
      const img = (variation?.image_urls && variation.image_urls.length > 0) ? variation.image_urls[0] : 
                  (variation?.image_url || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : null));
      if (img && !images.includes(img)) {
        images.push(img);
      }
    });

    const statusProps = getStatusProps(order.status);
    
    return {
      id: order.id.split('-')[0].toUpperCase(), // Short ID
      fullId: order.id,
      items: items,
      date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      itemsCount: totalQuantity || 1,
      total: `₹${parseFloat(order.total_amount).toLocaleString()}`,
      status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending',
      subStatus: order.status === 'delivered' ? `Delivered on ${new Date(order.created_at).toLocaleDateString()}` : 'We are preparing your order',
      statusColor: statusProps.color,
      statusBg: statusProps.bg,
      statusIcon: statusProps.icon,
      images: images.length > 0 ? images : ['/images/placeholder.jpg'],
      actions: order.status === 'delivered' ? ['View Details', 'Buy Again'] : ['Track Order', 'View Details']
    };
  });

  const filteredOrders = formattedOrders.filter(order => {
    const matchesTab = activeTab === 'All Orders' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCount = (status) => formattedOrders.filter(o => o.status.toLowerCase() === status.toLowerCase()).length;
  
  const summaryStats = [
    { label: 'All Orders', count: formattedOrders.length, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Processing', count: getCount('processing') + getCount('pending'), icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Shipped', count: getCount('shipped'), icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Delivered', count: getCount('delivered'), icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Returns', count: getCount('returns'), icon: RotateCcw, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Cancelled', count: getCount('cancelled'), icon: XCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 -mt-4">
      <div>
        <h2 className="text-[28px] font-bold text-gray-900 dark:text-[#F5F0E8] mb-2 font-serif">My Orders</h2>
        <p className="text-sm text-gray-500 font-medium">Track, manage and view all your orders in one place.</p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-200 pb-4">
        <div className="flex gap-6 overflow-x-auto hide-scrollbar w-full lg:w-auto">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-bold whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-[#3A10E5]' : 'text-gray-500 hover:text-gray-900 dark:text-[#F5F0E8]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute -bottom-[18px] left-0 right-0 h-1 bg-[#3A10E5] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full lg:w-auto shrink-0">
          <div className="relative flex-1 lg:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#3A10E5] focus:ring-1 focus:ring-[#3A10E5] transition-all bg-gray-50/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-[#3A10E5] hover:bg-gray-50 transition-colors shrink-0">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <div className="w-full xl:w-[70%] flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-48 bg-white dark:bg-[#151515] transition-colors duration-500 rounded-2xl border border-gray-100">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#3A10E5] rounded-full animate-spin"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-2xl border border-gray-100 p-10 flex flex-col items-center justify-center text-center h-48">
              <ShoppingBag size={32} className="text-gray-300 mb-3" />
              <p className="text-sm font-bold text-gray-500">No orders found.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = order.statusIcon;
            return (
              <div key={order.fullId} onClick={() => navigate(`/order/${order.fullId}`)} className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-2xl border border-gray-100 p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row gap-6 cursor-pointer">
                <div className="flex items-center shrink-0">
                  <div className="relative w-[100px] h-[120px] rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 z-20">
                    <img src={order.images[0]} alt="Item" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  {order.images.length > 1 && (
                    <div className="relative w-[50px] h-[60px] rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0 -ml-4 mt-8 z-10">
                      <img src={order.images[1]} alt="Item" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                  )}
                  {order.images.length > 2 && (
                    <div className="relative w-[50px] h-[60px] rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0 -ml-4 mt-8 z-0 flex items-center justify-center bg-gray-50">
                      <img src={order.images[2]} alt="Item" className="absolute w-full h-full object-cover mix-blend-multiply opacity-50" />
                      <span className="relative z-10 text-xs font-bold text-gray-700 bg-white/80 dark:bg-[#151515]/80 transition-colors duration-500 px-1.5 py-0.5 rounded">+{order.images.length - 2}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex flex-col justify-center">
                    <h3 className="text-base font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">Order #{order.id}</h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-4">
                      <span>{order.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{order.itemsCount} Items</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Total Amount</p>
                    <p className="text-base font-bold text-gray-900 dark:text-[#F5F0E8]">{order.total}</p>
                  </div>

                  <div className="flex flex-col justify-between items-start lg:items-end">
                    <div className="flex w-full lg:w-auto justify-between items-start gap-4">
                      <div className="flex flex-col lg:items-end">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold w-fit mb-1.5 border border-white/50 ${order.statusBg} ${order.statusColor}`}>
                          <StatusIcon size={14} />
                          {order.status}
                        </div>
                        <p className="text-[11px] font-medium text-gray-500 text-left lg:text-right">{order.subStatus}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>

        {/* Right Column: Sidebar Widgets */}
        <div className="w-full xl:w-[30%] flex flex-col gap-6">
          
          {/* Order Summary Widget */}
          <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 dark:text-[#F5F0E8] mb-5">Order Summary</h3>
            <div className="flex flex-col gap-4">
              {summaryStats.map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${stat.bg} border border-white shadow-sm flex items-center justify-center shrink-0`}>
                        <StatIcon size={14} className={stat.color} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{stat.label}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-[#F5F0E8]">{stat.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Need Help Widget */}
          <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-[#F5F0E8] mb-5">Need Help?</h3>
            <div className="flex flex-col gap-5 mb-6">
              
              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-[#3A10E5] flex items-center justify-center shrink-0 group-hover:bg-[#3A10E5] group-hover:text-white transition-colors">
                  <Truck size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-[#F5F0E8] mb-0.5 group-hover:text-[#3A10E5] transition-colors">Track your order</h4>
                  <p className="text-[10px] font-medium text-gray-500">Get real-time updates</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-[#3A10E5] flex items-center justify-center shrink-0 group-hover:bg-[#3A10E5] group-hover:text-white transition-colors">
                  <RotateCcw size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-[#F5F0E8] mb-0.5 group-hover:text-[#3A10E5] transition-colors">Returns & Refunds</h4>
                  <p className="text-[10px] font-medium text-gray-500">Easy returns within 7 days</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-[#3A10E5] flex items-center justify-center shrink-0 group-hover:bg-[#3A10E5] group-hover:text-white transition-colors">
                  <PhoneCall size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-[#F5F0E8] mb-0.5 group-hover:text-[#3A10E5] transition-colors">Contact Support</h4>
                  <p className="text-[10px] font-medium text-gray-500">We're here to help</p>
                </div>
              </div>

            </div>
            
            <button className="w-full py-3 rounded-xl border border-gray-200 text-xs font-bold text-[#3A10E5] hover:bg-gray-50 transition-colors">
              Visit Help Center
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
