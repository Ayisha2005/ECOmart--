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
  X,
  Search,
  Filter,
  Users,
  Info,
  FileText,
  Calendar,
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const ManagerFleetPage = () => {
  const { currentUser } = useAuth();
  const { fleetVehicles = [], companyDrivers = [], orders = [], addFleetVehicle } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const companyNameClean = (currentUser?.companyName || 'greenroute').toLowerCase();

  // Fleet Filtered Database Records
  const myVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === companyId || !v.transportCompanyId);
  const myDrivers = (companyDrivers || []).filter(d => d.transportCompanyId === companyId || !d.transportCompanyId);
  const myOrders = (orders || []).filter(o =>
    o.transportCompanyId === companyId ||
    (o.transportCompanyName && o.transportCompanyName.toLowerCase().includes(companyNameClean))
  );

  // 1. Top Fleet Cards Metrics (Database Driven)
  const totalDriversCount = myDrivers.length;
  const activeDriversCount = myDrivers.filter(d => d.status !== 'Available').length;
  const totalVehiclesCount = myVehicles.length;

  const activeTripsList = myOrders.filter(o => !['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status));
  const pendingPickupsList = myOrders.filter(o => ['TRANSPORT_REQUEST_SENT', 'PARTNER_ACCEPTED'].includes(o.transportRequestStatus || o.status));
  const completedTripsList = myOrders.filter(o => ['COMPLETED', 'DELIVERED', 'Completed'].includes(o.transportRequestStatus || o.status));

  // 2. Current Active Trip (Strictly Non-Completed)
  const currentActiveTrip = activeTripsList.length > 0 ? activeTripsList[0] : null;

  // 3. Search & Filter State for Trip History Inside Fleet Dashboard
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('');
  const [historyDriverFilter, setHistoryDriverFilter] = useState('');
  const [historyVehicleFilter, setHistoryVehicleFilter] = useState('');

  // Modals State
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);

  // New Vehicle Form State
  const [vehicleFormData, setVehicleFormData] = useState({
    vehicleNumber: 'TN 01 EV 8899',
    vehicleType: 'Tata Ace EV (Electric Lorry)',
    capacity: '1.5 Tons',
    serviceArea: 'Chennai Industrial Belt',
    driverId: ''
  });

  // Filtered Historical Trips for Trip History Table
  let historicalTrips = myOrders.filter(o =>
    ['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status)
  );

  if (historySearchQuery) {
    const q = historySearchQuery.toLowerCase();
    historicalTrips = historicalTrips.filter(t =>
      (t.id || '').toLowerCase().includes(q) ||
      (t.driverName || '').toLowerCase().includes(q) ||
      (t.sellerName || '').toLowerCase().includes(q) ||
      (t.buyerName || '').toLowerCase().includes(q) ||
      (t.productTitle || '').toLowerCase().includes(q)
    );
  }

  if (historyStatusFilter) {
    historicalTrips = historicalTrips.filter(t => (t.transportRequestStatus || t.status) === historyStatusFilter);
  }

  if (historyDriverFilter) {
    historicalTrips = historicalTrips.filter(t => t.driverId === historyDriverFilter || t.driverName?.toLowerCase().includes(historyDriverFilter.toLowerCase()));
  }

  if (historyVehicleFilter) {
    historicalTrips = historicalTrips.filter(t => t.vehicleNumber === historyVehicleFilter);
  }

  const handleAddVehicleSubmit = (e) => {
    e.preventDefault();
    const assignedDriver = myDrivers.find(d => d.driverId === vehicleFormData.driverId);

    addFleetVehicle({
      ...vehicleFormData,
      driverName: assignedDriver ? assignedDriver.name : "Unassigned",
      driverPhone: assignedDriver ? assignedDriver.phone : ""
    }, currentUser);

    setShowAddVehicleModal(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Fleet Management Dashboard & Trip Center" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <Truck className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-wide">FLEET MANAGEMENT DASHBOARD</h2>
              </div>
              <p className="text-xs text-slate-300">
                Live vehicle tracking, driver assignments, current active pickup routes, and trip history for {currentUser?.companyName || 'GreenRoute Logistics'}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-950/50 cursor-pointer flex items-center gap-1.5 relative z-10 transition-transform active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Add Vehicle to Fleet</span>
            </button>
          </div>

          {/* 1. FLEET DASHBOARD CARDS (Top Overview Stats) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">TOTAL DRIVERS</p>
              <h3 className="text-2xl font-black text-white mt-1">{totalDriversCount}</h3>
              <p className="text-[10px] text-blue-400 font-semibold mt-0.5">Fleet Personnel</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-amber-400 uppercase">ACTIVE DRIVERS</p>
              <h3 className="text-2xl font-black text-amber-300 mt-1">{activeDriversCount}</h3>
              <p className="text-[10px] text-amber-500 font-semibold mt-0.5">On Duty / In Transit</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">TOTAL VEHICLES</p>
              <h3 className="text-2xl font-black text-white mt-1">{totalVehiclesCount}</h3>
              <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">Registered Trucks</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-cyan-400 uppercase">ACTIVE TRIPS</p>
              <h3 className="text-2xl font-black text-cyan-300 mt-1">{activeTripsList.length}</h3>
              <p className="text-[10px] text-cyan-500 font-semibold mt-0.5">In Progress</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-amber-400 uppercase">PENDING PICKUPS</p>
              <h3 className="text-2xl font-black text-amber-300 mt-1">{pendingPickupsList.length}</h3>
              <p className="text-[10px] text-amber-500 font-semibold mt-0.5">Awaiting Dispatch</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-emerald-400 uppercase">COMPLETED TRIPS</p>
              <h3 className="text-2xl font-black text-emerald-300 mt-1">{completedTripsList.length}</h3>
              <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Fulfilled History</p>
            </div>
          </div>

          {/* 2. CURRENT ACTIVE TRIP SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-cyan-400" />
                <span>CURRENT ACTIVE TRIP</span>
              </h3>
              {currentActiveTrip && (
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs rounded-full border border-cyan-500/40 animate-pulse">
                  {currentActiveTrip.transportRequestStatus || currentActiveTrip.status}
                </span>
              )}
            </div>

            {currentActiveTrip ? (
              <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-cyan-500/40 shadow-2xl space-y-4 backdrop-blur-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">ORDER ID</span>
                    <h4 className="font-mono font-black text-cyan-400 text-xl tracking-wide">{currentActiveTrip.id}</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL</span>
                    <p className="font-black text-white text-base">{currentActiveTrip.productTitle} ({currentActiveTrip.quantityKg} kg)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">ASSIGNED DRIVER</p>
                    <p className="font-bold text-white text-sm">{currentActiveTrip.driverName || 'Ramesh Kumar'}</p>
                    <p className="text-cyan-400 font-mono text-[11px] font-bold">ID: {currentActiveTrip.driverId || 'DRV001'}</p>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">ASSIGNED VEHICLE</p>
                    <p className="font-mono font-bold text-cyan-300 text-sm">{currentActiveTrip.vehicleNumber || 'TN 01 AB 1234'}</p>
                    <p className="text-slate-400 text-[11px]">Commercial Lorry</p>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">PICKUP (SELLER)</p>
                    <p className="font-bold text-white">{currentActiveTrip.sellerName}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentActiveTrip.sellerAddress}</p>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase">DESTINATION (BUYER)</p>
                    <p className="font-bold text-white">{currentActiveTrip.buyerName}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentActiveTrip.buyerAddress}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* NO ACTIVE TRIP EMPTY STATE */
              <div className="bg-slate-900/90 rounded-3xl p-8 text-center text-slate-400 border border-slate-800 shadow-2xl space-y-2 backdrop-blur-xl">
                <Truck className="w-10 h-10 text-cyan-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">NO ACTIVE TRIP</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You currently have no pickup assigned in progress. Previous completed trips are stored in Trip History below.
                </p>
              </div>
            )}
          </div>

          {/* 3. FLEET VEHICLES MANAGEMENT TABLE */}
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-sm">COMPANY FLEET VEHICLES ({myVehicles.length})</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">VEHICLE PLATE</th>
                    <th className="p-3.5">VEHICLE TYPE</th>
                    <th className="p-3.5">ASSIGNED DRIVER</th>
                    <th className="p-3.5">DRIVER ID</th>
                    <th className="p-3.5">CAPACITY</th>
                    <th className="p-3.5">CURRENT STATUS</th>
                    <th className="p-3.5">ACTIVE TRIP ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {myVehicles.map(veh => {
                    const isAvailable = veh.currentStatus === 'Available';
                    return (
                      <tr key={veh.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 font-mono font-extrabold text-cyan-400">{veh.vehicleNumber}</td>
                        <td className="p-3.5 font-semibold text-slate-200">{veh.vehicleType}</td>
                        <td className="p-3.5 font-bold text-white">{veh.driverName || 'Unassigned'}</td>
                        <td className="p-3.5 font-mono text-cyan-300">{veh.driverId || 'N/A'}</td>
                        <td className="p-3.5 font-mono text-slate-300">{veh.capacity || '1.5 Tons'}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                          }`}>
                            {veh.currentStatus || 'Available'}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-amber-300">{veh.assignedOrderId || 'None'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. DEDICATED TRIP HISTORY SECTION INSIDE FLEET DASHBOARD */}
          <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-sm">
                  FLEET TRIP HISTORY ARCHIVE ({historicalTrips.length})
                </h3>
              </div>

              {/* Multi-Filter Bar */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Order, Driver, Seller..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <select
                  value={historyStatusFilter}
                  onChange={(e) => setHistoryStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium outline-hidden"
                >
                  <option value="">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={historyDriverFilter}
                  onChange={(e) => setHistoryDriverFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium outline-hidden"
                >
                  <option value="">All Drivers</option>
                  {myDrivers.map(d => (
                    <option key={d.id} value={d.driverId}>{d.name} ({d.driverId})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trip History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">ORDER ID</th>
                    <th className="p-3.5">DRIVER</th>
                    <th className="p-3.5">VEHICLE</th>
                    <th className="p-3.5">SELLER</th>
                    <th className="p-3.5">BUYER</th>
                    <th className="p-3.5">MATERIAL & QUANTITY</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5">DATE</th>
                    <th className="p-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {historicalTrips.length > 0 ? (
                    historicalTrips.map(trip => {
                      const status = trip.transportRequestStatus || trip.status;
                      const isCompleted = ['COMPLETED', 'DELIVERED', 'Completed'].includes(status);

                      return (
                        <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-mono font-extrabold text-cyan-400">{trip.id}</td>
                          <td className="p-3.5 font-bold text-white">{trip.driverName || 'Ramesh Kumar'}</td>
                          <td className="p-3.5 font-mono font-bold text-slate-300">{trip.vehicleNumber || 'TN 01 AB 1234'}</td>
                          <td className="p-3.5 font-medium text-slate-200">{trip.sellerName}</td>
                          <td className="p-3.5 font-medium text-slate-200">{trip.buyerName}</td>
                          <td className="p-3.5 font-bold text-slate-200">
                            {trip.productTitle} ({trip.quantityKg} kg)
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-400">{trip.pickupDate || trip.createdAt || 'Recent'}</td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedTripDetails(trip)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-extrabold text-[11px] rounded-lg border border-slate-700 cursor-pointer inline-flex items-center gap-1"
                            >
                              <Info className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View Details</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-400 space-y-1">
                        <Package className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="font-bold text-white text-xs">No Historical Trips Found</p>
                        <p className="text-[11px] text-slate-500">Completed and fulfilled scrap orders will appear in this history archive.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal 1: Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm">Add New Lorry / Vehicle to Fleet</h3>
              <button onClick={() => setShowAddVehicleModal(false)} className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Vehicle Registration Plate *</label>
                <input
                  type="text"
                  value={vehicleFormData.vehicleNumber}
                  onChange={(e) => setVehicleFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Vehicle Type / Model *</label>
                <input
                  type="text"
                  value={vehicleFormData.vehicleType}
                  onChange={(e) => setVehicleFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Payload Capacity</label>
                  <input
                    type="text"
                    value={vehicleFormData.capacity}
                    onChange={(e) => setVehicleFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Assign Driver</label>
                  <select
                    value={vehicleFormData.driverId}
                    onChange={(e) => setVehicleFormData(prev => ({ ...prev, driverId: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 outline-hidden font-medium"
                  >
                    <option value="">-- Unassigned --</option>
                    {myDrivers.map(d => (
                      <option key={d.id} value={d.driverId}>{d.name} ({d.driverId})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-extrabold hover:from-cyan-300 hover:to-teal-300 cursor-pointer shadow-md"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Trip Details Modal */}
      {selectedTripDetails && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-sm">Order & Trip Details: {selectedTripDetails.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTripDetails(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 font-bold">TRIP STATUS</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-black rounded-full border border-emerald-500/30 uppercase text-[10px]">
                  {selectedTripDetails.transportRequestStatus || selectedTripDetails.status}
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL</p>
                <p className="font-bold text-white text-sm">{selectedTripDetails.productTitle}</p>
                <p className="text-cyan-300 font-mono font-bold">Quantity: {selectedTripDetails.quantityKg} kg • ₹{Number(selectedTripDetails.totalPrice || 0).toLocaleString('en-IN')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">SELLER (PICKUP)</p>
                  <p className="font-bold text-white">{selectedTripDetails.sellerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedTripDetails.sellerAddress}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-cyan-400 font-bold uppercase">BUYER (DESTINATION)</p>
                  <p className="font-bold text-white">{selectedTripDetails.buyerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedTripDetails.buyerAddress}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
                <p><span className="text-slate-500 font-bold">Executed Driver:</span> {selectedTripDetails.driverName || 'Ramesh Kumar'}</p>
                <p><span className="text-slate-500 font-bold">Vehicle Plate:</span> {selectedTripDetails.vehicleNumber || 'TN 01 AB 1234'}</p>
                <p><span className="text-slate-500 font-bold">Pickup / Date:</span> {selectedTripDetails.pickupDate || selectedTripDetails.createdAt || 'N/A'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTripDetails(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerFleetPage;
