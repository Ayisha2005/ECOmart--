import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import MapView from '../../components/common/MapView';
import {
  Truck,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Battery,
  Navigation,
  ArrowRight
} from 'lucide-react';

export const TransportDashboard = () => {
  const { currentUser } = useAuth();
  const { orders, updateOrderStatus } = useData();

  // Find orders assigned to this transport driver
  const myAssignedOrders = orders.filter(o => 
    o.transportId === currentUser?.transportId || o.transportId === 'TRANS001' || !o.transportId
  );

  const activeTrip = myAssignedOrders[0];

  const handleNextStatus = (order) => {
    const statusFlow = ['Transportation Assigned', 'Pickup Scheduled', 'Picked Up', 'In Transit', 'Delivered', 'Completed'];
    const currentIdx = statusFlow.indexOf(order.status);
    if (currentIdx !== -1 && currentIdx < statusFlow.length - 1) {
      updateOrderStatus(order.id, statusFlow[currentIdx + 1]);
    }
  };

  const mapMarkers = activeTrip ? [
    {
      id: 'pickup',
      lat: activeTrip.pickupCoordinates[0],
      lng: activeTrip.pickupCoordinates[1],
      title: `Pickup Point: ${activeTrip.sellerName}`,
      location: activeTrip.sellerAddress,
      type: 'seller',
      typeLabel: 'Seller Scrap Pickup'
    },
    {
      id: 'delivery',
      lat: activeTrip.deliveryCoordinates[0],
      lng: activeTrip.deliveryCoordinates[1],
      title: `Delivery Destination: ${activeTrip.buyerName}`,
      location: activeTrip.buyerAddress,
      type: 'buyer',
      typeLabel: 'Buyer Delivery Location'
    },
    {
      id: 'vehicle',
      lat: activeTrip.currentTransportCoordinates[0],
      lng: activeTrip.currentTransportCoordinates[1],
      title: `My Vehicle GPS: ${currentUser?.vehicleNumber || 'TN 09 CB 4512'}`,
      location: `Driver: ${currentUser?.name || 'Ramesh Transport'}`,
      type: 'transport',
      typeLabel: 'Live Vehicle Location'
    }
  ] : [];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="TRANSPORTATION" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Transportation & EV Dispatch Portal" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Driver Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/30">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-tight">Driver Workspace: {currentUser?.name || 'Ramesh Transport'}</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Transportation ID: <span className="font-mono font-bold text-cyan-300">{currentUser?.transportId || 'TRANS001'}</span> | Vehicle: <span className="font-mono font-bold text-slate-200">{currentUser?.vehicleNumber || 'TN 09 CB 4512'}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
              <Battery className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">EV Battery Status</p>
                <p className="text-xs font-bold text-emerald-400">88% (210 km range)</p>
              </div>
            </div>
          </div>

          {/* Assigned Trips Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Admin-Assigned Pickups & Deliveries</h3>
                <p className="text-xs text-slate-500">Update status in real time as you pick up scrap from sellers and deliver to buyers</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-extrabold bg-cyan-50 text-cyan-800 rounded-full border border-cyan-200">
                {myAssignedOrders.length} Assigned Orders
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {myAssignedOrders.map(order => (
                <div key={order.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-cyan-700">{order.id}</span>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full uppercase">
                        {order.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{order.productTitle}</h4>
                    <p className="text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Pickup:</span> {order.sellerName} ({order.sellerAddress})
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Delivery:</span> {order.buyerName} ({order.buyerAddress})
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleNextStatus(order)}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Advance to Next Status</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Map */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">EV Dispatch Navigation & Route Map</h3>
                <p className="text-xs text-slate-500">OpenStreetMap visualization of current assigned pickup coordinates</p>
              </div>
            </div>

            <MapView markers={mapMarkers} height="360px" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransportDashboard;
