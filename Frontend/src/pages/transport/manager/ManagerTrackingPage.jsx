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
          {/* Full Width Map View */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-3">
            <MapView
              markers={mapMarkers}
              height="650px"
              onSelectLocation={handleMarkerSelect}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerTrackingPage;
