import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';
import { ShoppingBag, Search, Filter, Eye, Clock, CheckCircle, Truck, Package } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);

  const toggleOrderExpand = (id) => {
    setExpandedOrderIds(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    // In a real app we'd join with profiles to get user names.
    // We'll fetch profiles separately and map them.
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      toast.error('Failed to load orders');
      setIsLoading(false);
      return;
    }

    const { data: profilesData } = await supabase.from('profiles').select('id, full_name, email');

    const mappedOrders = (ordersData || []).map(order => {
      const profile = profilesData?.find(p => p.id === order.user_id);
      return {
        ...order,
        customer_name: profile?.full_name || 'Anonymous User',
        customer_email: profile?.email || 'Unknown'
      };
    });

    setOrders(mappedOrders);
    setIsLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
      
    if (error) {
      toast.error('Failed to update order status');
    } else {
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider"><CheckCircle size={14} /> Delivered</span>;
      case 'shipped':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider"><Truck size={14} /> Shipped</span>;
      case 'processing':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider"><Package size={14} /> Processing</span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider"><Clock size={14} /> Pending</span>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Track and fulfill customer orders</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-600" />
            </div>
            <input 
              type="text" 
              placeholder="Search order ID or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input font-medium text-sm text-gray-900"
            />
          </div>
          
          {/* Filter */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-600" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input font-medium text-sm text-gray-900 appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#3A10E5] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/30 border-b border-white/50 backdrop-blur-md">
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Order ID & Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center bg-white/20">
                      <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
                      <p className="text-gray-600 mt-1">When customers place orders, they will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const items = Array.isArray(order.items) ? order.items.filter(i => i._type !== 'metadata') : [];
                    const isExpanded = expandedOrderIds.includes(order.id);
                    return (
                      <React.Fragment key={order.id}>
                      <tr className="hover:bg-white/40 transition-colors border-b border-gray-100 last:border-0 cursor-pointer" onClick={() => toggleOrderExpand(order.id)}>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-bold text-gray-900 block">#{order.id.split('-')[0].toUpperCase()}</span>
                          <span className="text-xs text-gray-600 mt-1 block">{new Date(order.created_at).toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 block">{order.customer_name}</span>
                          <span className="text-xs text-gray-600 mt-1 block">{order.customer_email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {items.length} item{items.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select 
                            value={order.status || 'pending'}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-white/40 text-xs font-bold text-gray-800 bg-white/50 backdrop-blur-md hover:bg-white/70 focus:outline-none focus:border-[#3A10E5] transition-colors cursor-pointer"
                          >
                            <option value="pending">Mark Pending</option>
                            <option value="processing">Mark Processing</option>
                            <option value="shipped">Mark Shipped</option>
                            <option value="delivered">Mark Delivered</option>
                          </select>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#F8F6FF]">
                          <td colSpan="6" className="px-6 py-6 border-b border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={16} className="text-[#6344D4]"/> Order Items</h4>
                            <div className="space-y-4">
                              {items.map((item, idx) => {
                                const variation = item.variation;
                                const img = (variation?.image_urls && variation.image_urls.length > 0) ? variation.image_urls[0] : (variation?.image_url || (item.product.image_url ? item.product.image_url.split(',')[0] : null));
                                
                                return (
                                  <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                      {img ? (
                                        <img src={img} alt="Product" className="w-full h-full object-cover mix-blend-multiply" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                          <ShoppingBag size={20} />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-bold text-gray-900 leading-tight">{item.product.title}</h5>
                                      <p className="text-sm text-gray-500 mt-1">₹{item.product.price} × {item.quantity}</p>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-1 rounded">Size: {item.size}</span>
                                        {variation?.colorName && <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-1 rounded">Color: {variation.colorName}</span>}
                                        {variation?.bodyShape && variation.bodyShape !== 'all' && <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-1 rounded">Shape: {variation.bodyShape}</span>}
                                        {variation?.skinTone && variation.skinTone !== 'all' && <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 px-2 py-1 rounded">Tone: {variation.skinTone}</span>}
                                        {variation?.heightRange && variation.heightRange !== 'all' && <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-1 rounded">Height: {variation.heightRange}</span>}
                                      </div>
                                      {item.customMeasurements && (
                                        <div className="mt-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                          <h6 className="text-xs font-bold text-indigo-900 mb-2 uppercase tracking-wide">Custom Stitching Measurements (inches)</h6>
                                          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                            {Object.entries(item.customMeasurements).map(([key, value]) => value ? (
                                              <div key={key} className="bg-white p-2 rounded-lg border border-indigo-50 flex flex-col items-center justify-center text-center shadow-sm">
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                <span className="text-sm font-bold text-indigo-700">{value}</span>
                                              </div>
                                            ) : null)}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right flex flex-col justify-between">
                                      <span className="font-bold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
