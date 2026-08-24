import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import MapView from '../../components/common/MapView';
import { Truck, Filter, Building2, MapPin } from 'lucide-react';

export const AdminGlobalFleetMap = () => {
  const { partners, fleetVehicles } = useData();
  const [selectedCompany, setSelectedCompany] = useState('ALL');

  const filteredVehicles = fleetVehicles.filter(v => 
    selectedCompany === 'ALL' || v.transportCompanyId === selectedCompany || v.companyName === selectedCompany
  );

  const mapMarkers = filteredVehicles.map(v => ({
    id: v.id,
    lat: v.lat,
    lng: v.lng,
    title: `🚚 ${v.vehicleNumber}`,
    location: `Company: ${v.companyName} | Driver: ${v.driverName || 'Unassigned'}`,
    type: 'transport',
    typeLabel: `${v.currentStatus} (${v.vehicleType})`
  }));

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Pan-India Admin Global Transportation Map" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <span>Pan-India 3rd Party Fleet Live Oversight</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Live tracking of all partner logistics trucks operating across Indian highways & eco routes</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-bold text-slate-700">Filter by Transportation Partner:</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="ALL">All Partner Companies ({fleetVehicles.length} Vehicles)</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.companyName}</option>
                ))}
              </select>
            </div>

            <span className="text-xs font-extrabold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              OpenStreetMap Active
            </span>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <MapView markers={mapMarkers} height="600px" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminGlobalFleetMap;
