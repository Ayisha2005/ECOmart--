import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Store, ShoppingBag, ShieldCheck, Truck, User, Compass, ArrowRight, Sparkles } from 'lucide-react';

const PORTAL_ITEMS = [
  {
    role: 'Seller Portal',
    desc: 'Scrap Listing & AI Scrap Pricing',
    icon: Store,
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    btnGradient: 'from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white',
    link: '/seller/login'
  },
  {
    role: 'Buyer Portal',
    desc: 'Bulk Scrap Procurement & Bidding',
    icon: ShoppingBag,
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    btnGradient: 'from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white',
    link: '/buyer/login'
  },
  {
    role: 'Admin Dashboard',
    desc: 'Platform Audits & Transport Control',
    icon: ShieldCheck,
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    btnGradient: 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950',
    link: '/admin/login'
  },
  {
    role: 'Transport Manager',
    desc: '3rd-Party Fleet Dispatch Logistics',
    icon: Truck,
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
    btnGradient: 'from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white',
    link: '/transport/login'
  },
  {
    role: 'Fleet Driver',
    desc: 'Live OpenStreetMap GPS Tracking',
    icon: User,
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
    btnGradient: 'from-indigo-500 to-cyan-600 hover:from-indigo-400 hover:to-cyan-500 text-white',
    link: '/transport/driver/login'
  }
];

export const DemoCredentialsBox = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-slate-900/90 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl space-y-4 text-white ${className}`}>
      
      {/* Box Header (No inner scrollbar box!) */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>ECO MART ROLE PORTALS</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h4>
            <p className="text-[11px] text-slate-400">Direct portal navigation for all marketplace roles</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 rounded-full border border-emerald-500/30 uppercase">
          India v2.5
        </span>
      </div>

      {/* Vertical 1-Column Full-Width List (NO squishing, NO inner scrollbar!) */}
      <div className="space-y-2.5">
        {PORTAL_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between gap-4 transition-all group hover:bg-slate-950"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className={`p-2.5 rounded-xl border ${item.badgeColor} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-extrabold text-white text-xs sm:text-sm block">{item.role}</h5>
                  <p className="text-[11px] text-slate-400 block leading-tight">{item.desc}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(item.link)}
                className={`px-3.5 py-2 rounded-xl bg-gradient-to-r ${item.btnGradient} font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md active:scale-95`}
              >
                <span>Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click Login to navigate to any role portal</span>
        <span className="text-emerald-400 font-extrabold">ECO MART Platform</span>
      </div>

    </div>
  );
};

export default DemoCredentialsBox;
