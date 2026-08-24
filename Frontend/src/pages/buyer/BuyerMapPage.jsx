import React from 'react';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import MapView from '../../components/common/MapView';

export const BuyerMapPage = () => {
  const { products } = useData();

  const mapMarkers = products.map(p => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    title: p.title,
    location: `${p.city}, ${p.state}`,
    price: p.price,
    type: 'seller',
    typeLabel: `${p.categoryLabel} (${p.weightKg} kg)`
  }));

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="BUYER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Nearby Scrap & Seller Map (OpenStreetMap)" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Interactive OpenStreetMap Seller Discovery</h3>
                <p className="text-xs text-slate-500">Locate verified scrap sellers and recycling hubs in your vicinity</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                Leaflet OpenStreetMap
              </span>
            </div>

            <MapView markers={mapMarkers} height="600px" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyerMapPage;
