import React, { useState, useEffect } from 'react';
import { X, MapPin, Check, Loader2, Search } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Bangalore Boundaries roughly
const BANGALORE_CENTER = [12.9716, 77.5946];
const BANGALORE_BOUNDS = [
  [12.8, 77.4], // South West
  [13.1, 77.8]  // North East
];

const TIME_SLOTS = [
  "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
  "17:30"
];

const MapMovementTracker = ({ setPosition, setAddressName, setFetchingAddress }) => {
  const map = useMapEvents({
    moveend() {
      const center = map.getCenter();
      setPosition(center);
      if (setFetchingAddress && setAddressName) {
        setFetchingAddress(true);
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setAddressName(data.display_name);
            }
          })
          .catch(err => console.error(err))
          .finally(() => setFetchingAddress(false));
      }
    },
  });

  useEffect(() => {
    // Only set it initially once
    const center = map.getCenter();
    setPosition(center);
    if (setFetchingAddress && setAddressName) {
      setFetchingAddress(true);
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setAddressName(data.display_name);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setFetchingAddress(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

const LocateControl = () => {
  const map = useMapEvents({});
  const locateMe = () => {
    map.locate({ setView: true, maxZoom: 15 });
  };
  return (
    <div className="absolute bottom-6 right-4 z-[400]">
      <button 
        onClick={(e) => { e.preventDefault(); locateMe(); }}
        className="bg-white dark:bg-[#151515] transition-colors duration-500 p-3 rounded-full shadow-[0_4px_12px_rgba(139,90,43,0.3)] border border-[#A87B45]/30 hover:bg-[#F5F0E8] dark:bg-[#151515] transition-colors duration-500 transition-colors text-[#8B5A2B] group flex items-center justify-center cursor-pointer"
        title="Locate Me"
      >
        <MapPin size={22} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

const MapSearchBox = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const map = useMap();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setSearching(true);
    
    const searchNominatim = async (searchText) => {
      const searchQuery = searchText.toLowerCase().includes('bangalore') || searchText.toLowerCase().includes('bengaluru') 
        ? searchText 
        : `${searchText}, Bengaluru, India`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      return await res.json();
    };

    try {
      // 1. Try exact search
      let data = await searchNominatim(query);
      
      // 2. Fallback: If no results and query has a comma, try just the first part (e.g. area name)
      if ((!data || data.length === 0) && query.includes(',')) {
        const firstPart = query.split(',')[0].trim();
        if (firstPart) {
          data = await searchNominatim(firstPart);
        }
      }

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([lat, lon], 16);
      } else {
        alert("We couldn't find that exact building or street. Try searching for just the general area (e.g., 'Bommasandra') and then move the map to pinpoint your exact location.");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed. Please try panning the map manually.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] w-[90%] max-w-sm">
      <form onSubmit={handleSearch} className="flex items-center bg-white/9 dark:bg-[#151515]/9 transition-colors duration-500 5 dark:bg-[#151515]/95 transition-colors duration-500 backdrop-blur-sm rounded-full shadow-lg border border-[#A87B45]/30 overflow-hidden">
        <input 
          type="text" 
          placeholder="Search street, area..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full py-3 px-5 outline-none text-sm text-[#1A0F0A] dark:text-[#F5F0E8] bg-transparent font-serif"
        />
        <button type="submit" className="p-3 text-[#8B5A2B] hover:bg-[#F5F0E8] dark:bg-[#151515] transition-colors duration-500 transition-colors h-full flex items-center justify-center pr-4">
          {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </form>
    </div>
  );
};

export default function BookConsultantModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mapConfirmed, setMapConfirmed] = useState(false);
  const [mapFetchedAddress, setMapFetchedAddress] = useState('');
  const [fetchingAddress, setFetchingAddress] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    country: 'India',
    collection: '', // 'WOMEN', 'MEN', 'WOMEN AND MEN'
    date: '',
    time: '',
    locationType: 'manual', // 'map' or 'manual'
    locationCoords: null, // {lat, lng}
    houseNo: '',
    area: '',
    landmark: '',
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setMapConfirmed(false);
      setMapFetchedAddress('');
      setFormData({
        country: 'India',
        collection: '',
        date: '',
        time: '',
        locationType: 'manual',
        locationCoords: null,
        houseNo: '',
        area: '',
        landmark: '',
        name: '',
        email: '',
        phone: ''
      });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Progressive Disclosure booleans
  const hasDate = !!formData.date && !!formData.collection;
  const hasTime = hasDate && !!formData.time;
  const isLocationConfirmed = hasTime && mapConfirmed;

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all contact details.");
      return;
    }

    setLoading(true);
    const fullAddress = `${formData.houseNo}, ${formData.area}${formData.landmark ? `, Landmark: ${formData.landmark}` : ''}`;

    try {
      const { error } = await supabase.from('consultant_bookings').insert([{
        country: formData.country,
        collection_interest: formData.collection,
        booking_date: formData.date,
        booking_time: formData.time,
        location_lat: formData.locationCoords?.lat || null,
        location_lng: formData.locationCoords?.lng || null,
        location_address: fullAddress,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        status: 'Pending'
      }]);

      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Failed to book consultation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        data-lenis-prevent="true"
        style={{ 
          background: 'linear-gradient(180deg, #FDFBF7 0%, #F5F0E8 100%)',
          borderRadius: '12px'
        }}
      >
        
        {/* Header */}
        <div className="sticky top-0 z-20 px-8 py-6 border-b border-[#A87B45]/20 flex items-center justify-between bg-white/6 dark:bg-[#151515]/6 transition-colors duration-500 0 dark:bg-[#151515]/60 transition-colors duration-500 backdrop-blur-md rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-6 bg-[#A87B45]"></div>
            <h2 className="text-xl md:text-2xl font-serif text-[#1A0F0A] dark:text-[#F5F0E8] font-bold tracking-wide">Book a Consultation</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#A87B45]/10 rounded-full transition-colors group">
            <X size={20} className="text-[#8B5A2B] group-hover:text-[#1A0F0A] dark:text-[#F5F0E8] transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-[0_4px_20px_rgba(168,123,69,0.3)]"
                style={{ background: 'linear-gradient(135deg, #C49A5C 0%, #A87B45 50%, #8B5A2B 100%)' }}
              >
                <Check size={40} className="text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-3 text-[#1A0F0A] dark:text-[#F5F0E8]">Booking Confirmed</h3>
              <div className="w-12 h-[1px] bg-[#A87B45] mb-6"></div>
              <p className="text-[#4A3320] dark:text-gray-400 mb-10 max-w-md text-[15px] leading-relaxed">
                Thank you, <span className="font-serif font-bold text-lg">{formData.name}</span>. Your personal stylist appointment is secured for <span className="font-bold">{formData.date}</span> at <span className="font-bold">{formData.time}</span>. A confirmation has been sent to your email.
              </p>
              <button 
                onClick={onClose}
                className="px-10 py-3.5 font-bold tracking-[0.2em] uppercase text-[10px] text-white rounded-full transition-all duration-300 hover:scale-[1.02] hover:opacity-95 shadow-md"
                style={{ background: 'linear-gradient(135deg, #C49A5C 0%, #A87B45 50%, #8B5A2B 100%)' }}
              >
                Return to Vion
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              
              {/* SECTION 1: APPOINTMENT DETAILS */}
              <div className="transition-all duration-500">
                <div className="flex items-center gap-4 border-b border-[#A87B45]/20 pb-4 mb-6">
                  <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-sm" style={{ background: 'linear-gradient(135deg, #C49A5C 0%, #8B5A2B 100%)' }}>1</div>
                  <h3 className="text-lg font-serif font-bold tracking-widest text-[#1A0F0A] dark:text-[#F5F0E8] uppercase">Appointment Details</h3>
                </div>
                
                <p className="text-[15px] text-[#4A3320] dark:text-gray-400 mb-2 font-serif">Curate your exclusive experience</p>
                <p className="text-[11px] text-[#8B5A2B]/80 mb-8 uppercase tracking-wider font-bold">Fields marked with an asterisk (*) are required</p>

                <div className="space-y-7">
                  <div>
                    <label className="block text-xs font-bold text-[#1A0F0A] dark:text-[#F5F0E8] tracking-wider uppercase mb-2">Service Region*</label>
                    <div className="w-full border border-[#A87B45]/30 p-3.5 bg-[#A87B45]/5 rounded-md shadow-sm text-[#1A0F0A] dark:text-[#F5F0E8] flex items-center justify-between cursor-not-allowed">
                      <span className="font-bold">Bengaluru, India</span>
                      <span className="text-[9px] uppercase tracking-widest text-[#8B5A2B] font-bold">Exclusive</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A0F0A] dark:text-[#F5F0E8] tracking-wider uppercase mb-3">Collection Interest*</label>
                    <div className="flex flex-wrap gap-6">
                      {['WOMEN', 'MEN', 'WOMEN AND MEN'].map((col) => (
                        <label key={col} className="flex items-center gap-3 cursor-pointer group relative">
                          <input 
                            type="radio" 
                            name="collection"
                            value={col}
                            checked={formData.collection === col}
                            onChange={(e) => setFormData({...formData, collection: e.target.value})}
                            className="absolute opacity-0 w-0 h-0"
                          />
                          <div 
                            className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-all duration-300 ${formData.collection === col ? 'border-[#8B5A2B] bg-[#8B5A2B] shadow-inner' : 'border-[#A87B45]/50 bg-white/7 dark:bg-[#151515]/7 transition-colors duration-500 0 dark:bg-[#151515]/70 transition-colors duration-500 group-hover:border-[#8B5A2B]'}`}
                          >
                            {formData.collection === col && <Check size={14} className="text-white" />}
                          </div>
                          <span className={`text-xs font-bold tracking-[0.15em] uppercase transition-colors ${formData.collection === col ? 'text-[#1A0F0A] dark:text-[#F5F0E8]' : 'text-[#4A3320] dark:text-gray-400 group-hover:text-[#1A0F0A] dark:text-[#F5F0E8]'}`}>{col}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A0F0A] dark:text-[#F5F0E8] tracking-wider uppercase mb-2">Preferred Date*</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-[#A87B45]/30 p-3.5 bg-white/7 dark:bg-[#151515]/7 transition-colors duration-500 0 dark:bg-[#151515]/70 transition-colors duration-500 backdrop-blur-sm focus:outline-none focus:border-[#A87B45] focus:bg-white dark:bg-[#151515] transition-colors duration-500 rounded-md shadow-sm text-[#1A0F0A] dark:text-[#F5F0E8] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: TIME SLOTS (Revealed automatically) */}
              <div className={`transition-all duration-700 ease-in-out ${hasDate ? 'opacity-100 max-h-screen translate-y-0' : 'opacity-0 max-h-0 -translate-y-4 overflow-hidden pointer-events-none'}`}>
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A0F0A] dark:text-[#F5F0E8] mb-4">Available Time Slots*</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setFormData({...formData, time: t});
                          setMapConfirmed(false); // Reset map confirmation if they change time
                        }}
                        className={`py-2.5 text-xs font-bold transition-all duration-300 rounded-md border shadow-sm ${
                          formData.time === t 
                            ? 'border-[#8B5A2B] bg-[#8B5A2B] text-white shadow-[0_2px_8px_rgba(139,90,43,0.3)]' 
                            : 'border-[#A87B45]/30 text-[#4A3320] dark:text-gray-400 bg-white/7 dark:bg-[#151515]/7 transition-colors duration-500 0 dark:bg-[#151515]/70 transition-colors duration-500 hover:border-[#8B5A2B] hover:text-[#8B5A2B] hover:bg-white dark:bg-[#151515] transition-colors duration-500 '
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: LOCATION (Revealed automatically after time) */}
              <div className={`transition-all duration-700 ease-in-out ${hasTime ? 'opacity-100 max-h-[1000px] translate-y-0 mt-4' : 'opacity-0 max-h-0 -translate-y-4 overflow-hidden pointer-events-none'}`}>
                <div className="flex items-center gap-4 border-b border-[#A87B45]/20 pb-4 mb-6">
                  <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-sm" style={{ background: 'linear-gradient(135deg, #C49A5C 0%, #8B5A2B 100%)' }}>2</div>
                  <h3 className="text-lg font-serif font-bold tracking-widest text-[#1A0F0A] dark:text-[#F5F0E8] uppercase">Location</h3>
                </div>

                <div className="bg-[#4A1A18] text-[#F5F0E8] p-5 rounded-lg mb-8 text-sm flex items-start gap-4 shadow-inner border border-[#2A0C0A]">
                  <MapPin className="shrink-0 mt-0.5 text-[#C49A5C]" size={20} />
                  <p className="leading-relaxed">Our expert stylist will visit your specified location to ensure complete privacy and comfort within Bangalore.</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-6 mb-5">
                    <label className="flex items-center gap-3 cursor-pointer group relative">
                      <input 
                        type="radio" 
                        name="locationType"
                        checked={formData.locationType === 'map'} 
                        onChange={() => setFormData({...formData, locationType: 'map'})} 
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${formData.locationType === 'map' ? 'border-[#8B5A2B] bg-[#8B5A2B] shadow-inner' : 'border-[#A87B45]/50 bg-white/7 dark:bg-[#151515]/7 transition-colors duration-500 0 dark:bg-[#151515]/70 transition-colors duration-500 group-hover:border-[#8B5A2B]'}`}>
                         {formData.locationType === 'map' && <div className="w-2 h-2 bg-white dark:bg-[#151515] transition-colors duration-500 rounded-full"></div>}
                      </div>
                      <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${formData.locationType === 'map' ? 'text-[#1A0F0A] dark:text-[#F5F0E8]' : 'text-[#4A3320] dark:text-gray-400 group-hover:text-[#1A0F0A] dark:text-[#F5F0E8]'}`}>Pick on Map</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group relative">
                      <input 
                        type="radio" 
                        name="locationType"
                        checked={formData.locationType === 'manual'} 
                        onChange={() => setFormData({...formData, locationType: 'manual'})} 
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${formData.locationType === 'manual' ? 'border-[#8B5A2B] bg-[#8B5A2B] shadow-inner' : 'border-[#A87B45]/50 bg-white/7 dark:bg-[#151515]/7 transition-colors duration-500 0 dark:bg-[#151515]/70 transition-colors duration-500 group-hover:border-[#8B5A2B]'}`}>
                         {formData.locationType === 'manual' && <div className="w-2 h-2 bg-white dark:bg-[#151515] transition-colors duration-500 rounded-full"></div>}
                      </div>
                      <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${formData.locationType === 'manual' ? 'text-[#1A0F0A] dark:text-[#F5F0E8]' : 'text-[#4A3320] dark:text-gray-400 group-hover:text-[#1A0F0A] dark:text-[#F5F0E8]'}`}>Enter Manually</span>
                    </label>
                  </div>

                  {formData.locationType === 'map' ? (
                    !mapConfirmed ? (
                      <div className="w-full border border-[#A87B45]/40 rounded-lg overflow-hidden relative z-0 shadow-sm bg-[#F5F0E8] dark:bg-[#151515] transition-colors duration-500 flex flex-col">
                        <div className="h-[320px] relative w-full">
                          <MapContainer 
                            center={formData.locationCoords || BANGALORE_CENTER} 
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}
                            maxBounds={BANGALORE_BOUNDS}
                            zoomControl={false}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            <MapMovementTracker 
                              setPosition={(coords) => setFormData({...formData, locationCoords: coords})} 
                              setAddressName={setMapFetchedAddress}
                              setFetchingAddress={setFetchingAddress}
                            />
                            <MapSearchBox />
                            <LocateControl />
                          </MapContainer>
                          
                          {/* Fixed Center Pin Overlay */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[400] pointer-events-none drop-shadow-xl flex flex-col items-center pb-2">
                            <div className="bg-[#1A0F0A] text-[#F5F0E8] text-[9px] font-bold px-3 py-1.5 rounded-full mb-1 shadow-md whitespace-nowrap tracking-wider uppercase animate-bounce-slow">
                              Move map to adjust
                            </div>
                            <div className="relative flex justify-center">
                              <MapPin size={40} className="text-[#1A0F0A] dark:text-[#F5F0E8] fill-[#8B5A2B]" />
                              <div className="absolute bottom-1 w-2 h-2 bg-black/30 rounded-full blur-[2px] -z-10"></div>
                            </div>
                          </div>
                        </div>

                        {/* Address Banner */}
                        <div className="bg-white dark:bg-[#151515] transition-colors duration-500 p-4 border-t border-[#A87B45]/20 flex items-start gap-3 relative z-[500]">
                          <MapPin className="text-[#8B5A2B] shrink-0 mt-0.5" size={18} />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[10px] font-bold text-[#1A0F0A] dark:text-[#F5F0E8] uppercase tracking-widest mb-1">Location at Pin</h4>
                            {fetchingAddress ? (
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-full mt-1"></div>
                            ) : (
                              <p className="text-xs text-[#4A3320] dark:text-gray-400 truncate">{mapFetchedAddress || "Fetching location..."}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null
                  ) : null}

                  {/* Swiggy/Zepto style Address Form */}
                  {(formData.locationType === 'manual' || mapConfirmed) && (
                    <div className="bg-white dark:bg-[#151515] transition-colors duration-500 border border-[#A87B45]/30 p-5 rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 mt-4">
                      {formData.locationType === 'map' && (
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xs font-bold text-[#1A0F0A] dark:text-[#F5F0E8] uppercase tracking-wider">Complete Your Address</h4>
                          <button onClick={() => setMapConfirmed(false)} className="text-[10px] text-[#8B5A2B] font-bold uppercase hover:underline">Change Map Pin</button>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#1A0F0A] dark:text-[#F5F0E8] tracking-wider uppercase mb-1.5">House / Flat / Block No.*</label>
                          <input 
                            type="text" 
                            value={formData.houseNo}
                            onChange={(e) => setFormData({...formData, houseNo: e.target.value})}
                            className="w-full border border-[#A87B45]/30 p-3 bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 focus:outline-none focus:border-[#A87B45] focus:bg-white dark:bg-[#151515] transition-colors duration-500 rounded-md shadow-sm text-[#1A0F0A] dark:text-[#F5F0E8] text-sm transition-all"
                            placeholder="e.g. Flat 4B, Iconest3"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#1A0F0A] dark:text-[#F5F0E8] tracking-wider uppercase mb-1.5">Apartment / Road / Area*</label>
                          <textarea 
                            value={formData.area}
                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                            className="w-full border border-[#A87B45]/30 p-3 bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 focus:outline-none focus:border-[#A87B45] focus:bg-white dark:bg-[#151515] transition-colors duration-500 rounded-md shadow-sm text-[#1A0F0A] dark:text-[#F5F0E8] h-20 resize-none transition-all text-sm"
                            placeholder="Enter your complete area details..."
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#1A0F0A] dark:text-[#F5F0E8] tracking-wider uppercase mb-1.5">Landmark (Optional)</label>
                          <input 
                            type="text" 
                            value={formData.landmark}
                            onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                            className="w-full border border-[#A87B45]/30 p-3 bg-[#FDFBF7] dark:bg-[#0A0A0A] transition-colors duration-500 focus:outline-none focus:border-[#A87B45] focus:bg-white dark:bg-[#151515] transition-colors duration-500 rounded-md shadow-sm text-[#1A0F0A] dark:text-[#F5F0E8] text-sm transition-all"
                            placeholder="e.g. Near Apollo Hospital"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {!mapConfirmed && (
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={() => {
                          if (formData.locationType === 'map') {
                            setFormData({...formData, area: mapFetchedAddress});
                          }
                          setMapConfirmed(true);
                        }}
                        disabled={formData.locationType === 'manual' ? (!formData.houseNo || !formData.area) : !formData.locationCoords}
                        className="px-8 py-3.5 font-bold tracking-[0.15em] uppercase text-[10px] text-white rounded-full transition-all duration-300 hover:scale-[1.02] hover:opacity-95 shadow-md flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #C49A5C 0%, #A87B45 50%, #8B5A2B 100%)' }}
                      >
                        {formData.locationType === 'manual' ? 'Confirm Address' : 'Confirm Location'} <Check size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: CONTACT DETAILS (Revealed automatically after location) */}
              <div className={`transition-all duration-700 ease-in-out ${isLocationConfirmed ? 'opacity-100 max-h-[1000px] translate-y-0 mt-4' : 'opacity-0 max-h-0 -translate-y-4 overflow-hidden pointer-events-none'}`}>
                <div className="flex items-center gap-4 border-b border-[#A87B45]/20 pb-4 mb-6">
                  <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-sm" style={{ background: 'linear-gradient(135deg, #C49A5C 0%, #8B5A2B 100%)' }}>3</div>
                  <h3 className="text-lg font-serif font-bold tracking-widest text-[#1A0F0A] dark:text-[#F5F0E8] uppercase">Contact Details</h3>
                </div>
                
                <p className="text-[15px] text-[#4A3320] dark:text-gray-400 mb-8 font-serif">How may we address you?</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#1A0F0A] dark:text-[#F5F0E8] tracking-wider uppercase mb-2">Full Name*</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-[#A87B45]/30 p-3.5 bg-white/7 dark:bg-[#151515]/7 transition-colors duration-500 0 dark:bg-[#151515]/70 transition-colors duration-500 backdrop-blur-sm focus:outline-none focus:border-[#A87B45] focus:bg-white dark:bg-[#151515] transition-colors duration-500 rounded-md shadow-sm text-[#1A0F0A] dark:text-[#F5F0E8] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A0F0A] dark:text-[#F5F0E8] tracking-wider uppercase mb-2">Email Address*</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-[#A87B45]/30 p-3.5 bg-white/7 dark:bg-[#151515]/7 transition-colors duration-500 0 dark:bg-[#151515]/70 transition-colors duration-500 backdrop-blur-sm focus:outline-none focus:border-[#A87B45] focus:bg-white dark:bg-[#151515] transition-colors duration-500 rounded-md shadow-sm text-[#1A0F0A] dark:text-[#F5F0E8] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A0F0A] dark:text-[#F5F0E8] tracking-wider uppercase mb-2">Phone Number*</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-[#A87B45]/30 p-3.5 bg-white/7 dark:bg-[#151515]/7 transition-colors duration-500 0 dark:bg-[#151515]/70 transition-colors duration-500 backdrop-blur-sm focus:outline-none focus:border-[#A87B45] focus:bg-white dark:bg-[#151515] transition-colors duration-500 rounded-md shadow-sm text-[#1A0F0A] dark:text-[#F5F0E8] transition-all"
                    />
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={handleSubmit}
                    disabled={loading || !formData.name || !formData.email || !formData.phone}
                    className="px-9 py-3.5 font-bold tracking-[0.15em] uppercase text-[10px] text-white rounded-full transition-all duration-300 hover:scale-[1.02] hover:opacity-95 shadow-md flex items-center gap-2 group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #C49A5C 0%, #A87B45 50%, #8B5A2B 100%)' }}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Booking'}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
