import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from './EcoMartLogo';
import {
  MapPin,
  ShieldCheck,
  IndianRupee,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Search,
  Package,
  ShoppingCart,
  Truck,
  User,
  PlusCircle,
  DollarSign,
  History,
  BarChart3,
  Leaf,
  Users
} from 'lucide-react';

export const Navbar = ({ title = "Dashboard" }) => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      { path: '/transport/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/transport/manager/fleet', label: 'Fleet Management', icon: Truck },
      { path: '/transport/manager/drivers', label: 'Drivers & Workers', icon: Users },
      { path: '/transport/manager/orders', label: 'Assigned Orders', icon: Package },
      { path: '/transport/manager/tracking', label: 'Route Tracking', icon: Truck },
      { path: '/transport/manager/profile', label: 'Company Profile', icon: User }
    ],
    TRANSPORT_MANAGER: [
      { path: '/transport/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/transport/manager/fleet', label: 'Fleet Management', icon: Truck },
      { path: '/transport/manager/drivers', label: 'Drivers & Workers', icon: Users },
      { path: '/transport/manager/orders', label: 'Assigned Orders', icon: Package },
      { path: '/transport/manager/tracking', label: 'Route Tracking', icon: Truck },
      { path: '/transport/manager/profile', label: 'Company Profile', icon: User }
    ],
    TRANSPORT_DRIVER: [
      { path: '/transport/driver/dashboard', label: 'Driver Mobile App', icon: Truck }
    ]
  };

  const currentMenu = menuConfigs[role] || [];

  return (
    <>
      <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-lg backdrop-blur-xl text-white w-full">
        {/* Title & Page Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 cursor-pointer transition-colors"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-white tracking-tight flex items-center gap-2 truncate">
            <span>{title}</span>
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>India Marketplace</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Currency badge */}
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-slate-950 text-slate-300 text-xs font-bold rounded-xl border border-slate-800">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>INR (₹)</span>
          </div>

          {/* Role badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-md shadow-emerald-950/50 border border-emerald-500/30">
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

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between shadow-2xl z-50 p-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <EcoMartLogo size="sm" showTagline={true} />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4 px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Workspace:</span>
                <span className="font-extrabold text-emerald-400">{role || 'USER'}</span>
              </div>

              <nav className="space-y-1">
                {currentMenu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
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
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">{currentUser?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || role}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
