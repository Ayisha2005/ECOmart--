import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { User, Store, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export const SellerProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="SELLER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Seller Profile & Business Verification" />

        <main className="p-6 space-y-6 overflow-y-auto max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.name || 'Green Earth Recyclers Pvt Ltd'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-full uppercase">
                    Verified Seller
                  </span>
                  <span className="text-xs text-slate-500 font-medium">India Zone</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Full Name</label>
                  <p className="font-extrabold text-slate-900 text-sm">{currentUser?.name || 'Ramesh Kumar'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Email Address</label>
                  <p className="font-bold text-slate-800 text-sm">{currentUser?.email || 'seller@ecomart.in'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Mobile Phone (India +91)</label>
                  <p className="font-bold text-slate-800 text-sm">{currentUser?.phone || '+91 98765 43210'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Business Address</label>
                  <p className="font-bold text-slate-900 text-sm">{currentUser?.address || 'Plot 42, Guindy Industrial Estate'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">State & City</label>
                  <p className="font-bold text-slate-800 text-sm">{currentUser?.city || 'Chennai'}, {currentUser?.state || 'Tamil Nadu'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Pincode</label>
                  <p className="font-mono font-bold text-slate-800 text-sm">{currentUser?.pincode || '600028'}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerProfilePage;
