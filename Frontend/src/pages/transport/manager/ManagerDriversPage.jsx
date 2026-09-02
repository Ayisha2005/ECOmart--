import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import {
  Users,
  PlusCircle,
  ShieldCheck,
  Star,
  Phone,
  Truck,
  UserCheck,
  X,
  Search,
  CheckCircle2,
  Clock,
  Package
} from 'lucide-react';

const DRIVER_AVATAR_PRESETS = [
  { id: 1, label: 'Driver Photo 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 2, label: 'Driver Photo 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 3, label: 'Driver Photo 3', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
  { id: 4, label: 'Driver Photo 4', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' }
];

export const ManagerDriversPage = () => {
  const { currentUser } = useAuth();
  const { companyDrivers = [], fleetVehicles = [], orders = [], addCompanyDriver } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const myDrivers = (companyDrivers || []).filter(d => d.transportCompanyId === companyId || !d.transportCompanyId);
  const myVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === companyId || !v.transportCompanyId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: 'TN-01-2026-99001',
    assignedVehicleNumber: ''
  });

  const filteredDrivers = myDrivers.filter(d =>
    (d.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.driverId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.phone || '').includes(searchQuery)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    addCompanyDriver({
      name: formData.name,
      phone: formData.phone,
      licenseNumber: formData.licenseNumber,
      assignedVehicleNumber: formData.assignedVehicleNumber,
      avatar: DRIVER_AVATAR_PRESETS[Math.floor(Math.random() * DRIVER_AVATAR_PRESETS.length)].url,
      transportCompanyId: companyId,
      companyName: currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd'
    });

    setFormData({ name: '', phone: '', licenseNumber: 'TN-01-2026-99001', assignedVehicleNumber: '' });
    setShowAddModal(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Drivers & Personnel Directory" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-wide">Company Drivers & Personnel Directory</h2>
              </div>
              <p className="text-xs text-slate-300">
                Manage drivers, verify licenses, track assigned lorries, active trip statuses, and onboarding for {currentUser?.companyName}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-950/50 cursor-pointer flex items-center gap-1.5 relative z-10 transition-transform active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Onboard New Driver</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search Driver Name, Driver ID, Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-hidden font-medium"
                />
              </div>

              <span className="px-3.5 py-1.5 bg-cyan-500/20 text-cyan-300 font-mono font-extrabold text-xs rounded-xl border border-cyan-500/30">
                {myDrivers.length} Registered Drivers
              </span>
            </div>

            {/* Drivers Directory Table (Requirement 4) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">DRIVER PROFILE</th>
                    <th className="p-3.5">DRIVER ID</th>
                    <th className="p-3.5">VERIFICATION</th>
                    <th className="p-3.5">PHONE</th>
                    <th className="p-3.5">ASSIGNED VEHICLE</th>
                    <th className="p-3.5">CURRENT ACTIVE TRIP</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredDrivers.length > 0 ? (
                    filteredDrivers.map(driver => {
                      const avatarUrl = driver.avatar || DRIVER_AVATAR_PRESETS[0].url;
                      const rating = driver.rating || 4.9;

                      // Check live ongoing trip for this driver
                      const activeOrder = (orders || []).find(o =>
                        (o.driverId === driver.driverId || o.driverId === driver.id) &&
                        !['COMPLETED', 'CANCELLED', 'DELIVERED', 'Completed'].includes(o.transportRequestStatus || o.status)
                      );

                      const isInTransit = Boolean(activeOrder && ['DRIVER_ACCEPTED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'PICKUP_COMPLETED', 'IN_TRANSIT', 'ARRIVED_AT_DESTINATION', 'In Transit'].includes(activeOrder.transportRequestStatus || activeOrder.status)) || ['IN TRANSIT', 'In Transit', 'ON DELIVERY'].includes(driver.status);
                      const isPendingAccept = Boolean(activeOrder && (activeOrder.transportRequestStatus === 'DRIVER_ASSIGNED' || activeOrder.status === 'DRIVER_ASSIGNED'));
                      const statusText = isInTransit ? 'IN TRANSIT' : isPendingAccept ? 'PENDING ACCEPTANCE' : 'AVAILABLE';

                      return (
                        <tr key={driver.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={avatarUrl}
                                alt={driver.name}
                                className="w-10 h-10 rounded-xl object-cover border border-cyan-500/50 shadow-xs cursor-pointer hover:opacity-90"
                                onClick={() => setSelectedDriver(driver)}
                              />
                              <div>
                                <p className="font-extrabold text-white hover:text-cyan-300 cursor-pointer" onClick={() => setSelectedDriver(driver)}>
                                  {driver.name}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="font-bold text-white">{rating}</span>
                                  <span>({driver.completedTripsCount || 35} Trips)</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 font-mono font-extrabold text-cyan-400">{driver.driverId || driver.id}</td>

                          <td className="p-3.5">
                            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-md border border-emerald-500/30 flex items-center gap-1 w-fit">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>Verified</span>
                            </span>
                          </td>

                          <td className="p-3.5 font-medium text-slate-300">{driver.phone}</td>

                          <td className="p-3.5 font-mono font-bold text-cyan-300">
                            {driver.assignedVehicleNumber || 'No Truck Assigned'}
                          </td>

                          <td className="p-3.5 font-mono font-bold text-amber-300">
                            {activeOrder ? activeOrder.id : 'None'}
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                              isInTransit
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                                : isPendingAccept
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}>
                              {statusText}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedDriver(driver)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-extrabold text-[11px] rounded-lg border border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View Profile</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-10 text-center text-slate-400 space-y-2">
                        <Users className="w-10 h-10 text-slate-600 mx-auto" />
                        <p className="font-bold text-white text-sm">No Drivers Found</p>
                        <p className="text-xs text-slate-500">Drivers onboarded into your company fleet will appear here.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Driver View Profile Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm">Driver Profile: {selectedDriver.name}</h3>
              <button onClick={() => setSelectedDriver(null)} className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer">✕</button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedDriver.avatar || DRIVER_AVATAR_PRESETS[0].url}
                alt={selectedDriver.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
              />
              <div>
                <p className="font-black text-white text-base">{selectedDriver.name}</p>
                <p className="text-cyan-400 font-mono font-bold text-xs">ID: {selectedDriver.driverId || selectedDriver.id}</p>
                <p className="text-slate-400 text-xs">{selectedDriver.companyName || currentUser?.companyName}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <p><span className="text-slate-500 font-bold">Mobile Phone:</span> <span className="text-white">{selectedDriver.phone}</span></p>
              <p><span className="text-slate-500 font-bold">License Number:</span> <span className="text-white">{selectedDriver.licenseNumber || 'TN-01-2026-8877'}</span></p>
              <p><span className="text-slate-500 font-bold">Assigned Lorry:</span> <span className="text-cyan-300 font-bold">{selectedDriver.assignedVehicleNumber || 'No Truck Assigned'}</span></p>
              <p><span className="text-slate-500 font-bold">Rating & Experience:</span> <span className="text-amber-400 font-bold">⭐ {selectedDriver.rating || 4.9}</span> ({selectedDriver.completedTripsCount || 35} Trips)</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDriver(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Modal: Onboard Driver */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm">Onboard New Driver to Company Fleet</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Driver Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g. Santhosh Kumar"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Mobile Phone Number *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  placeholder="+91 98401 00000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Driving License Number *</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Assign Truck / Lorry</label>
                <select
                  value={formData.assignedVehicleNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedVehicleNumber: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-300 outline-hidden"
                >
                  <option value="">-- No Truck Assigned --</option>
                  {myVehicles.map(v => (
                    <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} ({v.vehicleType})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-extrabold hover:from-cyan-300 hover:to-teal-300 cursor-pointer shadow-md"
                >
                  Onboard Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDriversPage;
