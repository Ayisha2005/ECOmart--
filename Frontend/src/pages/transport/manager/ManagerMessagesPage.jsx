import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { Bell, Truck, CheckCircle2, Clock, MapPin, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

export const ManagerMessagesPage = () => {
  const { currentUser } = useAuth();
  const { appNotifications = [], orders = [] } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';

  // Filter live notifications for this company
  const companyMessages = (appNotifications || []).filter(n => 
    n.transportCompanyId === companyId || n.recipientRole === 'TRANSPORT_MANAGER' || !n.transportCompanyId
  );

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Live Driver Messages & Dispatch Alert Dashboard" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-wide">Live Driver Trip Progress & Messages</h2>
              </div>
              <p className="text-xs text-slate-300">
                Real-time status updates broadcasted by company drivers as they advance trip milestones.
              </p>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <span className="px-3.5 py-1.5 bg-cyan-500/20 text-cyan-300 font-mono font-extrabold text-xs rounded-xl border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                {companyMessages.length} Live Alerts
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span>Driver Activity Stream (MongoDB Atlas Live Sync)</span>
              </h3>
            </div>

            {companyMessages.length > 0 ? (
              <div className="space-y-3">
                {companyMessages.map((msg) => {
                  const isCompleted = ['COMPLETED', 'DELIVERED', 'Completed'].includes(msg.status);
                  const isPickup = msg.status === 'PICKUP_COMPLETED';
                  const isInTransit = msg.status === 'IN_TRANSIT';

                  return (
                    <div
                      key={msg.id || Math.random()}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : isInTransit
                          ? 'bg-cyan-950/40 border-cyan-500/40'
                          : isPickup
                          ? 'bg-amber-950/40 border-amber-500/40'
                          : 'bg-slate-950/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-xl text-slate-950 font-bold shrink-0 mt-0.5 ${
                          isCompleted ? 'bg-emerald-400' : isInTransit ? 'bg-cyan-400' : 'bg-amber-400'
                        }`}>
                          <Truck className="w-5 h-5" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-extrabold text-white text-sm">{msg.title}</h4>
                            {msg.orderId && (
                              <span className="font-mono text-[10px] font-extrabold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-cyan-500/30">
                                {msg.orderId}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 font-medium">{msg.message}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</p>
                        </div>
                      </div>

                      {msg.status && (
                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : isInTransit
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        }`}>
                          {msg.status}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="font-bold text-white text-sm">No Live Messages Yet</p>
                <p className="text-xs text-slate-500">
                  When drivers advance trip milestones on their app, live alerts will appear here in real time.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerMessagesPage;
