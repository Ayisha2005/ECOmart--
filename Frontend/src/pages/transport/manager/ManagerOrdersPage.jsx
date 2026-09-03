import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { Package, Truck, Check, X, Send, Search, Filter, Clock } from 'lucide-react';

export const ManagerOrdersPage = () => {
  const { currentUser } = useAuth();
  const {
    orders = [],
    companyDrivers = [],
    fleetVehicles = [],
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
  const availableDrivers = myDrivers.filter(d => !d.status || d.status === 'Available' || d.status === 'AVAILABLE');
  const myVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === companyId || !v.transportCompanyId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDriverIdFilter, setSelectedDriverIdFilter] = useState('');

  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState('');

  let filteredOrders = myOrders;

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredOrders = filteredOrders.filter(o => 
      (o.id || '').toLowerCase().includes(q) ||
      (o.productTitle || '').toLowerCase().includes(q) ||
      (o.sellerName || '').toLowerCase().includes(q) ||
      (o.buyerName || '').toLowerCase().includes(q)
    );
  }

  if (selectedStatus) {
    filteredOrders = filteredOrders.filter(o => (o.transportRequestStatus || o.status) === selectedStatus);
  }

  if (selectedDriverIdFilter) {
    filteredOrders = filteredOrders.filter(o => o.driverId === selectedDriverIdFilter);
  }

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderForDispatch || !selectedDriverId || !selectedVehicleNumber) return;

    assignDriverAndVehicleToOrder(selectedOrderForDispatch.id, selectedDriverId, selectedVehicleNumber);
    setSelectedOrderForDispatch(null);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Assigned Marketplace Orders & Fleet Dispatch" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-wide">Assigned Marketplace Orders & Dispatch</h2>
              </div>
              <p className="text-xs text-slate-300">
                Review assigned scrap orders, accept logistics requests, and dispatch company drivers & trucks for {currentUser?.companyName}.
              </p>
            </div>

            <span className="px-3.5 py-1.5 bg-cyan-500/20 text-cyan-300 font-mono font-extrabold text-xs rounded-xl border border-cyan-500/30 shrink-0 relative z-10">
              {myOrders.length} Assigned Orders
            </span>
          </div>

          {/* Search & Multi-Filter Control Bar */}
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search Order ID, Material, Seller, Buyer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-hidden font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium outline-hidden"
                >
                  <option value="">All Request Statuses</option>
                  <option value="TRANSPORT_REQUEST_SENT">Request Sent</option>
                  <option value="PARTNER_ACCEPTED">Partner Accepted</option>
                  <option value="DRIVER_ASSIGNED">Driver Dispatched</option>
                  <option value="DRIVER_ACCEPTED">Driver Accepted</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <select
                  value={selectedDriverIdFilter}
                  onChange={(e) => setSelectedDriverIdFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium outline-hidden"
                >
                  <option value="">All Company Drivers</option>
                  {myDrivers.map(d => (
                    <option key={d.id} value={d.driverId}>{d.name} ({d.driverId})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">ORDER ID</th>
                    <th className="p-3.5">MATERIAL & PAYLOAD</th>
                    <th className="p-3.5">SELLER & PICKUP</th>
                    <th className="p-3.5">BUYER & DESTINATION</th>
                    <th className="p-3.5">ASSIGNED DRIVER</th>
                    <th className="p-3.5">ASSIGNED TRUCK</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5 text-right">PARTNER ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(ord => {
                      const reqStatus = ord.transportRequestStatus || ord.status;
                      const isPendingSent = reqStatus === 'TRANSPORT_REQUEST_SENT';
                      const isAcceptedPendingDispatch = reqStatus === 'PARTNER_ACCEPTED';
                      const isDriverRejected = reqStatus === 'DRIVER_REJECTED';

                      return (
                        <tr key={ord.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-mono font-extrabold text-cyan-400">{ord.id}</td>
                          <td className="p-3.5">
                            <p className="font-extrabold text-white">{ord.productTitle}</p>
                            <p className="text-[11px] text-cyan-300 font-mono font-bold">{ord.quantityKg} kg • ₹{Number(ord.totalPrice || 0).toLocaleString('en-IN')}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-200">{ord.sellerName || 'Seller'}</p>
                            <p className="text-[10px] text-slate-400">{ord.sellerAddress}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-200">{ord.buyerName || 'Buyer'}</p>
                            <p className="text-[10px] text-slate-400">{ord.buyerAddress}</p>
                          </td>
                          <td className="p-3.5 font-bold text-slate-200">{ord.driverName || 'Unassigned'}</td>
                          <td className="p-3.5 font-mono font-bold text-cyan-300">{ord.vehicleNumber || 'Unassigned'}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                              isPendingSent ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' :
                              isAcceptedPendingDispatch ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                              isDriverRejected ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-bounce' :
                              'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            }`}>
                              {reqStatus}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {isPendingSent ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => partnerRejectOrder(ord.id)}
                                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-lg border border-rose-500/30 cursor-pointer"
                                >
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  onClick={() => partnerAcceptOrder(ord.id)}
                                  className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold rounded-lg cursor-pointer flex items-center gap-1 shadow-md"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept Order</span>
                                </button>
                              </div>
                            ) : (isAcceptedPendingDispatch || isDriverRejected) ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderForDispatch(ord);
                                  setSelectedDriverId(availableDrivers[0]?.driverId || myDrivers[0]?.driverId || '');
                                  setSelectedVehicleNumber(myVehicles[0]?.vehicleNumber || '');
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-extrabold rounded-xl cursor-pointer flex items-center gap-1 shadow-md"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{isDriverRejected ? 'Re-assign Available Driver' : 'Assign Driver & Lorry'}</span>
                              </button>
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">Dispatched</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-10 text-center text-slate-400 space-y-2">
                        <Package className="w-10 h-10 text-slate-600 mx-auto" />
                        <p className="font-bold text-white text-sm">No Assigned Orders</p>
                        <p className="text-xs text-slate-500">Logistics requests assigned by Admin will appear here.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Dispatch Driver & Lorry Modal */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm">Assign Driver & Lorry for {selectedOrderForDispatch.id}</h3>
              <button onClick={() => setSelectedOrderForDispatch(null)} className="font-bold text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Driver *</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-medium text-white focus:ring-2 focus:ring-cyan-500 outline-hidden"
                >
                  <option value="">-- Select Driver --</option>
                  {myDrivers.map(d => (
                    <option key={d.id} value={d.driverId}>{d.name} ({d.driverId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Truck / Lorry *</label>
                <select
                  value={selectedVehicleNumber}
                  onChange={(e) => setSelectedVehicleNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-hidden"
                >
                  <option value="">-- Select Vehicle --</option>
                  {myVehicles.map(v => (
                    <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} ({v.vehicleType})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-extrabold hover:from-cyan-300 hover:to-teal-300 cursor-pointer shadow-md"
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
