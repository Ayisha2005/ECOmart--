import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import apiService from '../../../services/apiService';
import DriverSidebar from '../../../components/common/DriverSidebar';
import Navbar from '../../../components/common/Navbar';
import { Clock, Check, X, MapPin, Truck, Sparkles, Navigation, AlertCircle } from 'lucide-react';

export const DriverRequestsPage = () => {
  const { currentUser } = useAuth();
  const { orders, driverAcceptTrip, driverRejectTrip, driverUpdateTripStatus } = useData();
  const navigate = useNavigate();

  const authenticatedDriverId = currentUser?.driverId || currentUser?.transportId || currentUser?.id || 'DRV001';

  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Filter orders assigned to this driver awaiting acceptance
      const assignedOrders = (orders || []).filter(o => {
        const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
          (o.vehicleNumber && currentUser?.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === currentUser.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
        const isPending = (o.transportRequestStatus === 'DRIVER_ASSIGNED' || o.status === 'DRIVER_ASSIGNED');
        return isMatch && isPending;
      });

      setPendingRequests(assignedOrders);
    } catch (err) {
      console.error("Error loading driver requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [authenticatedDriverId, orders]);

  const handleAccept = async (orderId) => {
    try {
      if (driverAcceptTrip) {
        driverAcceptTrip(orderId);
      } else {
        await apiService.updateDriverTripStatus(orderId, 'DRIVER_ACCEPTED');
      }
      // Redirect driver to live map navigation page
      navigate('/transport/driver/navigation');
    } catch (err) {
      console.error("Failed to accept ride:", err);
    }
  };

  const handleReject = async (orderId) => {
    try {
      if (driverRejectTrip) {
        driverRejectTrip(orderId);
      } else if (driverUpdateTripStatus) {
        driverUpdateTripStatus(orderId, 'DRIVER_REJECTED');
      } else {
        await apiService.updateDriverTripStatus(orderId, 'DRIVER_REJECTED');
      }
      fetchRequests();
    } catch (err) {
      console.error("Failed to reject ride:", err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Accept / Reject Incoming Ride Dispatches" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-extrabold tracking-wide">Incoming Pickup Ride Dispatches</h2>
              </div>
              <p className="text-xs text-slate-300">
                Review assigned scrap transport pickups. Accept to start live route GPS navigation or reject to reassign.
              </p>
            </div>

            <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 font-mono font-extrabold text-xs rounded-xl border border-amber-500/30 shrink-0 relative z-10">
              {pendingRequests.length} Pending Rides
            </span>
          </div>

          {/* Pending Requests List */}
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map(req => (
                <div key={req.id} className="bg-slate-900/90 rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-5 backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">NEW ASSIGNED RIDE DISPATCH</span>
                      <h3 className="font-mono font-black text-cyan-400 text-xl tracking-wide">{req.id}</h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">PAYLOAD & FARE</span>
                      <p className="font-black text-white text-base">{req.productTitle} ({req.quantityKg} kg) • ₹{Number(req.totalPrice || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <MapPin className="w-4 h-4" />
                        <span className="uppercase text-[10px]">PICKUP LOCATION (SELLER)</span>
                      </div>
                      <p className="font-bold text-white text-sm">{req.sellerName}</p>
                      <p className="text-slate-400">{req.sellerAddress}</p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                        <Navigation className="w-4 h-4" />
                        <span className="uppercase text-[10px]">DESTINATION LOCATION (BUYER)</span>
                      </div>
                      <p className="font-bold text-white text-sm">{req.buyerName}</p>
                      <p className="text-slate-400">{req.buyerAddress}</p>
                    </div>
                  </div>

                  {/* Accept / Reject Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => handleReject(req.id)}
                      className="w-full sm:w-1/3 py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-extrabold text-xs rounded-xl border border-rose-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4 text-rose-400" />
                      <span>DECLINE / REJECT RIDE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAccept(req.id)}
                      className="w-full sm:w-2/3 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>ACCEPT RIDE & OPEN GPS MAP NAVIGATION</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/90 rounded-3xl p-12 text-center text-slate-400 border border-slate-800 shadow-2xl space-y-3">
              <Clock className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="font-extrabold text-white text-base">NO PENDING RIDE DISPATCHES</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You currently have no new incoming pickup requests assigned to your driver ID. New dispatches from your transport manager will appear here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DriverRequestsPage;
