import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Truck, Battery, ShieldCheck, Wrench } from 'lucide-react';

export const TransportVehiclePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="TRANSPORTATION" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Assigned EV Vehicle Specifications" />

        <main className="p-6 space-y-6 overflow-y-auto max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-50 text-cyan-700 rounded-2xl">
                  <Truck className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.vehicleType || 'Tata Ace EV (Electric Commercial)'}</h2>
                  <p className="text-xs font-mono font-bold text-cyan-700">Plate Number: {currentUser?.vehicleNumber || 'TN 09 CB 4512'}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                Active EV Unit
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Battery Level</label>
                  <div className="flex items-center gap-2">
                    <Battery className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-slate-900 text-sm">88% Charged (Est. 210 km range)</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Assigned Transport ID</label>
                  <p className="font-mono font-extrabold text-cyan-700 text-sm">{currentUser?.transportId || 'TRANS001'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Service Area</label>
                  <p className="font-bold text-slate-900 text-sm">{currentUser?.serviceArea || 'Chennai Metro & Kanchipuram Belt'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">State & City Hub</label>
                  <p className="font-bold text-slate-800 text-sm">{currentUser?.city || 'Chennai'}, {currentUser?.state || 'Tamil Nadu'}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransportVehiclePage;
