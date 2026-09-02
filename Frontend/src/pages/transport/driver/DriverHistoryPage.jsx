import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import apiService from '../../../services/apiService';
import DriverSidebar from '../../../components/common/DriverSidebar';
import Navbar from '../../../components/common/Navbar';
import { CheckCircle2, Search, Filter, Info, X, FileText, Package } from 'lucide-react';

export const DriverHistoryPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useData();

  const authenticatedDriverId = currentUser?.driverId || currentUser?.transportId || currentUser?.id || 'DRV001';

  const [tripHistory, setTripHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await apiService.getDriverTripHistory(authenticatedDriverId, searchQuery, statusFilter).catch(() => null);
      let list = res?.trips;

      if (!list && orders) {
        list = orders.filter(o => {
          const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
            (o.vehicleNumber && currentUser?.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === currentUser.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
          const isPast = ['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
          return isMatch && isPast;
        });
      }
      setTripHistory(list || []);
    } catch (err) {
      console.error("Error loading driver trip history archive:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [authenticatedDriverId, searchQuery, statusFilter, orders]);

  const completedCount = tripHistory.filter(t => ['COMPLETED', 'DELIVERED', 'Completed'].includes(t.transportRequestStatus || t.status)).length;
  const totalPayload = tripHistory.reduce((acc, curr) => acc + Number(curr.quantityKg || 0), 0);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Driver Historical Trip & Delivery Archive" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-extrabold tracking-wide">My Historical Orders & Delivery Log</h2>
              </div>
              <p className="text-xs text-slate-300">
                Complete database archive of fulfilled scrap orders for driver ID {authenticatedDriverId}.
              </p>
            </div>

            <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 font-mono font-extrabold text-xs rounded-xl border border-emerald-500/30 shrink-0 relative z-10">
              {completedCount} Verified Deliveries
            </span>
          </div>

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">Lifetime Trips</p>
              <p className="text-2xl font-black text-white mt-1">{tripHistory.length}</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <p className="text-[10px] font-extrabold text-emerald-400 uppercase">Completed Trips</p>
              <p className="text-2xl font-black text-emerald-300 mt-1">{completedCount}</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <p className="text-[10px] font-extrabold text-amber-400 uppercase">Total Payload</p>
              <p className="text-2xl font-black text-amber-300 mt-1">{totalPayload.toLocaleString()} kg</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <p className="text-[10px] font-extrabold text-teal-400 uppercase">CO2 Impact</p>
              <p className="text-2xl font-black text-teal-300 mt-1">{Math.round(totalPayload * 1.5).toLocaleString()} kg</p>
            </div>
          </div>

          {/* Search & Filter Control Panel */}
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search Order ID, Seller, Buyer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-hidden font-medium"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium outline-hidden"
              >
                <option value="">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Trip History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">ORDER ID</th>
                    <th className="p-3.5">SELLER (PICKUP)</th>
                    <th className="p-3.5">BUYER (DESTINATION)</th>
                    <th className="p-3.5">MATERIAL & PAYLOAD</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {tripHistory.length > 0 ? (
                    tripHistory.map(trip => {
                      const status = trip.transportRequestStatus || trip.status;
                      const isCompleted = ['COMPLETED', 'DELIVERED', 'Completed'].includes(status);

                      return (
                        <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-mono font-extrabold text-cyan-400">{trip.id}</td>
                          <td className="p-3.5">
                            <p className="font-bold text-white">{trip.sellerName}</p>
                            <p className="text-[10px] text-slate-400">{trip.sellerAddress}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-white">{trip.buyerName}</p>
                            <p className="text-[10px] text-slate-400">{trip.buyerAddress}</p>
                          </td>
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
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderDetail(trip)}
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
                      <td colSpan="6" className="p-10 text-center text-slate-400 space-y-2">
                        <Package className="w-10 h-10 text-slate-600 mx-auto" />
                        <p className="font-bold text-white text-sm">No Trip History Records Found</p>
                        <p className="text-xs text-slate-500">Fulfilled scrap delivery orders for your driver ID will appear here.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-sm">Trip Record Details: {selectedOrderDetail.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 font-bold">STATUS</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-black rounded-full border border-emerald-500/30 uppercase text-[10px]">
                  {selectedOrderDetail.transportRequestStatus || selectedOrderDetail.status}
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL</p>
                <p className="font-bold text-white text-sm">{selectedOrderDetail.productTitle}</p>
                <p className="text-cyan-300 font-mono font-bold">Quantity: {selectedOrderDetail.quantityKg} kg • ₹{Number(selectedOrderDetail.totalPrice || 0).toLocaleString('en-IN')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">SELLER (PICKUP)</p>
                  <p className="font-bold text-white">{selectedOrderDetail.sellerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedOrderDetail.sellerAddress}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-cyan-400 font-bold uppercase">BUYER (DESTINATION)</p>
                  <p className="font-bold text-white">{selectedOrderDetail.buyerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedOrderDetail.buyerAddress}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
                <p><span className="text-slate-500 font-bold">Driver Name:</span> {selectedOrderDetail.driverName || currentUser?.name}</p>
                <p><span className="text-slate-500 font-bold">Vehicle Plate:</span> {selectedOrderDetail.vehicleNumber || currentUser?.assignedVehicleNumber || 'TN 01 AB 1234'}</p>
                <p><span className="text-slate-500 font-bold">Trip Date:</span> {selectedOrderDetail.pickupDate || selectedOrderDetail.createdAt || 'N/A'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderDetail(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverHistoryPage;
