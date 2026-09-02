import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import {
  Truck,
  PlusCircle,
  CheckCircle2,
  Clock,
  Navigation,
  XCircle,
  Package,
  Check,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';

export const ManagerFleetPage = () => {
  const { currentUser } = useAuth();
  const { fleetVehicles = [], companyDrivers = [], orders = [], addFleetVehicle } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const myVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === companyId || !v.transportCompanyId);
  const myDrivers = (companyDrivers || []).filter(d => d.transportCompanyId === companyId || !d.transportCompanyId);
  const myOrders = (orders || []).filter(o => 
    o.transportCompanyId === companyId || 
    (o.transportCompanyName && o.transportCompanyName.toLowerCase().includes('greenroute'))
  );

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'IN_TRANSIT', 'PICKUP', 'ACCEPTED', 'COMPLETED', 'CANCELLED'
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNumber: 'TN 01 EV 8899',
    vehicleType: 'Tata Ace EV (Electric Lorry)',
    capacity: '1.5 Tons',
    serviceArea: 'Chennai Industrial Belt',
    driverId: ''
  });

  // Categorized Order / Fleet Trips
  const inTransitTrips = myOrders.filter(o => ['IN_TRANSIT', 'In Transit', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_DESTINATION'].includes(o.transportRequestStatus || o.status));
  const pickupTrips = myOrders.filter(o => ['ARRIVED_AT_PICKUP', 'PICKUP_COMPLETED', 'On Pickup'].includes(o.transportRequestStatus || o.status));
  const acceptedTrips = myOrders.filter(o => ['PARTNER_ACCEPTED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED'].includes(o.transportRequestStatus || o.status));
  const completedTrips = myOrders.filter(o => ['COMPLETED', 'DELIVERED', 'Completed'].includes(o.transportRequestStatus || o.status));
  const cancelledTrips = myOrders.filter(o => ['CANCELLED', 'REJECTED', 'PARTNER_REJECTED'].includes(o.transportRequestStatus || o.status));

  const filteredTrips = activeTab === 'IN_TRANSIT' ? inTransitTrips :
    activeTab === 'PICKUP' ? pickupTrips :
    activeTab === 'ACCEPTED' ? acceptedTrips :
    activeTab === 'COMPLETED' ? completedTrips :
    activeTab === 'CANCELLED' ? cancelledTrips :
    myOrders;

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignedDriver = myDrivers.find(d => d.driverId === formData.driverId);
    
    addFleetVehicle({
      ...formData,
      driverName: assignedDriver ? assignedDriver.name : "Unassigned",
      driverPhone: assignedDriver ? assignedDriver.phone : ""
    }, currentUser);

    setShowAddModal(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Fleet Vehicle & Trip Lifecycle Analytics Dashboard" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <Truck className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-wide">Fleet Vehicles & Trip Status Analytics</h2>
              </div>
              <p className="text-xs text-slate-300">
                Track live fleet lorries, pickup progress, in-transit deliveries, completed orders, and rejected requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-950/50 cursor-pointer flex items-center gap-1.5 relative z-10 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Add Vehicle to Fleet</span>
            </button>
          </div>

          {/* Fleet Vehicles Overview Cards */}
          <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Company Vehicle Fleet Directory ({myVehicles.length} Lorries)</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Vehicle Plate No</th>
                    <th className="p-3.5">Type & Model</th>
                    <th className="p-3.5">Capacity</th>
                    <th className="p-3.5">Assigned Driver</th>
                    <th className="p-3.5">Service Zone</th>
                    <th className="p-3.5">Live Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {myVehicles.map(veh => (
                    <tr key={veh.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-mono font-extrabold text-cyan-400 text-sm">{veh.vehicleNumber}</td>
                      <td className="p-3.5 font-bold text-white">{veh.vehicleType}</td>
                      <td className="p-3.5 font-medium text-slate-300">{veh.capacity}</td>
                      <td className="p-3.5 font-semibold text-slate-200">{veh.driverName || 'Unassigned'}</td>
                      <td className="p-3.5 font-medium text-slate-400">{veh.serviceArea}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                          veh.currentStatus === 'Available'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                        }`}>
                          {veh.currentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5-Category Fleet Trip Status Analytics Dashboard */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Fleet Trip Status & Lifecycle Categories (MongoDB Atlas Live Sync)</span>
            </h3>

            {/* Filter Cards Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-slate-800 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase">ALL TRIPS</p>
                <p className="text-xl font-extrabold text-white mt-1">{myOrders.length}</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('IN_TRANSIT')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'IN_TRANSIT'
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-900 border-slate-800 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Navigation className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold uppercase">IN TRANSIT</p>
                </div>
                <p className="text-xl font-extrabold text-cyan-300 mt-1">{inTransitTrips.length}</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PICKUP')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'PICKUP'
                    ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold uppercase">ON PICKUP</p>
                </div>
                <p className="text-xl font-extrabold text-amber-300 mt-1">{pickupTrips.length}</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ACCEPTED')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'ACCEPTED'
                    ? 'bg-blue-950/80 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    : 'bg-slate-900 border-slate-800 hover:border-blue-500/30'
                }`}
              >
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Check className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold uppercase">ACCEPTED</p>
                </div>
                <p className="text-xl font-extrabold text-blue-300 mt-1">{acceptedTrips.length}</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('COMPLETED')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'COMPLETED'
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-900 border-slate-800 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold uppercase">OLD DELIVERIES</p>
                </div>
                <p className="text-xl font-extrabold text-emerald-300 mt-1">{completedTrips.length}</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CANCELLED')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'CANCELLED'
                    ? 'bg-rose-950/80 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-900 border-slate-800 hover:border-rose-500/30'
                }`}
              >
                <div className="flex items-center gap-1.5 text-rose-400">
                  <XCircle className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold uppercase">CANCELLED</p>
                </div>
                <p className="text-xl font-extrabold text-rose-300 mt-1">{cancelledTrips.length}</p>
              </button>
            </div>

            {/* Filtered Trips Grid */}
            <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
              {filteredTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTrips.map(trip => {
                    const status = trip.transportRequestStatus || trip.status;
                    const isCompleted = ['COMPLETED', 'DELIVERED', 'Completed'].includes(status);
                    const isInTransit = ['IN_TRANSIT', 'In Transit', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_DESTINATION'].includes(status);
                    const isPickup = ['ARRIVED_AT_PICKUP', 'PICKUP_COMPLETED', 'On Pickup'].includes(status);
                    const isCancelled = ['CANCELLED', 'REJECTED', 'PARTNER_REJECTED'].includes(status);

                    return (
                      <div
                        key={trip.id}
                        className={`p-4 rounded-2xl border space-y-2 text-xs transition-all ${
                          isCompleted ? 'bg-emerald-950/30 border-emerald-500/30' :
                          isInTransit ? 'bg-cyan-950/30 border-cyan-500/30' :
                          isPickup ? 'bg-amber-950/30 border-amber-500/30' :
                          isCancelled ? 'bg-rose-950/30 border-rose-500/30' :
                          'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-cyan-400 text-sm">{trip.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            isCompleted ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                            isInTransit ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse' :
                            isPickup ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' :
                            isCancelled ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                            'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}>
                            {status}
                          </span>
                        </div>

                        <p className="font-extrabold text-white text-sm">{trip.productTitle}</p>

                        <div className="grid grid-cols-2 gap-2 py-1 text-[11px]">
                          <div>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase">Assigned Driver</p>
                            <p className="font-bold text-slate-200">{trip.driverName || 'Unassigned'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase">Vehicle Plate</p>
                            <p className="font-mono font-bold text-cyan-300">{trip.vehicleNumber || 'Unassigned'}</p>
                          </div>
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                          <p><span className="text-slate-500 font-bold">Pickup:</span> {trip.sellerAddress}</p>
                          <p><span className="text-slate-500 font-bold">Dropoff:</span> {trip.buyerAddress}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <Package className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="font-bold text-white text-sm">No Trips Found in Selected Category</p>
                  <p className="text-xs text-slate-500">Trip lifecycle status events will update here automatically as drivers proceed.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Add Vehicle */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm">Add New Lorry to Company Fleet</h3>
              <button onClick={() => setShowAddModal(false)} className="font-bold text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Vehicle Plate Number *</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Vehicle Model / Type *</label>
                <input
                  type="text"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Payload Capacity *</label>
                  <input
                    type="text"
                    name="capacity"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Service Zone</label>
                  <input
                    type="text"
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceArea: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-extrabold hover:from-cyan-300 hover:to-teal-300 cursor-pointer shadow-md"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerFleetPage;
