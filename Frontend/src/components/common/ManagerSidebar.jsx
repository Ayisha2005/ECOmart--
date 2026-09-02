import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from './EcoMartLogo';
import {
  LayoutDashboard,
  Truck,
  Users,
  Package,
  Navigation,
  Clock,
  CheckCircle2,
  BarChart3,
  Building2,
  LogOut,
  Edit3,
  X,
  Camera,
  Save,
  User,
  ShieldCheck
} from 'lucide-react';

const MANAGER_AVATAR_PRESETS = [
  { id: 1, label: 'Manager Photo 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: 2, label: 'Manager Photo 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 3, label: 'Manager Photo 3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  { id: 4, label: 'Manager Photo 4', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80' }
];

export const ManagerSidebar = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [managerData, setManagerData] = useState({
    name: currentUser?.name || 'Santhosh Kumar (GreenRoute Manager)',
    phone: currentUser?.phone || '+91 98401 11223',
    email: currentUser?.email || 'manager@greenroute.in',
    companyName: currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd',
    city: currentUser?.city || 'Chennai',
    state: currentUser?.state || 'Tamil Nadu',
    avatar: currentUser?.avatar || MANAGER_AVATAR_PRESETS[0].url
  });

  const handleLogout = () => {
    logout();
    navigate('/transport/partner/login');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setManagerData(prev => ({ ...prev, avatar: photoUrl }));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile({
        name: managerData.name,
        phone: managerData.phone,
        email: managerData.email,
        companyName: managerData.companyName,
        city: managerData.city,
        state: managerData.state,
        avatar: managerData.avatar
      });
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowEditModal(false);
    }, 1000);
  };

  const menu = [
    { path: '/transport/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transport/manager/fleet', label: 'Fleet Management', icon: Truck },
    { path: '/transport/manager/drivers', label: 'Drivers & Workers', icon: Users },
    { path: '/transport/manager/orders', label: 'Assigned Orders', icon: Package },
    { path: '/transport/manager/tracking', label: 'Route Tracking', icon: Navigation, badge: 'Live GPS' },
    { path: '/transport/manager/pickups', label: 'Pickup Requests', icon: Clock },
    { path: '/transport/manager/deliveries', label: 'Delivery Management', icon: Truck },
    { path: '/transport/manager/trips', label: 'Trip History', icon: CheckCircle2 },
    { path: '/transport/manager/reports', label: 'Reports', icon: BarChart3 },
    { path: '/transport/manager/profile', label: 'Company Profile', icon: Building2 }
  ];

  const managerAvatar = currentUser?.avatar || managerData.avatar;

  return (
    <>
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl z-20 shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50">
          <EcoMartLogo size="sm" showTagline={true} />
        </div>

        {/* Company Badge Header */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/40 flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">Transport Partner Workspace</span>
          <p className="text-xs font-bold text-slate-200 truncate">{currentUser?.companyName || managerData.companyName}</p>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-slate-950 font-extrabold shadow-md shadow-cyan-950/50'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-cyan-400 text-slate-950 rounded">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer with Manager Avatar Photo & Edit Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col gap-3">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setShowEditModal(true)}>
            <div className="relative">
              <img
                src={managerAvatar}
                alt="Transport Manager"
                className="w-10 h-10 rounded-xl object-cover border-2 border-cyan-500 shadow-md group-hover:opacity-85 transition-opacity"
              />
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-0.5 rounded-full border border-slate-950">
                <Edit3 className="w-2.5 h-2.5" />
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                {currentUser?.name || managerData.name}
              </p>
              <p className="text-[10px] text-cyan-400 font-mono truncate">
                {currentUser?.transportId || currentUser?.driverId || 'TRM001'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edit Manager Profile</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Interactive Transport Manager Profile Edit Modal Drawer */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-800">
              <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Edit Transport Manager Profile</h3>
                <p className="text-xs text-slate-400">Update manager name, avatar photo, phone & logistics company details</p>
              </div>
            </div>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transport Manager Profile updated live across workspace!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Photo Picker */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Manager Avatar Photo</label>
                
                <div className="flex items-center gap-4">
                  <img
                    src={managerData.avatar}
                    alt="Manager Avatar Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shrink-0"
                  />

                  <div className="space-y-2 flex-1 min-w-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload Custom Photo</span>
                    </button>
                    <p className="text-[10px] text-slate-400">Upload a clear photo for manager profile identification</p>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Manager Full Name *</label>
                  <input
                    type="text"
                    value={managerData.name}
                    onChange={(e) => setManagerData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-sm focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile Phone (+91) *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={managerData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setManagerData(prev => ({ ...prev, phone: val }));
                      }}
                      placeholder="Enter 10-digit Mobile Number"
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Official Email *</label>
                    <input
                      type="email"
                      value={managerData.email}
                      onChange={(e) => setManagerData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Logistics Company Name *</label>
                  <input
                    type="text"
                    value={managerData.companyName}
                    onChange={(e) => setManagerData(prev => ({ ...prev, companyName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-bold focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City / District</label>
                    <input
                      type="text"
                      value={managerData.city}
                      onChange={(e) => setManagerData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">State</label>
                    <input
                      type="text"
                      value={managerData.state}
                      onChange={(e) => setManagerData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>Save Manager Profile Changes</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerSidebar;
