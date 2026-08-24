import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { Clock, MapPin, Check, Truck, ArrowRight } from 'lucide-react';

export const ManagerPickupsPage = () => {
  const { currentUser } = useAuth();
  const { orders, updateOrderStatus } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const myOrders = (orders || []).filter(o => o.transportCompanyId === companyId);

  const pickupOrders = myOrders.filter(o =>
    ['TRANSPORT_REQUEST_SENT', 'PARTNER_ACCEPTED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP'].includes(o.transportRequestStatus || o.status)
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Pickup Requests & Seller Hub Queue" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Pickup Queue ({pickupOrders.length})</h2>
              <p className="text-xs text-slate-500">Monitor orders waiting for seller hub pickup and driver arrival</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Material & Weight</th>
                    <th className="p-4">Seller / Pickup Location</th>
                    <th className="p-4">Assigned Driver</th>
                    <th className="p-4">Vehicle Plate</th>
                    <th className="p-4">Scheduled Date</th>
                    <th className="p-4">Pickup Status</th>
                    <th className="p-4 text-right">Manager Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pickupOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-extrabold text-cyan-700">{ord.id}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {ord.productTitle}
                        <p className="text-[11px] text-slate-500 font-normal">{ord.quantityKg} kg</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{ord.sellerName}</p>
                        <p className="text-[11px] text-slate-500">{ord.sellerAddress}</p>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{ord.driverName || 'Unassigned'}</td>
                      <td className="p-4 font-mono font-bold text-slate-800">{ord.vehicleNumber || 'Unassigned'}</td>
                      <td className="p-4 font-medium">{ord.pickupDate || 'Today'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 uppercase">
                          {ord.transportRequestStatus || ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.id, 'PICKUP_COMPLETED')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                        >
                          Mark Pickup Complete
                        </button>
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

export default ManagerPickupsPage;
