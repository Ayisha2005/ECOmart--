import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

export const BuyerProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="BUYER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Buyer Account & Shipping Address" />

        <main className="p-6 space-y-6 overflow-y-auto max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center text-2xl font-bold">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'B'}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.name || 'Anand Polymers India'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full uppercase">
                    Verified Buyer
                  </span>
                  <span className="text-xs text-slate-500 font-medium">India Marketplace</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Full Name</label>
                  <p className="font-extrabold text-slate-900 text-sm">{currentUser?.name || 'Anand Kumar'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Email Address</label>
                  <p className="font-bold text-slate-800 text-sm">{currentUser?.email || 'buyer@ecomart.in'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Mobile Phone (India +91)</label>
                  <p className="font-bold text-slate-800 text-sm">{currentUser?.phone || '+91 97909 11223'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Delivery Address</label>
                  <p className="font-bold text-slate-900 text-sm">{currentUser?.address || 'Plot 18, Ambattur Industrial Estate'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">State & City</label>
                  <p className="font-bold text-slate-800 text-sm">{currentUser?.city || 'Chennai'}, {currentUser?.state || 'Tamil Nadu'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Pincode</label>
                  <p className="font-mono font-bold text-slate-800 text-sm">{currentUser?.pincode || '600018'}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyerProfilePage;
