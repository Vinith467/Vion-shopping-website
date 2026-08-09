import React from 'react';
import { X, Activity, Smartphone, Monitor } from 'lucide-react';

export default function LoginActivityModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const activities = [
    { id: 1, device: 'MacBook Pro - Chrome', location: 'Bangalore, India', time: 'Active now', icon: Monitor, isCurrent: true },
    { id: 2, device: 'iPhone 13 - Safari', location: 'Bangalore, India', time: '2 hours ago', icon: Smartphone, isCurrent: false },
    { id: 3, device: 'Windows PC - Firefox', location: 'Mumbai, India', time: '3 days ago', icon: Monitor, isCurrent: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 text-gray-900">
            <Activity size={20} className="text-[#3A10E5]" />
            <h2 className="text-xl font-bold font-serif">Login Activity</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-2">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className={`flex items-center justify-between p-4 ${index !== activities.length -1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.isCurrent ? 'bg-purple-50 text-[#3A10E5]' : 'bg-gray-50 text-gray-500'}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{activity.device}</h4>
                    <p className="text-xs text-gray-500">{activity.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.isCurrent ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Current Session</span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400">{activity.time}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button className="w-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl transition-all shadow-sm text-sm">
            Log out of all other devices
          </button>
        </div>
      </div>
    </div>
  );
}
