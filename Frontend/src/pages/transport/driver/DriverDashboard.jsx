import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import apiService from '../../../services/apiService';
import DriverSidebar from '../../../components/common/DriverSidebar';
import Navbar from '../../../components/common/Navbar';
import {
  Truck,
  CheckCircle2,
  Navigation,
  Clock,
  User,
  Star,
  ShieldCheck,
  Award,
  ArrowRight,
  Package,
  MapPin,
  AlertCircle
} from 'lucide-react';

export const DriverDashboard = () => {
  const { currentUser } = useAuth();
  const { orders } = useData();
  const navigate = useNavigate();

  const authenticatedDriverId = currentUser?.driverId || currentUser?.transportId || currentUser?.id || 'DRV001';

  const [driverProfile, setDriverProfile] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [metrics, setMetrics] = useState({
    totalTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
    totalPayloadKg: 0,
    co2SavedKg: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const profileRes = await apiService.getDriverProfile(authenticatedDriverId).catch(() => null);
        const fetchedDriver = profileRes?.driver || {
          driverId: authenticatedDriverId,
          name: currentUser?.name || 'Driver',
          phone: currentUser?.phone || '+91 98401 00000',
          assignedVehicleNumber: currentUser?.assignedVehicleNumber || 'TN 01 AB 1234',
          companyName: currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd',
          rating: currentUser?.rating || 4.9,
          tripsCompleted: 142
        };
        setDriverProfile(fetchedDriver);

        // Fetch active trip (strictly non-completed)
        const tripRes = await apiService.getDriverCurrentTrip(authenticatedDriverId).catch(() => null);
        let currentTrip = tripRes?.activeTrip;

        if (!currentTrip && orders) {
          currentTrip = orders.find(o => {
            const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
              (o.vehicleNumber && fetchedDriver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === fetchedDriver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
            const isNotCompleted = !['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
            return isMatch && isNotCompleted;
          });
        }
        setActiveTrip(currentTrip || null);

        // Fetch driver metrics
        const metricsRes = await apiService.getDriverMetrics(authenticatedDriverId).catch(() => null);
        if (metricsRes?.metrics) {
          setMetrics(metricsRes.metrics);
        } else {
          setMetrics({
            totalTrips: 45,
            activeTrips: currentTrip ? 1 : 0,
            completedTrips: 44,
            totalPayloadKg: 65000,
            co2SavedKg: 97500
          });
        }
      } catch (err) {
        console.error("Error loading driver dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authenticatedDriverId, orders, currentUser]);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Driver Executive Dashboard" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Driver Profile Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <img
                src={driverProfile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                alt="Driver Profile"
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 font-mono font-extrabold text-[11px] rounded-md border border-cyan-500/30">
                    {driverProfile?.driverId || authenticatedDriverId}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[11px] rounded-md border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Active Driver</span>
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">{driverProfile?.name}</h2>
                <p className="text-xs text-slate-300 flex items-center gap-2 font-medium">
                  <span>{driverProfile?.companyName || 'GreenRoute Logistics Pvt Ltd'}</span>
                  <span>•</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{driverProfile?.rating || 4.9} Rating</span>
                </p>
              </div>
            </div>

            {/* Assigned Truck Card */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 w-full md:w-auto min-w-[220px] space-y-1 relative z-10">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">ASSIGNED LORRY</p>
              <p className="font-mono font-black text-cyan-300 text-base">{driverProfile?.assignedVehicleNumber || 'TN 01 AB 1234'}</p>
              <p className="text-[11px] text-slate-400 font-semibold">Commercial Lorry Truck</p>
            </div>
          </div>

          {/* Quick Nav Shortcut Cards (Separate Pages) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => navigate('/transport/driver/requests')}
              className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-xl flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase">
                  <Clock className="w-4 h-4" />
                  <span>ACCEPT / REJECT RIDES</span>
                </div>
                <h3 className="font-extrabold text-white text-base">New Pickup Requests</h3>
                <p className="text-[11px] text-slate-400">View & accept incoming logistics dispatches</p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>

            <div
              onClick={() => navigate('/transport/driver/navigation')}
              className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-xl flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase">
                  <Navigation className="w-4 h-4" />
                  <span>LIVE MAP NAVIGATION</span>
                </div>
                <h3 className="font-extrabold text-white text-base">GPS Route Navigation</h3>
                <p className="text-[11px] text-slate-400">Step-by-step pickup & delivery map</p>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>

            <div
              onClick={() => navigate('/transport/driver/history')}
              className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-xl flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>OLD ORDERS & HISTORY</span>
                </div>
                <h3 className="font-extrabold text-white text-base">Trip History Archive</h3>
                <p className="text-[11px] text-slate-400">View past completed scrap deliveries</p>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Current Active Trip Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <span>CURRENT ACTIVE TRIP</span>
              </h3>
            </div>

            {activeTrip ? (
              <div className="bg-slate-900/90 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">TRIP ID</span>
                    <h4 className="font-mono font-black text-cyan-400 text-xl tracking-wide">{activeTrip.id}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/transport/driver/navigation')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md hover:from-cyan-300 hover:to-teal-300"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Open Live GPS Navigation Map Page</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">SELLER (PICKUP LOCATION)</p>
                    <p className="font-bold text-white text-sm">{activeTrip.sellerName}</p>
                    <p className="text-slate-400">{activeTrip.sellerAddress}</p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase">BUYER (DESTINATION LOCATION)</p>
                    <p className="font-bold text-white text-sm">{activeTrip.buyerName}</p>
                    <p className="text-slate-400">{activeTrip.buyerAddress}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/90 rounded-3xl p-8 text-center text-slate-400 border border-slate-800 shadow-2xl space-y-2">
                <Truck className="w-10 h-10 text-cyan-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">NO ACTIVE TRIP</h4>
                <p className="text-xs text-slate-400">You currently have no active trip. Check "Accept / Reject Orders" for new dispatches.</p>
              </div>
            )}
          </div>

          {/* Metrics Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase">Total Trips</p>
              <p className="text-2xl font-black text-white mt-1">{metrics.totalTrips}</p>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <p className="text-[10px] font-extrabold text-emerald-400 uppercase">Completed Trips</p>
              <p className="text-2xl font-black text-emerald-300 mt-1">{metrics.completedTrips}</p>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <p className="text-[10px] font-extrabold text-amber-400 uppercase">Total Payload</p>
              <p className="text-2xl font-black text-amber-300 mt-1">{metrics.totalPayloadKg.toLocaleString()} kg</p>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              <p className="text-[10px] font-extrabold text-teal-400 uppercase">CO2 Impact</p>
              <p className="text-2xl font-black text-teal-300 mt-1">{metrics.co2SavedKg.toLocaleString()} kg</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
