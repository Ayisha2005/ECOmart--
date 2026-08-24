import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Store, ShoppingBag, Shield, Truck, User, Compass } from 'lucide-react';

const PORTAL_ITEMS = [
  {
    role: 'Seller Portal',
    desc: 'Scrap Listing & AI Scrap Pricing',
    icon: Store,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    btnColor: 'hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    link: '/seller/login'
  },
  {
    role: 'Buyer Portal',
    desc: 'Bulk Scrap Procurement & Bidding',
    icon: ShoppingBag,
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    btnColor: 'hover:bg-lime-500/20 text-lime-400 border-lime-500/30',
    link: '/buyer/login'
  },
  {
    role: 'Admin Dashboard',
    desc: 'Platform Audits & Transport Control',
    icon: Shield,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    btnColor: 'hover:bg-amber-500/20 text-amber-400 border-amber-500/30',
    link: '/admin/login'
  },
  {
    role: 'Transport Manager',
    desc: '3rd-Party Fleet Dispatch Logistics',
    icon: Truck,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    btnColor: 'hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    link: '/transport/login'
  },
  {
    role: 'Fleet Driver',
    desc: 'Live OpenStreetMap GPS Tracking',
    icon: User,
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    btnColor: 'hover:bg-teal-500/20 text-teal-400 border-teal-500/30',
    link: '/transport/driver/login'
  }
];

export const DemoCredentialsBox = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-emerald-500/40 shadow-2xl space-y-3.5 text-white ${className}`}>
      {/* Box Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider text-emerald-300">
              ECO MART Role Portals
            </h4>
            <p className="text-[10px] text-slate-400">Direct portal navigation for all marketplace roles</p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[9px] font-mono font-black bg-emerald-950 text-emerald-400 rounded-full border border-emerald-500/30 uppercase">
          India v2.5
        </span>
      </div>

      {/* Portal Navigation Items Grid */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {PORTAL_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-2 rounded-lg border ${item.badgeColor} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-white text-xs block truncate">{item.role}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{item.desc}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(item.link)}
                className={`px-3 py-1.5 rounded-lg border bg-slate-900 font-extrabold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${item.btnColor}`}
              >
                <span>Login</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span>Click Login to navigate to any role portal</span>
        <span className="text-emerald-400 font-bold">ECO MART Platform</span>
      </div>
    </div>
  );
};

export default DemoCredentialsBox;
