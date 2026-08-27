import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { MapPin, Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('consultant_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('consultant_bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#111]">Consultant Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
          No bookings found yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Left Side: Core Info */}
              <div className="p-6 md:w-1/3 bg-gray-50 border-r border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#111] mb-1">{booking.customer_name}</h3>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} /> {booking.customer_email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} /> {booking.customer_phone || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Side: Details */}
              <div className="p-6 md:w-1/3 flex flex-col gap-4 border-r border-gray-100">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Appointment</h4>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-[#8B6544]" />
                    <span className="text-sm font-medium">{booking.booking_date}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Clock size={18} className="text-[#8B6544]" />
                    <span className="text-sm font-medium">{booking.booking_time}</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Interests</h4>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {booking.collection_interest}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {booking.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Location & Actions */}
              <div className="p-6 md:w-1/3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</h4>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin size={16} className="text-[#8B6544] shrink-0 mt-0.5" />
                    {booking.location_address ? (
                      <p className="line-clamp-3">{booking.location_address}</p>
                    ) : booking.location_lat ? (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${booking.location_lat},${booking.location_lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex flex-col"
                      >
                        <span>View on Map</span>
                        <span className="text-xs text-gray-400">Lat: {booking.location_lat.toFixed(4)}, Lng: {booking.location_lng.toFixed(4)}</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No location provided</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {booking.status === 'Pending' && (
                    <button 
                      onClick={() => updateStatus(booking.id, 'Confirmed')}
                      className="flex-1 bg-[#111] text-white text-xs font-bold uppercase tracking-wider py-2 px-3 rounded flex items-center justify-center gap-1 hover:bg-[#333]"
                    >
                      <CheckCircle size={14} /> Confirm
                    </button>
                  )}
                  {booking.status === 'Confirmed' && (
                    <button 
                      onClick={() => updateStatus(booking.id, 'Completed')}
                      className="flex-1 bg-green-600 text-white text-xs font-bold uppercase tracking-wider py-2 px-3 rounded flex items-center justify-center gap-1 hover:bg-green-700"
                    >
                      <CheckCircle size={14} /> Complete
                    </button>
                  )}
                  {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <button 
                      onClick={() => updateStatus(booking.id, 'Cancelled')}
                      className="flex-1 bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider py-2 px-3 rounded flex items-center justify-center gap-1 hover:bg-red-100"
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
