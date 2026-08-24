import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { CheckCircle2, Clock, MapPin, Truck } from 'lucide-react';

export const ManagerTripsHistoryPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const myOrders = (orders || []).filter(o => o.transportCompanyId === companyId);

  const completedTrips = myOrders.filter(o =>
    ['Completed', 'COMPLETED', 'Delivered', 'DELIVERED'].includes(o.transportRequestStatus || o.status)
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Company Completed Trip Logs & Analytics" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Completed Trips Archive ({completedTrips.length})</h2>
              <p className="text-xs text-slate-500">Historical log of fulfilled transportation orders for {currentUser?.companyName}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Trip ID</th>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Material Delivered</th>
                    <th className="p-4">Executed Driver</th>
                    <th className="p-4">Vehicle Plate</th>
                    <th className="p-4">From → To</th>
                    <th className="p-4">Completed Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedTrips.map((ord, idx) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-800">TRIP-2026-0{idx + 1}</td>
                      <td className="p-4 font-mono font-extrabold text-cyan-700">{ord.id}</td>
                      <td className="p-4 font-bold text-slate-900">{ord.productTitle} ({ord.quantityKg} kg)</td>
                      <td className="p-4 font-semibold text-slate-800">{ord.driverName || 'Ramesh Kumar'}</td>
                      <td className="p-4 font-mono font-bold text-slate-800">{ord.vehicleNumber || 'TN 01 AB 1234'}</td>
                      <td className="p-4 font-medium text-slate-700">{ord.sellerAddress} → {ord.buyerAddress}</td>
                      <td className="p-4 font-medium">{ord.pickupDate || 'Today'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerTripsHistoryPage;
