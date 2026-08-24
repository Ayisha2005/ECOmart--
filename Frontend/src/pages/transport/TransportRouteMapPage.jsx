import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import MapView from '../../components/common/MapView';

export const TransportRouteMapPage = () => {
  const { currentUser } = useAuth();
  const { orders } = useData();

  const myOrders = orders.filter(o => 
    o.transportId === currentUser?.transportId || o.transportId === 'TRANS001' || !o.transportId
  );

  const activeTrip = myOrders[0];

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
        <Navbar title="Live Route Map & EV Dispatch GPS" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">EV Dispatch Navigation & Route Map</h3>
                <p className="text-xs text-slate-500">OpenStreetMap visualization of current assigned pickup coordinates</p>
              </div>
            </div>

            <MapView markers={mapMarkers} height="600px" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransportRouteMapPage;
