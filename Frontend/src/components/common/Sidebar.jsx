import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from './EcoMartLogo';
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingCart,
  Truck,
  Package,
  Clock,
  BarChart3,
  Leaf,
  Settings,
  LogOut,
  PlusCircle,
  MapPin,
  DollarSign,
  MessageSquare,
  Star,
  User,
  ShieldAlert,
  Search,
  History,
  CheckCircle2
} from 'lucide-react';

export const Sidebar = ({ role }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/register');
  };

  const menuConfigs = {
    ADMIN: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/transportation', label: 'Transportation Mgmt', icon: Truck },
      { path: '/admin/users', label: 'Users Directory', icon: Users },
      { path: '/admin/listings', label: 'All Listings', icon: Package },
      { path: '/admin/orders', label: 'Orders & Logistics', icon: ShoppingCart },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/admin/eco-impact', label: 'Eco Impact', icon: Leaf }
    ],
    SELLER: [
      { path: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/seller/add-product', label: 'Add Product (AI Scan)', icon: PlusCircle, badge: 'AI' },
      { path: '/seller/listings', label: 'My Listings', icon: Package },
      { path: '/seller/orders', label: 'Orders & Pickup', icon: ShoppingCart },
      { path: '/seller/earnings', label: 'Earnings', icon: DollarSign },
      { path: '/seller/profile', label: 'Seller Profile', icon: User }
    ],
    BUYER: [
      { path: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/buyer/products', label: 'Browse Products', icon: Search },
      { path: '/buyer/map', label: 'Nearby Map', icon: MapPin },
      { path: '/buyer/orders', label: 'My Orders', icon: ShoppingCart },
      { path: '/buyer/tracking', label: 'Live Tracking', icon: Truck },
      { path: '/buyer/profile', label: 'Buyer Profile', icon: User }
    ],
    TRANSPORTATION: [
      { path: '/transport/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/transport/orders', label: 'Assigned Orders', icon: Package },
      { path: '/transport/pickups', label: 'Pickup Requests', icon: Clock },
      { path: '/transport/deliveries', label: 'Active Deliveries', icon: Truck },
      { path: '/transport/map', label: 'Route Map', icon: MapPin },
      { path: '/transport/history', label: 'Delivery History', icon: History },
      { path: '/transport/vehicle', label: 'Vehicle', icon: Settings },
      { path: '/transport/profile', label: 'Profile', icon: User }
    ]
  };

  const currentMenu = menuConfigs[role] || [];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl z-20 shrink-0">
      {/* Header Logo */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/50">
        <EcoMartLogo size="sm" showTagline={true} />
      </div>

      {/* Role Pill */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Workspace</span>
        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${
          role === 'ADMIN' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
          role === 'SELLER' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
          role === 'BUYER' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
        }`}>
          {role}
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {currentMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-900/30 font-semibold'
                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-lime-400 text-slate-950 rounded">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">{currentUser?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || currentUser?.transportId || role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
