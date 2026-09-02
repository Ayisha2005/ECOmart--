import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import MapView from '../../../components/common/MapView';
import { Link } from 'react-router-dom';
import {
  Truck,
  Users,
  Package,
  Clock,
  CheckCircle2,
  Navigation,
  Building2,
  PlusCircle,
  AlertCircle,
  Check,
  X,
  Send
} from 'lucide-react';

export const TransportManagerDashboard = () => {
  const { currentUser } = useAuth();
  const {
    fleetVehicles = [],
    companyDrivers = [],
    orders = [],
    partnerAcceptOrder,
    partnerRejectOrder,
    assignDriverAndVehicleToOrder
  } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';

  const myVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === companyId);
  const myDrivers = (companyDrivers || []).filter(d => d.transportCompanyId === companyId);
  const myOrders = (orders || []).filter(o => o.transportCompanyId === companyId);

  const incomingAssignments = myOrders.filter(o => o.status === 'TRANSPORT_PARTNER_REQUESTED');
  const pendingDispatchOrders = myOrders.filter(o => o.status === 'PARTNER_ACCEPTED');

  const availableVehicles = myVehicles.filter(v => v.currentStatus === 'Available').length;
  const vehiclesOnTrip = myVehicles.filter(v => v.currentStatus !== 'Available').length;
  const availableDrivers = myDrivers.filter(d => d.status === 'Available').length;
  const driversOnTrip = myDrivers.filter(d => d.status !== 'Available').length;
  const activeDeliveries = myOrders.filter(o => ['In Transit', 'IN_TRANSIT', 'Picked Up', 'DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE'].includes(o.status)).length;
  const completedDeliveries = myOrders.filter(o => ['Delivered', 'DELIVERED', 'Completed', 'COMPLETED'].includes(o.status)).length;

  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState('');

  const mapMarkers = myVehicles.map(v => ({
    id: v.id,
    lat: v.lat || 13.0827,
    lng: v.lng || 80.2707,
    title: `🚚 ${v.vehicleNumber}`,
    location: `Driver: ${v.driverName || 'Unassigned'} | Status: ${v.currentStatus}`,
    type: 'transport',
    typeLabel: v.vehicleType
  }));

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderForDispatch || !selectedDriverId || !selectedVehicleNumber) return;

    assignDriverAndVehicleToOrder(selectedOrderForDispatch.id, selectedDriverId, selectedVehicleNumber);
    setSelectedOrderForDispatch(null);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Transport Partner Control Dashboard" />

        {/* Scrollable Main Container */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Company Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950/50 to-slate-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-tight">{currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd'}</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Transport Manager: <span className="font-bold text-white">{currentUser?.name || 'Santhosh Kumar'}</span> | Company ID: <span className="font-mono text-cyan-400 font-bold">{companyId}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10">
              <Link
                to="/transport/manager/fleet"
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/30 cursor-pointer"
              >
                Manage Fleet Lorries
              </Link>
              <Link
                to="/transport/manager/drivers"
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/30 cursor-pointer"
              >
                Manage Drivers
              </Link>
              <Link
                to="/transport/manager/live-tracking"
                className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4 text-slate-950" />
                <span>Live GPS Tracking &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Incoming ECO MART Assignments Card */}
          {incomingAssignments.length > 0 && (
            <div className="bg-amber-950/40 rounded-2xl p-5 border border-amber-500/40 shadow-xl space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-white text-sm">
                    Incoming ECO MART Transportation Assignments ({incomingAssignments.length})
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                  Action Required
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingAssignments.map(ord => (
                  <div key={ord.id} className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-cyan-400 text-sm">{ord.id}</span>
                      <span className="font-bold text-amber-400">₹{ord.totalPrice}</span>
                    </div>
                    <p className="font-bold text-white">{ord.productTitle} ({ord.quantityKg} kg)</p>
                    <p className="text-slate-400">From: {ord.sellerAddress}</p>
                    <p className="text-slate-400">To: {ord.buyerAddress}</p>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => partnerRejectOrder(ord.id)}
                        className="w-1/2 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => partnerAcceptOrder(ord.id)}
                        className="w-1/2 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1 shadow-md"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Assignment</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Dispatch Orders */}
          {pendingDispatchOrders.length > 0 && (
            <div className="bg-emerald-950/40 rounded-2xl p-5 border border-emerald-500/40 shadow-xl space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-white text-sm">
                    Accepted Assignments - Select Driver & Vehicle ({pendingDispatchOrders.length})
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDispatchOrders.map(ord => (
                  <div key={ord.id} className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-cyan-400 text-sm">{ord.id}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30 font-bold">Accepted</span>
                    </div>
                    <p className="font-bold text-white">{ord.productTitle}</p>
                    <p className="text-slate-400">Pickup: {ord.sellerAddress}</p>
                    <p className="text-slate-400">Delivery: {ord.buyerAddress}</p>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrderForDispatch(ord);
                        setSelectedDriverId(myDrivers[0]?.driverId || '');
                        setSelectedVehicleNumber(myVehicles[0]?.vehicleNumber || '');
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-slate-950 font-extrabold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-950" />
                      <span>Assign Driver & Lorry</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8-Card Dynamic Database Metrics Grid (Requirement 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase">TOTAL DRIVERS</p>
                <h3 className="text-xl font-black text-white mt-1">{myDrivers.length}</h3>
                <p className="text-[10px] text-blue-400 font-semibold mt-0.5">Company Staff</p>
              </div>
              <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-extrabold text-amber-400 uppercase">ACTIVE DRIVERS</p>
                <h3 className="text-xl font-black text-amber-300 mt-1">{driversOnTrip}</h3>
                <p className="text-[10px] text-amber-500 font-semibold mt-0.5">On Duty / In Transit</p>
              </div>
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase">TOTAL VEHICLES</p>
                <h3 className="text-xl font-black text-white mt-1">{myVehicles.length}</h3>
                <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">Fleet Trucks</p>
              </div>
              <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                <Truck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-extrabold text-emerald-400 uppercase">AVAILABLE VEHICLES</p>
                <h3 className="text-xl font-black text-emerald-300 mt-1">{availableVehicles}</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Ready for Dispatch</p>
              </div>
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-extrabold text-cyan-400 uppercase">ACTIVE TRIPS</p>
                <h3 className="text-xl font-black text-cyan-300 mt-1">{activeDeliveries}</h3>
                <p className="text-[10px] text-cyan-500 font-semibold mt-0.5">Live Delivery Routes</p>
              </div>
              <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                <Navigation className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-extrabold text-amber-400 uppercase">PENDING PICKUPS</p>
                <h3 className="text-xl font-black text-amber-300 mt-1">{incomingAssignments.length + pendingDispatchOrders.length}</h3>
                <p className="text-[10px] text-amber-500 font-semibold mt-0.5">Awaiting Dispatch</p>
              </div>
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-extrabold text-emerald-400 uppercase">COMPLETED TRIPS</p>
                <h3 className="text-xl font-black text-emerald-300 mt-1">{completedDeliveries}</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Verified History</p>
              </div>
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-extrabold text-teal-400 uppercase">PENDING DELIVERIES</p>
                <h3 className="text-xl font-black text-teal-300 mt-1">{activeDeliveries}</h3>
                <p className="text-[10px] text-teal-500 font-semibold mt-0.5">In Transit to Buyer</p>
              </div>
              <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
                <Package className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Live Fleet Map Section */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">Company Live Fleet Map (OpenStreetMap)</h3>
                <p className="text-xs text-slate-400">Real-time GPS visibility for trucks owned by {currentUser?.companyName}</p>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                {myVehicles.length} Lorries Monitored
              </span>
            </div>

            <MapView markers={mapMarkers} height="360px" />
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
                  <option value="" className="bg-slate-900">-- Select Driver --</option>
                  {myDrivers.map(d => (
                    <option key={d.id} value={d.driverId} className="bg-slate-900">{d.name} ({d.driverId})</option>
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
                  <option value="" className="bg-slate-900">-- Select Vehicle --</option>
                  {myVehicles.map(v => (
                    <option key={v.id} value={v.vehicleNumber} className="bg-slate-900">{v.vehicleNumber} ({v.vehicleType})</option>
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

export default TransportManagerDashboard;
