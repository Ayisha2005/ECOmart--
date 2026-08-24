import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { History, CheckCircle2 } from 'lucide-react';

export const TransportHistoryPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useData();

  const completedTrips = orders.filter(o => 
    (o.transportId === currentUser?.transportId || o.transportId === 'TRANS001')
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="TRANSPORTATION" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Delivery History & Logged Trips" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-cyan-500/30 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <span>Completed Logistics Trips Log</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Historical record of completed pickups and deliveries</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {completedTrips.map(trip => (
                <div key={trip.id} className="p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-cyan-700">{trip.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        {trip.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{trip.productTitle}</h4>
                    <p className="text-xs text-slate-500">Pickup: {trip.sellerAddress} &rarr; Delivery: {trip.buyerAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">{trip.quantityKg} kg Delivered</p>
                    <p className="text-[10px] text-slate-400">{trip.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransportHistoryPage;
