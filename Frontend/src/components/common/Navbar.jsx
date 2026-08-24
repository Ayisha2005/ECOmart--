import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Bell, ShieldCheck, Search, IndianRupee } from 'lucide-react';

export const Navbar = ({ title = "Dashboard" }) => {
  const { currentUser, role } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Title & Page Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>India Marketplace</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Currency badge */}
        <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
          <span>INR (₹)</span>
        </div>

        {/* Role badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
          <span>{role}</span>
        </div>

        {/* User preview */}
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-slate-800">{currentUser?.name || 'Authorized User'}</p>
          <p className="text-[10px] font-medium text-slate-500">{currentUser?.state || 'India Zone'}</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
