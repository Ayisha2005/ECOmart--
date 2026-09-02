import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import MapView from '../../components/common/MapView';
import { Truck, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, IndianRupee } from 'lucide-react';

export const DeliveryTrackingPage = () => {
  const { currentUser, role } = useAuth();
  const { orders } = useData();

  const activeOrders = orders.filter(o => 
    role === 'BUYER' ? (o.buyerId === currentUser?.id || o.buyerName === currentUser?.name) : true
  );

  const activeTrackingOrder = activeOrders[0] || orders[0];

  const statusSteps = [
    'Pending',
    'Confirmed',
    'Transportation Assigned',
    'Pickup Scheduled',
    'Picked Up',
    'In Transit',
    'Delivered',
    'Completed'
  ];

  const getCurrentStepIndex = (status) => {
    return statusSteps.indexOf(status) !== -1 ? statusSteps.indexOf(status) : 2;
  };

  const pickupLat = Number(activeTrackingOrder?.pickupCoordinates?.[0]) || 13.0827;
  const pickupLng = Number(activeTrackingOrder?.pickupCoordinates?.[1]) || 80.2707;
  const delivLat = Number(activeTrackingOrder?.deliveryCoordinates?.[0]) || 13.1327;
  const delivLng = Number(activeTrackingOrder?.deliveryCoordinates?.[1]) || 80.3207;
  const transLat = Number(activeTrackingOrder?.currentTransportCoordinates?.[0]) || (pickupLat + 0.01);
  const transLng = Number(activeTrackingOrder?.currentTransportCoordinates?.[1]) || (pickupLng + 0.01);

  const mapMarkers = activeTrackingOrder ? [
    {
      id: 'pickup',
      lat: pickupLat,
      lng: pickupLng,
      title: `Pickup: ${activeTrackingOrder.sellerName || 'Seller Location'}`,
      location: activeTrackingOrder.sellerAddress || 'Seller Address',
      type: 'seller',
      typeLabel: 'Seller Location'
    },
    {
      id: 'delivery',
      lat: delivLat,
      lng: delivLng,
      title: `Delivery: ${activeTrackingOrder.buyerName || 'Buyer Point'}`,
      location: activeTrackingOrder.buyerAddress || 'Buyer Address',
      type: 'buyer',
      typeLabel: 'Buyer Delivery Point'
    },
    {
      id: 'transport',
      lat: transLat,
      lng: transLng,
      title: `Vehicle: ${activeTrackingOrder.vehicleNumber || 'EV Truck'} (${activeTrackingOrder.transportId || 'TRANS001'})`,
      location: `Driver: ${activeTrackingOrder.driverName || activeTrackingOrder.transportName || 'EV Dispatch Driver'}`,
      type: 'transport',
      typeLabel: 'Live EV Transport GPS'
    }
  ] : [];

  const routePoints = activeTrackingOrder ? [
    [pickupLat, pickupLng],
    [transLat, transLng],
    [delivLat, delivLng]
  ] : [];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role={role || "BUYER"} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Live Electric Vehicle Delivery Tracking" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {activeTrackingOrder ? (
            <>
              {/* Order Logistics Header */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-500/30">
                      {activeTrackingOrder.id}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500 text-slate-950 rounded-full uppercase">
                      {activeTrackingOrder.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-2">{activeTrackingOrder.productTitle}</h2>
                  <p className="text-xs text-slate-400 mt-1">Quantity: {activeTrackingOrder.quantityKg} kg | Amount: ₹{activeTrackingOrder.totalPrice.toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Assigned Transport ID</p>
                  <p className="text-sm font-extrabold text-cyan-300 font-mono">{activeTrackingOrder.transportId || 'TRANS001'}</p>
                  <p className="text-xs text-slate-300 font-semibold">{activeTrackingOrder.vehicleNumber || 'TN 09 CB 4512'}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">PRD Order Lifecycle Timeline</h3>

                <div className="overflow-x-auto pb-2">
                  <div className="flex items-center justify-between min-w-[700px]">
                    {statusSteps.map((step, idx) => {
                      const currentIdx = getCurrentStepIndex(activeTrackingOrder.status);
                      const isDone = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step} className="flex-1 flex flex-col items-center relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                            isCurrent ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-100 scale-110 shadow-md' :
                            isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] font-bold text-center mt-2 ${
                            isCurrent ? 'text-cyan-700' : isDone ? 'text-emerald-700' : 'text-slate-400'
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Map Route Tracking */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">Live GPS Route & Dispatch Coordinates</h3>
                    <p className="text-xs text-slate-500">Real-time OpenStreetMap tracking between pickup hub and delivery destination</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-cyan-50 text-cyan-800 rounded-full border border-cyan-200">
                    Live Route GPS
                  </span>
                </div>

                <MapView
                  center={activeTrackingOrder.currentTransportCoordinates}
                  zoom={11}
                  markers={mapMarkers}
                  routePoints={routePoints}
                  height="380px"
                />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500">
              <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700">No Active Delivery Tracking Found</p>
              <p className="text-xs text-slate-400 mt-1">Place an order from the Buyer Marketplace to view live EV tracking.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;
