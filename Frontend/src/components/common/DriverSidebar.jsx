import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from './EcoMartLogo';
import {
  LayoutDashboard,
  Navigation,
  CheckCircle2,
  Clock,
  User,
  LogOut,
  Truck,
  ShieldCheck,
  Package,
  Menu,
  X,
  FileText
} from 'lucide-react';

export const DriverSidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/transport/driver/login');
  };

  const menu = [
    { path: '/transport/driver/dashboard', label: 'Driver Dashboard', icon: LayoutDashboard },
    { path: '/transport/driver/requests', label: 'Accept / Reject Orders', icon: Clock, badge: 'New Ride' },
    { path: '/transport/driver/navigation', label: 'Live Map Navigation', icon: Navigation, badge: 'Live GPS' },
    { path: '/transport/driver/history', label: 'Old Orders & History', icon: CheckCircle2 },
    { path: '/transport/driver/profile', label: 'Driver Profile & Truck', icon: User }
  ];

  const driverAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <EcoMartLogo size="sm" showTagline={false} />
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar & Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out shrink-0
        md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Logo */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50">
          <EcoMartLogo size="sm" showTagline={true} />
        </div>

        {/* Driver Workspace Subtitle Header */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/30 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">DRIVER LOGISTICS WORKSPACE</span>
          </div>
          <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Driver'}</p>
          <p className="text-[10px] text-cyan-300 font-mono">ID: {currentUser?.driverId || currentUser?.transportId || 'DRV001'}</p>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-slate-950 font-black shadow-lg shadow-cyan-950/50'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[9px] font-black bg-cyan-400 text-slate-950 rounded-full uppercase">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={driverAvatar}
              alt="Driver Avatar"
              className="w-10 h-10 rounded-xl object-cover border-2 border-cyan-400 shadow-md"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Driver'}</p>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Driver</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Driver Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DriverSidebar;
