import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { Package, Truck, UserCheck, Check, X, Send, AlertCircle, Clock } from 'lucide-react';

export const ManagerOrdersPage = () => {
  const { currentUser } = useAuth();
  const {
    orders,
    companyDrivers,
    fleetVehicles,
    partnerAcceptOrder,
    partnerRejectOrder,
    assignDriverAndVehicleToOrder
  } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const companyNameClean = (currentUser?.companyName || 'greenroute').toLowerCase();
  
  const myOrders = (orders || []).filter(o => 
    o.transportCompanyId === companyId || 
    (o.transportCompanyName && o.transportCompanyName.toLowerCase().includes(companyNameClean)) ||
    (o.transportRequestStatus === 'TRANSPORT_REQUEST_SENT' && !o.transportCompanyId) ||
    o.transportRequestStatus === 'ORDER_CONFIRMED'
  );
  const myDrivers = (companyDrivers || []).filter(d => d.transportCompanyId === companyId || !d.transportCompanyId);
  const myVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === companyId || !v.transportCompanyId);

  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState('');

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderForDispatch || !selectedDriverId || !selectedVehicleNumber) return;

    assignDriverAndVehicleToOrder(selectedOrderForDispatch.id, selectedDriverId, selectedVehicleNumber);
    setSelectedOrderForDispatch(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Incoming ECO MART Order Assignments & Dispatch" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                ECO MART Transportation Requests ({myOrders.length})
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Review incoming marketplace order requests for {currentUser?.companyName}. Accept orders and dispatch company drivers & lorries.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Material & Weight</th>
                    <th className="p-4">Pickup (Seller)</th>
                    <th className="p-4">Delivery (Buyer)</th>
                    <th className="p-4">Assigned Driver</th>
                    <th className="p-4">Assigned Lorry</th>
                    <th className="p-4">Request Status</th>
                    <th className="p-4 text-right">Partner Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-extrabold text-cyan-700">{ord.id}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {ord.productTitle}
                        <p className="text-[11px] text-slate-500 font-normal">{ord.quantityKg} kg • ₹{ord.totalPrice}</p>
                      </td>
                      <td className="p-4 font-medium text-slate-800">{ord.sellerAddress}</td>
                      <td className="p-4 font-medium text-slate-800">{ord.buyerAddress}</td>
                      <td className="p-4 font-semibold text-slate-800">{ord.driverName || 'Unassigned'}</td>
                      <td className="p-4 font-mono font-bold text-slate-800">{ord.vehicleNumber || 'Unassigned'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          ord.transportRequestStatus === 'TRANSPORT_REQUEST_SENT'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : ord.transportRequestStatus === 'PARTNER_ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.transportRequestStatus === 'DRIVER_ASSIGNED'
                            ? 'bg-cyan-100 text-cyan-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {ord.transportRequestStatus || ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {ord.transportRequestStatus === 'TRANSPORT_REQUEST_SENT' ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => partnerRejectOrder(ord.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => partnerAcceptOrder(ord.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>
                          </div>
                        ) : ord.transportRequestStatus === 'PARTNER_ACCEPTED' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderForDispatch(ord);
                              setSelectedDriverId(myDrivers[0]?.driverId || '');
                              setSelectedVehicleNumber(myVehicles[0]?.vehicleNumber || '');
                            }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1"
                          >
                            <Send className="w-3 h-3 text-cyan-400" />
                            <span>Assign Driver & Lorry</span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">Dispatched</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Dispatch Driver & Vehicle */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Dispatch Driver & Lorry for {selectedOrderForDispatch.id}
              </h3>
              <button onClick={() => setSelectedOrderForDispatch(null)} className="font-bold text-slate-400">✕</button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Company Driver *</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="">-- Choose Driver --</option>
                  {myDrivers.map(d => (
                    <option key={d.id} value={d.driverId}>{d.name} ({d.driverId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Company Truck / Lorry *</label>
                <select
                  value={selectedVehicleNumber}
                  onChange={(e) => setSelectedVehicleNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                >
                  <option value="">-- Choose Vehicle --</option>
                  {myVehicles.map(v => (
                    <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} ({v.vehicleType})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-600 text-slate-950 font-bold hover:bg-cyan-500"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerOrdersPage;
