import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import MapView from '../../../components/common/MapView';
import { Navigation, Truck, Phone, MapPin, Clock, Building2 } from 'lucide-react';

export const ManagerTrackingPage = () => {
  const { currentUser } = useAuth();
  const { fleetVehicles, orders } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const myVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === companyId);
  const myOrders = (orders || []).filter(o => o.transportCompanyId === companyId);

  const [selectedTruck, setSelectedTruck] = useState(myVehicles[0] || null);

  const mapMarkers = myVehicles.map(v => {
    const associatedOrder = myOrders.find(o => o.id === v.assignedOrderId || o.vehicleNumber === v.vehicleNumber);

    return {
      id: v.id,
      lat: v.lat || 13.0827,
      lng: v.lng || 80.2707,
      title: `🚚 ${v.vehicleNumber}`,
      location: `Driver: ${v.driverName || 'Unassigned'} | Status: ${v.currentStatus}`,
      type: 'transport',
      typeLabel: `${v.currentStatus} (${v.vehicleType})`,
      rawVehicle: v,
      associatedOrder
    };
  });

  const handleMarkerSelect = (marker) => {
    if (marker.rawVehicle) {
      setSelectedTruck(marker.rawVehicle);
    }
  };

  const currentOrder = selectedTruck ? myOrders.find(o => o.id === selectedTruck.assignedOrderId || o.vehicleNumber === selectedTruck.vehicleNumber) : null;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Fleet Route Tracking & OpenStreetMap GPS Telemetry" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <Navigation className="w-5 h-5 text-cyan-400" />
                <span>Real-Time Fleet OpenStreetMap Tracking</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Live tracking for trucks owned by {currentUser?.companyName || 'GreenRoute Logistics'}. Click any vehicle marker for full trip details.</p>
            </div>
            <span className="px-3 py-1.5 bg-cyan-950 text-cyan-300 font-mono font-bold text-xs rounded-xl border border-cyan-500/30">
              {myVehicles.length} Active Vehicles On GPS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map View */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <MapView
                markers={mapMarkers}
                height="550px"
                onSelectLocation={handleMarkerSelect}
              />
            </div>

            {/* Truck Inspection Panel */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              {selectedTruck ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-cyan-100 text-cyan-800 rounded-md uppercase">
                        {selectedTruck.currentStatus}
                      </span>
                      <h3 className="font-extrabold text-lg text-slate-900 mt-1 font-mono">{selectedTruck.vehicleNumber}</h3>
                      <p className="text-xs font-semibold text-slate-500">{selectedTruck.vehicleType}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Driver Information</p>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedTruck.driverName || 'Ramesh Kumar'}</p>
                      <p className="text-xs text-slate-600 font-medium">{selectedTruck.driverPhone || '+91 98401 99887'}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned Order ID</p>
                      <p className="font-mono font-extrabold text-cyan-700 text-sm mt-0.5">{currentOrder ? currentOrder.id : 'ORD-9081'}</p>
                      <p className="text-xs text-slate-700 font-bold">{currentOrder ? currentOrder.productTitle : 'High-Grade PET Plastic Bottles'}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Route Coordinates</p>
                      <p className="text-slate-800 font-medium">
                        <span className="font-bold text-slate-900">From:</span> {currentOrder ? currentOrder.sellerAddress : 'Guindy Industrial Estate, Chennai'}
                      </p>
                      <p className="text-slate-800 font-medium">
                        <span className="font-bold text-slate-900">To:</span> {currentOrder ? currentOrder.buyerAddress : 'Ambattur Industrial Zone, Chennai'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg">
                        <p className="font-bold uppercase text-[9px] text-emerald-700">Trip Started</p>
                        <p className="font-extrabold">Today, 09:30 AM</p>
                      </div>
                      <div className="p-2 bg-cyan-50 text-cyan-900 rounded-lg">
                        <p className="font-bold uppercase text-[9px] text-cyan-700">Est. Arrival</p>
                        <p className="font-extrabold">Today, 05:30 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <a
                      href={`tel:${selectedTruck.driverPhone || '+919840199887'}`}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Driver</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Truck className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Select a Vehicle Marker</p>
                  <p className="text-[11px] text-slate-400 mt-1">Click any lorry marker on the map to inspect live driver and route telemetry.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerTrackingPage;
