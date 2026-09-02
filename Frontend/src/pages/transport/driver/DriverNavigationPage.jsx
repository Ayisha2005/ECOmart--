import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import apiService from '../../../services/apiService';
import DriverSidebar from '../../../components/common/DriverSidebar';
import Navbar from '../../../components/common/Navbar';
import MapView from '../../../components/common/MapView';
import { Navigation, Truck, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const DriverNavigationPage = () => {
  const { currentUser } = useAuth();
  const { orders, driverUpdateTripStatus } = useData();

  const authenticatedDriverId = currentUser?.driverId || currentUser?.transportId || currentUser?.id || 'DRV001';

  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const res = await apiService.getDriverCurrentTrip(authenticatedDriverId).catch(() => null);
      let trip = res?.activeTrip;

      if (!trip && orders) {
        trip = orders.find(o => {
          const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
            (o.vehicleNumber && currentUser?.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === currentUser.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
          const isNotCompleted = !['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
          return isMatch && isNotCompleted;
        });
      }
      setActiveTrip(trip || null);
    } catch (err) {
      console.error("Error fetching active navigation trip:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [authenticatedDriverId, orders]);

  const handleAdvanceStatus = async (orderId, nextStatus) => {
    try {
      if (driverUpdateTripStatus) {
        driverUpdateTripStatus(orderId, nextStatus);
      } else {
        await apiService.updateDriverTripStatus(orderId, nextStatus);
      }
      fetchTrip();
    } catch (err) {
      console.error("Error updating navigation status:", err);
    }
  };

  const statusWorkflow = [
    { label: 'Start Pickup (En Route)', nextStatus: 'EN_ROUTE_TO_PICKUP' },
    { label: 'Arrived at Pickup', nextStatus: 'ARRIVED_AT_PICKUP' },
    { label: 'Pickup Completed', nextStatus: 'PICKUP_COMPLETED' },
    { label: 'Start Delivery (In Transit)', nextStatus: 'IN_TRANSIT' },
    { label: 'Arrived at Destination', nextStatus: 'ARRIVED_AT_DESTINATION' },
    { label: 'Mark Delivered & Complete', nextStatus: 'COMPLETED' }
  ];

  // Map markers calculation
  const pickupLat = Number(activeTrip?.pickupCoordinates?.[0]) || 13.0827;
  const pickupLng = Number(activeTrip?.pickupCoordinates?.[1]) || 80.2707;
  const delivLat = Number(activeTrip?.deliveryCoordinates?.[0]) || 13.1327;
  const delivLng = Number(activeTrip?.deliveryCoordinates?.[1]) || 80.3207;

  const mapMarkers = activeTrip ? [
    {
      id: 'pickup',
      lat: pickupLat,
      lng: pickupLng,
      title: `Pickup: ${activeTrip.sellerName || 'Seller Location'}`,
      location: activeTrip.sellerAddress || 'Seller Address',
      type: 'seller',
      typeLabel: 'Pickup Location'
    },
    {
      id: 'delivery',
      lat: delivLat,
      lng: delivLng,
      title: `Delivery: ${activeTrip.buyerName || 'Buyer Destination'}`,
      location: activeTrip.buyerAddress || 'Destination Address',
      type: 'buyer',
      typeLabel: 'Destination'
    },
    {
      id: 'truck',
      lat: pickupLat + 0.01,
      lng: pickupLng + 0.01,
      title: `My Lorry: ${currentUser?.assignedVehicleNumber || 'TN 01 AB 1234'}`,
      location: `Driver: ${currentUser?.name || 'Driver'}`,
      type: 'transport',
      typeLabel: 'Live GPS Location'
    }
  ] : [];

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Live Route GPS Navigation & Trip Workflow" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <Navigation className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-wide">Live Route GPS Navigation & Status Actions</h2>
              </div>
              <p className="text-xs text-slate-300">
                Interactive OpenStreetMap route tracking, seller pickup coordinates, buyer delivery destination, and live status lifecycle.
              </p>
            </div>

            {activeTrip && (
              <span className="px-3.5 py-1.5 bg-cyan-500/20 text-cyan-300 font-mono font-extrabold text-xs rounded-xl border border-cyan-500/40 animate-pulse shrink-0 relative z-10">
                {activeTrip.transportRequestStatus || activeTrip.status}
              </span>
            )}
          </div>

          {activeTrip ? (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">ACTIVE NAVIGATION TRIP</span>
                  <h3 className="font-mono font-black text-cyan-400 text-xl tracking-wide">{activeTrip.id}</h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">MATERIAL PAYLOAD</span>
                  <p className="font-black text-white text-base">{activeTrip.productTitle} ({activeTrip.quantityKg} kg)</p>
                </div>
              </div>

              {/* Workflow Step Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">ADVANCE TRIP WORKFLOW STATUS</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {statusWorkflow.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => handleAdvanceStatus(activeTrip.id, action.nextStatus)}
                      className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer hover:border-cyan-500/50 active:scale-95"
                    >
                      <span>{action.label}</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* OpenStreetMap Live GPS Navigation Map */}
              <div className="pt-2">
                <p className="text-xs font-extrabold text-slate-400 uppercase mb-2">OPENSTREETMAP LIVE GPS ROUTE MAP</p>
                <MapView markers={mapMarkers} height="420px" />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 rounded-3xl p-12 text-center text-slate-400 border border-slate-800 shadow-2xl space-y-3">
              <Navigation className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="font-extrabold text-white text-base">NO ACTIVE NAVIGATION TRIP</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You currently have no active pickup in progress to display on the live map. Accept a ride under "Accept / Reject Orders" to start live navigation.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DriverNavigationPage;
