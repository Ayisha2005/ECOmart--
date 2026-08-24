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
    fleetVehicles,
    companyDrivers,
    orders,
    partnerAcceptOrder,
    partnerRejectOrder,
    assignDriverAndVehicleToOrder,
    appNotifications
  } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';

  // Company Data Isolation: Manager ONLY sees their own company data!
  const myVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === companyId);
  const myDrivers = (companyDrivers || []).filter(d => d.transportCompanyId === companyId);
  const myOrders = (orders || []).filter(o => o.transportCompanyId === companyId);

  // Incoming assignments from Admin needing partner acceptance
  const incomingAssignments = myOrders.filter(o => o.status === 'TRANSPORT_PARTNER_REQUESTED');
  
  // Accepted orders needing Driver & Vehicle assignment
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
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Transport Partner Control Dashboard" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Company Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/30">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-tight">{currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd'}</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Transport Manager: <span className="font-bold text-white">{currentUser?.name || 'Santhosh Kumar'}</span> | Company ID: <span className="font-mono text-cyan-300 font-bold">{companyId}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to="/transport/manager/fleet"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/30 cursor-pointer"
              >
                Manage Fleet Lorries
              </Link>
              <Link
                to="/transport/manager/drivers"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/30 cursor-pointer"
              >
                Manage Drivers
              </Link>
              <Link
                to="/transport/manager/live-tracking"
                className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4 text-slate-950" />
                <span>Live GPS Tracking &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Incoming ECO MART Assignments Card (Critical Workflow) */}
          {incomingAssignments.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Incoming ECO MART Transportation Assignments ({incomingAssignments.length})
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-200 text-amber-900 rounded-full">
                  Action Required
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingAssignments.map(ord => (
                  <div key={ord.id} className="bg-white p-4 rounded-xl border border-amber-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-cyan-700 text-sm">{ord.id}</span>
                      <span className="font-bold text-slate-900">₹{ord.totalPrice}</span>
                    </div>
                    <p className="font-bold text-slate-800">{ord.productTitle} ({ord.quantityKg} kg)</p>
                    <p className="text-slate-600">From: {ord.sellerAddress}</p>
                    <p className="text-slate-600">To: {ord.buyerAddress}</p>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => partnerRejectOrder(ord.id)}
                        className="w-1/2 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => partnerAcceptOrder(ord.id)}
                        className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
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
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Accepted Assignments - Select Driver & Vehicle ({pendingDispatchOrders.length})
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDispatchOrders.map(ord => (
                  <div key={ord.id} className="bg-white p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-cyan-700 text-sm">{ord.id}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Accepted</span>
                    </div>
                    <p className="font-bold text-slate-800">{ord.productTitle}</p>
                    <p className="text-slate-600">Pickup: {ord.sellerAddress}</p>
                    <p className="text-slate-600">Delivery: {ord.buyerAddress}</p>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrderForDispatch(ord);
                        setSelectedDriverId(myDrivers[0]?.driverId || '');
                        setSelectedVehicleNumber(myVehicles[0]?.vehicleNumber || '');
                      }}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Assign Driver & Lorry</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Company Lorries</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{myVehicles.length}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Available: {availableVehicles} | On Trip: {vehiclesOnTrip}</p>
              </div>
              <div className="p-3 bg-cyan-50 text-cyan-700 rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Company Drivers</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{myDrivers.length}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Active: {availableDrivers} | On Trip: {driversOnTrip}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Active Deliveries</p>
                <h3 className="text-2xl font-extrabold text-cyan-700 mt-1">{activeDeliveries}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">In Transit</p>
              </div>
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                <Navigation className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Completed Trips</p>
                <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{completedDeliveries}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Verified</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Live Fleet Map Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Company Live Fleet Map (OpenStreetMap)</h3>
                <p className="text-xs text-slate-500">Real-time GPS visibility for trucks owned by {currentUser?.companyName}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-cyan-50 text-cyan-800 rounded-full border border-cyan-200">
                {myVehicles.length} Lorries Monitored
              </span>
            </div>

            <MapView markers={mapMarkers} height="360px" />
          </div>
        </main>
      </div>

      {/* Dispatch Driver & Lorry Modal */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Assign Driver & Lorry for {selectedOrderForDispatch.id}</h3>
              <button onClick={() => setSelectedOrderForDispatch(null)} className="font-bold text-slate-400">✕</button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Driver *</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="">-- Select Driver --</option>
                  {myDrivers.map(d => (
                    <option key={d.id} value={d.driverId}>{d.name} ({d.driverId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Truck / Lorry *</label>
                <select
                  value={selectedVehicleNumber}
                  onChange={(e) => setSelectedVehicleNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
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

export default TransportManagerDashboard;
