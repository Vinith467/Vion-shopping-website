import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';
import { Users as UsersIcon, UserCircle, Search, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsersAndConsumers();
  }, []);

  const fetchUsersAndConsumers = async () => {
    setIsLoading(true);
    
    // Fetch main users (profiles)
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (usersError) {
      toast.error('Failed to load users');
    } else {
      setUsers(usersData || []);
    }

    // Fetch consumers (profiles)
    const { data: consumersData, error: consumersError } = await supabase
      .from('consumers')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!consumersError) {
      setConsumers(consumersData || []);
    }
    
    setIsLoading(false);
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Users & Consumers</h1>
          <p className="text-gray-600 mt-1">Manage registered accounts and their sub-profiles</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-600" />
          </div>
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input font-medium text-sm text-gray-900"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#3A10E5] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <UsersIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No users found</h3>
              <p className="text-gray-600 mt-1">Try adjusting your search query.</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              // Find all consumers for this user
              const userConsumers = consumers.filter(c => c.user_id === user.id);
              const primaryConsumer = userConsumers.find(c => c.is_primary);
              const additionalConsumers = userConsumers.filter(c => !c.is_primary);

              return (
                <div key={user.id} className="glass-panel overflow-hidden flex flex-col md:flex-row p-0">
                  
                  {/* Account Owner Info (Left Side) */}
                  <div className="bg-white/20 backdrop-blur p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-white/30 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#3A10E5]/10 flex items-center justify-center text-[#3A10E5]">
                        <UserCircle size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {user.full_name || 'Anonymous User'}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 mt-1 inline-block">
                          Account Owner
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={16} className="text-gray-600" />
                        <a href={`mailto:${user.email}`} className="hover:text-[#3A10E5] truncate">{user.email}</a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={16} className="text-gray-600" />
                        <span>{user.phone_number || 'No phone provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={16} className="text-gray-600" />
                        <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profiles/Consumers (Right Side) */}
                  <div className="p-6 md:w-2/3 flex flex-col justify-center">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Linked Profiles ({userConsumers.length})</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Primary Profile */}
                      {primaryConsumer && (
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-white/50 bg-white/40 backdrop-blur-md relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-8 h-8 bg-white/50 rounded-bl-2xl flex items-center justify-center">
                            <span className="text-[10px] font-bold text-[#3A10E5]">1st</span>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center overflow-hidden shrink-0 border border-white/50 shadow-sm">
                            {primaryConsumer.image_url ? (
                              <img src={primaryConsumer.image_url} alt={primaryConsumer.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle size={24} className="text-[#3A10E5]/50" />
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-gray-900 leading-tight">{primaryConsumer.name}</h5>
                            <p className="text-xs text-[#3A10E5] font-medium mt-0.5">Primary Profile</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[10px] text-gray-700 bg-white/50 backdrop-blur px-1.5 py-0.5 rounded border border-white/40">{primaryConsumer.gender}</span>
                              <span className="text-[10px] text-gray-700 bg-white/50 backdrop-blur px-1.5 py-0.5 rounded border border-white/40">{primaryConsumer.age_group}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Profiles */}
                      {additionalConsumers.map(consumer => (
                        <div key={consumer.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/30 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center overflow-hidden shrink-0 border border-white/40 shadow-sm">
                            {consumer.image_url ? (
                              <img src={consumer.image_url} alt={consumer.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle size={24} className="text-gray-500" />
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-gray-900 leading-tight">{consumer.name}</h5>
                            <p className="text-xs text-gray-600 font-medium mt-0.5 capitalize">{consumer.relationship}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[10px] text-gray-700 bg-white/40 backdrop-blur px-1.5 py-0.5 rounded border border-white/30">{consumer.gender}</span>
                              <span className="text-[10px] text-gray-700 bg-white/40 backdrop-blur px-1.5 py-0.5 rounded border border-white/30">{consumer.age_group}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
