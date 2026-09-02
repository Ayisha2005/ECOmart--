import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Search,
  Filter,
  Users,
  Info,
  X,
  FileText,
  Calendar,
  XCircle,
  Navigation,
  Check,
  Building2,
  Package
} from 'lucide-react';

export const ManagerTripsHistoryPage = () => {
  const { currentUser } = useAuth();
  const { orders = [], companyDrivers = [], fleetVehicles = [] } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const companyNameClean = (currentUser?.companyName || 'greenroute').toLowerCase();

  // Transport Partner Filtered Orders
  const myOrders = (orders || []).filter(o =>
    o.transportCompanyId === companyId ||
    (o.transportCompanyName && o.transportCompanyName.toLowerCase().includes(companyNameClean))
  );

  const myDrivers = (companyDrivers || []).filter(d => d.transportCompanyId === companyId || !d.transportCompanyId);
  const myVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === companyId || !v.transportCompanyId);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');

  // Modals State
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);
  const [selectedDriverHistory, setSelectedDriverHistory] = useState(null);

  // Categorize Trips for Metrics Header (Requirements 10)
  const completedTrips = myOrders.filter(o => ['COMPLETED', 'DELIVERED', 'Completed', 'Delivered'].includes(o.transportRequestStatus || o.status));
  const cancelledTrips = myOrders.filter(o => ['CANCELLED', 'REJECTED', 'PARTNER_REJECTED'].includes(o.transportRequestStatus || o.status));
  const inProgressTrips = myOrders.filter(o => ['IN_TRANSIT', 'In Transit', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'PICKUP_COMPLETED', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED'].includes(o.transportRequestStatus || o.status));
  const totalPayloadKg = completedTrips.reduce((acc, curr) => acc + Number(curr.quantityKg || 0), 0);

  // Filtered History Table Data
  let filteredTrips = myOrders.filter(t => {
    const isCompletedOrPast = ['COMPLETED', 'DELIVERED', 'Completed', 'Delivered', 'CANCELLED', 'REJECTED'].includes(t.transportRequestStatus || t.status);
    return isCompletedOrPast;
  });

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredTrips = filteredTrips.filter(t =>
      (t.id || '').toLowerCase().includes(q) ||
      (t.driverName || '').toLowerCase().includes(q) ||
      (t.sellerName || '').toLowerCase().includes(q) ||
      (t.buyerName || '').toLowerCase().includes(q) ||
      (t.productTitle || '').toLowerCase().includes(q)
    );
  }

  if (selectedStatus) {
    filteredTrips = filteredTrips.filter(t => (t.transportRequestStatus || t.status) === selectedStatus);
  }

  if (selectedDriverId) {
    filteredTrips = filteredTrips.filter(t => t.driverId === selectedDriverId || t.driverName?.toLowerCase().includes(selectedDriverId.toLowerCase()));
  }

  if (selectedVehicle) {
    filteredTrips = filteredTrips.filter(t => t.vehicleNumber === selectedVehicle);
  }

  // Driver Drill-Down History Modal Handler
  const openDriverHistoryModal = (driver) => {
    const driverTrips = myOrders.filter(o => o.driverId === driver.driverId || o.driverId === driver.id || o.driverName === driver.name);
    setSelectedDriverHistory({
      driver,
      trips: driverTrips,
      completedCount: driverTrips.filter(o => ['COMPLETED', 'DELIVERED', 'Completed'].includes(o.transportRequestStatus || o.status)).length,
      activeCount: driverTrips.filter(o => !['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED'].includes(o.transportRequestStatus || o.status)).length,
      cancelledCount: driverTrips.filter(o => ['CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status)).length
    });
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Transport Partner Historical Trip Archive" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-wide">Historical Trip Archive & Audit Logs</h2>
              </div>
              <p className="text-xs text-slate-300">
                Complete database record of fulfilled scrap deliveries, driver performance, and vehicle logs for {currentUser?.companyName || 'GreenRoute Logistics'}.
              </p>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 font-mono font-extrabold text-xs rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                {completedTrips.length} Fulfilled Orders
              </span>
            </div>
          </div>

          {/* Trip History Dashboard Metrics Cards (Requirement 10) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">TOTAL TRIPS</p>
              <h3 className="text-2xl font-black text-white mt-1">{myOrders.length}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Company Fleet Lifetime</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-emerald-400 uppercase">COMPLETED TRIPS</p>
              <h3 className="text-2xl font-black text-emerald-300 mt-1">{completedTrips.length}</h3>
              <p className="text-[10px] text-emerald-500 mt-1">Verified Delivered</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-cyan-400 uppercase">IN PROGRESS</p>
              <h3 className="text-2xl font-black text-cyan-300 mt-1">{inProgressTrips.length}</h3>
              <p className="text-[10px] text-cyan-500 mt-1">Active Deliveries</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-rose-400 uppercase">CANCELLED TRIPS</p>
              <h3 className="text-2xl font-black text-rose-300 mt-1">{cancelledTrips.length}</h3>
              <p className="text-[10px] text-rose-500 mt-1">Rejected / Cancelled</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-extrabold text-amber-400 uppercase">TOTAL PAYLOAD</p>
              <h3 className="text-2xl font-black text-amber-300 mt-1">{totalPayloadKg.toLocaleString()} kg</h3>
              <p className="text-[10px] text-amber-500 mt-1">Scrap Delivered</p>
            </div>
          </div>

          {/* Search & Multi-Filter Control Panel (Requirement 20) */}
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search Order ID, Driver, Seller, Buyer..."
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
                  <option value="">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium outline-hidden"
                >
                  <option value="">All Drivers</option>
                  {myDrivers.map(d => (
                    <option key={d.id} value={d.driverId}>{d.name} ({d.driverId})</option>
                  ))}
                </select>

                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono outline-hidden"
                >
                  <option value="">All Vehicles</option>
                  {myVehicles.map(v => (
                    <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trip History Table (Requirement 11) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">ORDER ID</th>
                    <th className="p-3.5">DRIVER</th>
                    <th className="p-3.5">VEHICLE</th>
                    <th className="p-3.5">SELLER & PICKUP</th>
                    <th className="p-3.5">BUYER & DESTINATION</th>
                    <th className="p-3.5">MATERIAL & PAYLOAD</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5">TRIP DATE</th>
                    <th className="p-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredTrips.length > 0 ? (
                    filteredTrips.map(trip => {
                      const status = trip.transportRequestStatus || trip.status;
                      const isCompleted = ['COMPLETED', 'DELIVERED', 'Completed'].includes(status);
                      const isCancelled = ['CANCELLED', 'REJECTED', 'PARTNER_REJECTED'].includes(status);

                      const assignedDriverObj = myDrivers.find(d => d.driverId === trip.driverId || d.name === trip.driverName);

                      return (
                        <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-mono font-extrabold text-cyan-400">{trip.id}</td>
                          <td className="p-3.5">
                            <p
                              onClick={() => assignedDriverObj && openDriverHistoryModal(assignedDriverObj)}
                              className="font-bold text-white hover:text-cyan-300 cursor-pointer underline decoration-dashed underline-offset-2"
                            >
                              {trip.driverName || 'Assigned Driver'}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">{trip.driverId || 'DRV'}</p>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-300">{trip.vehicleNumber || 'Unassigned'}</td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-200">{trip.sellerName}</p>
                            <p className="text-[10px] text-slate-400">{trip.sellerAddress}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-200">{trip.buyerName}</p>
                            <p className="text-[10px] text-slate-400">{trip.buyerAddress}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-200">{trip.productTitle}</p>
                            <p className="text-[10px] text-cyan-300 font-mono font-bold">{trip.quantityKg} kg</p>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : isCancelled
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
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
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="p-10 text-center text-slate-400 space-y-2">
                        <Package className="w-10 h-10 text-slate-600 mx-auto" />
                        <p className="font-bold text-white text-sm">No Trip History Available</p>
                        <p className="text-xs text-slate-500">Historical delivery records for your company drivers will appear here.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal 1: Trip Details Modal with Lifecycle Timeline (Requirement 21 & 22) */}
      {selectedTripDetails && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-sm">Trip Details: {selectedTripDetails.id}</h3>
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
                <span className="text-slate-400 font-bold">STATUS</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-black rounded-full border border-emerald-500/30 uppercase text-[10px]">
                  {selectedTripDetails.transportRequestStatus || selectedTripDetails.status}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">STATUS LIFECYCLE TIMELINE</p>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <p className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Order Created: {selectedTripDetails.createdAt || '02 Sep 2026'}</span>
                  </p>
                  <p className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Driver Assigned: {selectedTripDetails.driverName || 'Assigned Driver'}</span>
                  </p>
                  <p className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Vehicle Plate: {selectedTripDetails.vehicleNumber || 'Commercial Lorry'}</span>
                  </p>
                  <p className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Trip Fulfilled: {selectedTripDetails.pickupDate || 'Completed'}</span>
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL</p>
                <p className="font-bold text-white text-sm">{selectedTripDetails.productTitle}</p>
                <p className="text-cyan-300 font-mono font-bold">Payload: {selectedTripDetails.quantityKg} kg • Total Value: ₹{Number(selectedTripDetails.totalPrice || 0).toLocaleString('en-IN')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">SELLER (PICKUP)</p>
                  <p className="font-bold text-white">{selectedTripDetails.sellerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedTripDetails.sellerAddress}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">BUYER (DESTINATION)</p>
                  <p className="font-bold text-white">{selectedTripDetails.buyerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedTripDetails.buyerAddress}</p>
                </div>
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

      {/* Modal 2: Driver-Specific Trip History Modal (Requirement 12) */}
      {selectedDriverHistory && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full text-white shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">{selectedDriverHistory.driver.name} - Driver History</h3>
                  <p className="text-xs text-slate-400 font-mono">Driver ID: {selectedDriverHistory.driver.driverId} • Truck: {selectedDriverHistory.driver.assignedVehicleNumber || 'N/A'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDriverHistory(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Driver Stats */}
            <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">TOTAL TRIPS</p>
                <p className="font-black text-white text-lg mt-0.5">{selectedDriverHistory.trips.length}</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-emerald-400 font-bold uppercase">COMPLETED</p>
                <p className="font-black text-emerald-300 text-lg mt-0.5">{selectedDriverHistory.completedCount}</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-cyan-400 font-bold uppercase">ACTIVE</p>
                <p className="font-black text-cyan-300 text-lg mt-0.5">{selectedDriverHistory.activeCount}</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-rose-400 font-bold uppercase">CANCELLED</p>
                <p className="font-black text-rose-300 text-lg mt-0.5">{selectedDriverHistory.cancelledCount}</p>
              </div>
            </div>

            {/* Driver Trips Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Seller</th>
                    <th className="p-3">Buyer</th>
                    <th className="p-3">Material</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {selectedDriverHistory.trips.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-cyan-400">{t.id}</td>
                      <td className="p-3 font-medium text-slate-200">{t.sellerName}</td>
                      <td className="p-3 font-medium text-slate-200">{t.buyerName}</td>
                      <td className="p-3 font-medium text-slate-300">{t.productTitle} ({t.quantityKg} kg)</td>
                      <td className="p-3 font-bold text-emerald-400">{t.transportRequestStatus || t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDriverHistory(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Close Driver History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTripsHistoryPage;
