import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Users, Sparkles, Heart, ChevronRight, Star, UserCheck, RefreshCcw, ShoppingBag, ChevronLeft, Camera, Loader2, X, AlertCircle, Edit2, MapPin, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';

const CATEGORIES = [
  { id: 'for_you', name: 'For You', icon: Star, image: null, isSpecial: true },
  { id: 'business_suits', name: 'Business Suits', image: '/images/business_suits.jpg' },
  { id: 'formal_dresses', name: 'Formal Dresses', image: '/images/formal_dresses.jpg' },
  { id: 'business_casual', name: 'Business Casual', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'smart_casual', name: 'Smart Casual', image: '/images/smart_casual.png' },
  { id: 'coord_sets', name: 'Co-Ord Sets', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'jumpsuits', name: 'Jumpsuits', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'power_dressing', name: 'Power Dressing', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'indo_western_formal', name: 'Indo-Western Formal', image: 'https://images.unsplash.com/photo-1610030469983-98e550d61dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'premium_executive', name: 'Premium Executive', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
  { id: 'friday_office_wear', name: 'Friday Office Wear', image: 'https://images.unsplash.com/photo-1550614000-4b95d46f5b9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80' },
];

export default function HomeTab({ customConsumer, onBack }) {
  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-medium">This page has been cleared. Waiting for your design instructions...</p>
      </div>
    </div>
  );
}

// Small helper component for the chevron in the header
const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
