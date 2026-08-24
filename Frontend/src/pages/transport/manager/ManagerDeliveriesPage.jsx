import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { Truck, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export const ManagerDeliveriesPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const myOrders = (orders || []).filter(o => o.transportCompanyId === companyId);

  const deliveryOrders = myOrders.filter(o =>
    ['PICKUP_COMPLETED', 'IN_TRANSIT', 'In Transit', 'ARRIVED_AT_DESTINATION', 'Delivered', 'DELIVERED'].includes(o.transportRequestStatus || o.status)
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Active Delivery Management & Highway Transit" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">In-Transit Deliveries ({deliveryOrders.length})</h2>
              <p className="text-xs text-slate-500">Monitor live trucks en route to buyer recycling facilities</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Material & Weight</th>
                    <th className="p-4">Destination (Buyer Facility)</th>
                    <th className="p-4">Driver Name</th>
                    <th className="p-4">Vehicle Plate</th>
                    <th className="p-4">Est. Delivery</th>
                    <th className="p-4">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deliveryOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-extrabold text-cyan-700">{ord.id}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {ord.productTitle}
                        <p className="text-[11px] text-slate-500 font-normal">{ord.quantityKg} kg</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{ord.buyerName}</p>
                        <p className="text-[11px] text-slate-500">{ord.buyerAddress}</p>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{ord.driverName || 'Ramesh Kumar'}</td>
                      <td className="p-4 font-mono font-bold text-slate-800">{ord.vehicleNumber || 'TN 01 AB 1234'}</td>
                      <td className="p-4 font-medium text-emerald-700">{ord.deliveryEstimate || 'Today, 5:30 PM'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-800 uppercase">
                          {ord.transportRequestStatus || ord.status}
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

export default ManagerDeliveriesPage;
