import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, ShieldCheck, IndianRupee, Sparkles } from 'lucide-react';

export const Navbar = ({ title = "Dashboard" }) => {
  const { currentUser, role } = useAuth();

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 shadow-lg backdrop-blur-xl text-white">
      {/* Title & Page Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>{title}</span>
        </h1>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>India Marketplace</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Currency badge */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-slate-950 text-slate-300 text-xs font-bold rounded-xl border border-slate-800">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
          <span>INR (₹)</span>
        </div>

        {/* Role badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/50 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-lime-300" />
          <span>{role || 'USER'}</span>
        </div>

        {/* User preview */}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-100">{currentUser?.name || 'Authorized User'}</p>
          <p className="text-[10px] font-medium text-emerald-400">{currentUser?.state || 'Tamil Nadu'}</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
