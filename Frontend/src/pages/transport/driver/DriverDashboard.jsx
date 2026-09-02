import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import apiService from '../../../services/apiService';
import DriverSidebar from '../../../components/common/DriverSidebar';
import Navbar from '../../../components/common/Navbar';
import MapView from '../../../components/common/MapView';
import {
  Truck,
  CheckCircle2,
  Clock,
  Navigation,
  User,
  ShieldCheck,
  Building2,
  Star,
  MapPin,
  ArrowRight,
  Check,
  Search,
  Filter,
  Info,
  Package,
  FileText,
  Sparkles,
  AlertCircle,
  Award
} from 'lucide-react';

export const DriverDashboard = () => {
  const { currentUser } = useAuth();
  const { orders, driverAcceptTrip, driverUpdateTripStatus } = useData();
  const navigate = useNavigate();

  // Authenticated Driver Identity
  const authenticatedDriverId = currentUser?.driverId || currentUser?.transportId || currentUser?.id || 'DRV001';

  const [driverProfile, setDriverProfile] = useState(null);
  const [currentAssignedOrder, setCurrentAssignedOrder] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // Fetch Dashboard Data from Backend/DB
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Driver Profile
      const profileRes = await apiService.getDriverProfile(authenticatedDriverId).catch(() => null);
      const fetchedDriver = profileRes?.driver || {
        driverId: authenticatedDriverId,
        name: currentUser?.name || 'Driver',
        phone: currentUser?.phone || '+91 98401 00000',
        licenseNumber: currentUser?.licenseNumber || 'TN-01-2026-LICENSED',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        assignedVehicleNumber: currentUser?.assignedVehicleNumber || null,
        vehicleType: currentUser?.vehicleType || 'Commercial Lorry Truck',
        companyName: currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd',
        rating: currentUser?.rating || 4.9,
        tripsCompleted: currentUser?.tripsCompleted || 0
      };
      setDriverProfile(fetchedDriver);

      // 2. Fetch Single Current Active Assignment (Strictly Non-Completed)
      const currentTripRes = await apiService.getDriverCurrentTrip(authenticatedDriverId).catch(() => null);
      let activeTrip = currentTripRes?.activeTrip;

      if (!activeTrip && orders) {
        const matchingActiveOrders = orders.filter(o => {
          const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
            (o.vehicleNumber && fetchedDriver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === fetchedDriver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
          const isNotCompleted = !['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
          return isMatch && isNotCompleted;
        });
        activeTrip = matchingActiveOrders.length > 0 ? matchingActiveOrders[matchingActiveOrders.length - 1] : null;
      }
      setCurrentAssignedOrder(activeTrip || null);

      // 3. Fetch Recent Trip History
      const historyRes = await apiService.getDriverTripHistory(authenticatedDriverId).catch(() => null);
      let historyList = historyRes?.trips;

      if (!historyList && orders) {
        historyList = orders.filter(o => {
          const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
            (o.vehicleNumber && fetchedDriver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === fetchedDriver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
          const isPast = ['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
          return isMatch && isPast;
        });
      }
      setRecentHistory((historyList || []).slice(0, 5));

      // 4. Fetch Dashboard Statistics
      const metricsRes = await apiService.getDriverMetrics(authenticatedDriverId).catch(() => null);
      if (metricsRes?.metrics) {
        setMetrics({
          totalOrders: metricsRes.metrics.totalTrips,
          activeOrders: metricsRes.metrics.activeTrips,
          completedOrders: metricsRes.metrics.completedTrips,
          pendingOrders: activeTrip && (activeTrip.transportRequestStatus === 'DRIVER_ASSIGNED' || activeTrip.status === 'DRIVER_ASSIGNED') ? 1 : 0,
          cancelledOrders: metricsRes.metrics.cancelledTrips
        });
      } else {
        const history = historyList || [];
        setMetrics({
          totalOrders: (activeTrip ? 1 : 0) + history.length,
          activeOrders: activeTrip ? 1 : 0,
          completedOrders: history.filter(h => ['COMPLETED', 'DELIVERED', 'Completed'].includes(h.transportRequestStatus || h.status)).length,
          pendingOrders: activeTrip && (activeTrip.transportRequestStatus === 'DRIVER_ASSIGNED' || activeTrip.status === 'DRIVER_ASSIGNED') ? 1 : 0,
          cancelledOrders: history.filter(h => ['CANCELLED', 'REJECTED'].includes(h.transportRequestStatus || h.status)).length
        });
      }
    } catch (err) {
      console.error("Error loading driver dashboard:", err);
      setError("Unable to load current order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [authenticatedDriverId, orders]);

  // Handle Accept Ride Action
  const handleAcceptRide = async (orderId) => {
    try {
      if (driverAcceptTrip) {
        driverAcceptTrip(orderId);
      } else {
        await apiService.updateDriverTripStatus(orderId, 'DRIVER_ACCEPTED');
      }
      fetchDashboardData();
      navigate('/transport/driver/navigation');
    } catch (err) {
      console.error("Failed to accept ride:", err);
    }
  };

  // Status workflow steps
  const statusWorkflow = [
    { label: 'Start Pickup (En Route)', nextStatus: 'EN_ROUTE_TO_PICKUP' },
    { label: 'Arrived at Pickup', nextStatus: 'ARRIVED_AT_PICKUP' },
    { label: 'Pickup Completed', nextStatus: 'PICKUP_COMPLETED' },
    { label: 'Start Delivery (In Transit)', nextStatus: 'IN_TRANSIT' },
    { label: 'Arrived at Destination', nextStatus: 'ARRIVED_AT_DESTINATION' },
    { label: 'Mark Delivered & Complete', nextStatus: 'COMPLETED' }
  ];

  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      if (driverUpdateTripStatus) {
        driverUpdateTripStatus(orderId, nextStatus);
      } else {
        await apiService.updateDriverTripStatus(orderId, nextStatus);
      }
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      {/* PERSISTENT DRIVER SIDEBAR */}
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Driver Main Dashboard" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-extrabold text-cyan-300 text-xs">Loading Driver Dashboard Data...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-slate-900 rounded-3xl border border-rose-500/30 text-rose-400 text-center space-y-3">
              <AlertCircle className="w-8 h-8 mx-auto" />
              <p className="font-bold text-xs">{error}</p>
              <button onClick={fetchDashboardData} className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
                Retry Loading
              </button>
            </div>
          ) : (
            <>
              {/* 1. DRIVER PROFILE BANNER */}
              <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-4 relative z-10">
                  <img
                    src={driverProfile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                    alt={driverProfile?.name || 'Driver'}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 font-mono font-extrabold text-[11px] rounded-md border border-cyan-500/30">
                        {driverProfile?.driverId || authenticatedDriverId}
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[11px] rounded-md border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Driver</span>
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white">WELCOME, {driverProfile?.name?.toUpperCase()}</h2>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{driverProfile?.companyName || 'GreenRoute Logistics Pvt Ltd'}</span>
                      <span>•</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white">{driverProfile?.rating || 4.9}</span>
                      <span>({driverProfile?.tripsCompleted || 0} Trips)</span>
                    </p>
                  </div>
                </div>

                <Link
                  to="/transport/driver/profile"
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 font-bold text-xs rounded-xl border border-slate-800 cursor-pointer flex items-center gap-2 shrink-0 relative z-10"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>DRIVER PROFILE & TRUCK</span>
                </Link>
              </div>

              {/* 2. FLEET DASHBOARD STATISTICS CARDS */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <span>FLEET DASHBOARD STATISTICS</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase">Total Orders</p>
                    <p className="text-2xl font-black text-white mt-1">{metrics.totalOrders}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Assigned to Driver</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-cyan-400 uppercase">Active Orders</p>
                    <p className="text-2xl font-black text-cyan-300 mt-1">{metrics.activeOrders}</p>
                    <p className="text-[10px] text-cyan-500 mt-1">In Progress</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-emerald-400 uppercase">Completed Orders</p>
                    <p className="text-2xl font-black text-emerald-300 mt-1">{metrics.completedOrders}</p>
                    <p className="text-[10px] text-emerald-500 mt-1">Delivered & Verified</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-amber-400 uppercase">Pending Orders</p>
                    <p className="text-2xl font-black text-amber-300 mt-1">{metrics.pendingOrders}</p>
                    <p className="text-[10px] text-amber-500 mt-1">Awaiting Acceptance</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-rose-400 uppercase">Cancelled Orders</p>
                    <p className="text-2xl font-black text-rose-300 mt-1">{metrics.cancelledOrders}</p>
                    <p className="text-[10px] text-rose-500 mt-1">Rejected / Cancelled</p>
                  </div>
                </div>
              </div>

              {/* 3. CURRENT ASSIGNED ORDER CARD (Root Bug Fix) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-cyan-400" />
                    <span>CURRENT ASSIGNED ORDER</span>
                  </h3>
                  {currentAssignedOrder && (
                    <Link
                      to="/transport/driver/navigation"
                      className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open Live GPS Navigation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {currentAssignedOrder ? (
                  <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-cyan-500/40 shadow-2xl space-y-4 backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">ORDER ID</span>
                        <h4 className="font-mono font-black text-cyan-400 text-xl tracking-wide">{currentAssignedOrder.id}</h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL</span>
                        <p className="font-black text-white text-base">{currentAssignedOrder.productTitle} ({currentAssignedOrder.quantityKg} kg)</p>
                      </div>
                    </div>

                    {(currentAssignedOrder.transportRequestStatus === 'DRIVER_ASSIGNED' || currentAssignedOrder.status === 'DRIVER_ASSIGNED') && (
                      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-4 rounded-2xl border border-emerald-500/50 shadow-xl space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Sparkles className="w-5 h-5 animate-spin" />
                          <span className="font-extrabold text-sm uppercase">NEW ASSIGNED RIDE DISPATCH</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          You have been assigned a new scrap transportation pickup. Accept ride to enable live route GPS navigation.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAcceptRide(currentAssignedOrder.id)}
                          className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm rounded-xl cursor-pointer hover:from-emerald-300 hover:to-teal-300 shadow-md flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5 stroke-[3]" />
                          <span>ACCEPT RIDE & OPEN GPS MAP NAVIGATION</span>
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <MapPin className="w-4 h-4" />
                          <span className="uppercase text-[10px]">SELLER (PICKUP LOCATION)</span>
                        </div>
                        <p className="font-bold text-white text-sm">{currentAssignedOrder.sellerName}</p>
                        <p className="text-slate-400">{currentAssignedOrder.sellerAddress}</p>
                      </div>

                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                          <Navigation className="w-4 h-4" />
                          <span className="uppercase text-[10px]">BUYER (DESTINATION LOCATION)</span>
                        </div>
                        <p className="font-bold text-white text-sm">{currentAssignedOrder.buyerName}</p>
                        <p className="text-slate-400">{currentAssignedOrder.buyerAddress}</p>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ADVANCE TRIP WORKFLOW STATUS</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {statusWorkflow.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() => handleUpdateStatus(currentAssignedOrder.id, action.nextStatus)}
                            className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer hover:border-cyan-500/50"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/90 rounded-3xl p-10 text-center text-slate-400 border border-slate-800 shadow-2xl space-y-3 backdrop-blur-xl">
                    <Truck className="w-12 h-12 text-cyan-400 mx-auto" />
                    <h4 className="font-extrabold text-white text-base">NO ACTIVE ORDER</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      You currently have no active pickup or delivery assignment. Your previous orders are available in Order History.
                    </p>
                  </div>
                )}
              </div>

              {/* 4. OLD ORDERS / HISTORY PREVIEW TABLE */}
              <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-extrabold text-white text-sm">
                      RECENT COMPLETED DELIVERIES & HISTORY
                    </h3>
                  </div>
                  <Link
                    to="/transport/driver/history"
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Full History Archive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">ORDER ID</th>
                        <th className="p-3.5">SELLER</th>
                        <th className="p-3.5">BUYER</th>
                        <th className="p-3.5">MATERIAL & QUANTITY</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {recentHistory.length > 0 ? (
                        recentHistory.map((trip) => (
                          <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-3.5 font-mono font-extrabold text-cyan-400">{trip.id}</td>
                            <td className="p-3.5 font-bold text-white">{trip.sellerName}</td>
                            <td className="p-3.5 font-bold text-white">{trip.buyerName}</td>
                            <td className="p-3.5 text-slate-200 font-bold">{trip.productTitle} ({trip.quantityKg} kg)</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                {trip.transportRequestStatus || trip.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderDetail(trip)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-extrabold text-[11px] rounded-lg border border-slate-700 cursor-pointer"
                              >
                                VIEW DETAILS
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-6 text-center text-slate-500 font-bold text-xs">
                            No past orders found in trip history archive.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm">Order Details: {selectedOrderDetail.id}</h3>
              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL</span>
                <p className="font-bold text-white text-sm">{selectedOrderDetail.productTitle}</p>
                <p className="text-cyan-300 font-mono font-bold">Quantity: {selectedOrderDetail.quantityKg} kg • Total Value: ₹{Number(selectedOrderDetail.totalPrice || 0).toLocaleString('en-IN')}</p>
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
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderDetail(null)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
