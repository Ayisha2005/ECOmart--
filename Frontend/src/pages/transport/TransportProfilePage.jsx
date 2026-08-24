import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Truck, ShieldCheck, Phone, User, MapPin, KeyRound } from 'lucide-react';

export const TransportProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="TRANSPORTATION" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Driver & Fleet Account Profile" />

        <main className="p-6 space-y-6 overflow-y-auto max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-cyan-700 text-white flex items-center justify-center text-2xl font-bold">
                {currentUser?.driverName ? currentUser.driverName.charAt(0).toUpperCase() : 'T'}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.name || 'Ramesh Transport Services'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-cyan-100 text-cyan-800 rounded-full uppercase">
                    Admin Created Account
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-600">ID: {currentUser?.transportId || 'TRANS001'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Driver Full Name</label>
                  <p className="font-extrabold text-slate-900 text-sm">{currentUser?.driverName || currentUser?.name || 'Ramesh Kumar'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Driver Phone (+91)</label>
                  <p className="font-bold text-slate-800 text-sm">{currentUser?.phone || '+91 98401 99887'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Created By</label>
                  <p className="font-bold text-emerald-700 text-sm">Platform Admin Only</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Vehicle Plate Number</label>
                  <p className="font-mono font-extrabold text-slate-900 text-sm">{currentUser?.vehicleNumber || 'TN 09 CB 4512'}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">State & Service City</label>
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

export default TransportProfilePage;
