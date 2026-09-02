import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { Users, PlusCircle, UserCheck, Star, X, ShieldCheck, Phone, Truck, CheckCircle2, User, Award } from 'lucide-react';

const DRIVER_AVATAR_PRESETS = [
  { id: 1, label: 'Avatar 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 2, label: 'Avatar 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 3, label: 'Avatar 3', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
  { id: 4, label: 'Avatar 4', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' }
];

export const ManagerDriversPage = () => {
  const { currentUser, createDriverByManager } = useAuth();
  const { companyDrivers, fleetVehicles, addCompanyDriver } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const myDrivers = companyDrivers.filter(d => d.transportCompanyId === companyId);
  const myVehicles = fleetVehicles.filter(v => v.transportCompanyId === companyId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: 'TN01-2024-001122',
    licenseType: 'Commercial Heavy & EV',
    assignedVehicleNumber: '',
    password: 'Driver@123'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // 1. Add driver in DataContext
    const driverData = addCompanyDriver(formData, currentUser);

    // 2. Add driver auth credentials in AuthContext
    createDriverByManager(driverData, currentUser);

    setShowAddModal(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Company Drivers & Workers Directory" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Drivers & Fleet Personnel ({myDrivers.length})</h2>
              <p className="text-xs text-slate-500">View company licensed drivers, profile credentials & truck assignments</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Add New Driver</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Driver Profile</th>
                    <th className="p-4">Driver ID</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">License Number</th>
                    <th className="p-4">Assigned Vehicle</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myDrivers.map(driver => {
                    const avatarUrl = driver.avatar || (driver.driverId === 'DRV001' ? DRIVER_AVATAR_PRESETS[0].url : DRIVER_AVATAR_PRESETS[1].url);
                    const rating = driver.rating || 4.8;

                    // Check if driver has an active ongoing delivery order
                    const activeOrder = (orders || []).find(o => 
                      (o.driverId === driver.driverId || o.driverId === driver.id) &&
                      !['COMPLETED', 'CANCELLED', 'DELIVERED', 'Completed'].includes(o.transportRequestStatus || o.status)
                    );

                    const isBusy = Boolean(activeOrder) || ['ON DELIVERY', 'On Delivery', 'BUSY'].includes(driver.status);
                    const statusText = isBusy ? 'ON DELIVERY' : 'AVAILABLE';

                    return (
                      <tr key={driver.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Driver Profile Picture & Name */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl}
                              alt={driver.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-300 shadow-xs cursor-pointer hover:opacity-90"
                              onClick={() => setSelectedDriver(driver)}
                            />
                            <div>
                              <p className="font-extrabold text-slate-900 hover:text-cyan-700 cursor-pointer" onClick={() => setSelectedDriver(driver)}>
                                {driver.name}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-slate-700">{rating}</span>
                                <span>({driver.completedTripsCount || 30} Trips)</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-mono font-extrabold text-cyan-700">{driver.driverId}</td>
                        <td className="p-4 font-medium">{driver.phone}</td>
                        <td className="p-4 font-mono font-medium text-slate-700">{driver.licenseNumber}</td>
                        <td className="p-4 font-semibold text-slate-800">{driver.assignedVehicleNumber || 'Unassigned'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            isBusy
                              ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedDriver(driver)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 font-extrabold text-[11px] rounded-lg border border-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                            <span>View Profile</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Read-Only Driver Profile Card Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedDriver(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-cyan-100 text-cyan-700 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Verified Driver Identity & Badge</h3>
                <p className="text-xs text-slate-500">Official credentials of company transport driver</p>
              </div>
            </div>

            {/* Driver Profile Picture & Rating Header Card */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-cyan-950 rounded-2xl text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDriver.avatar || (selectedDriver.driverId === 'DRV001' ? DRIVER_AVATAR_PRESETS[0].url : DRIVER_AVATAR_PRESETS[1].url)}
                  alt={selectedDriver.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shrink-0"
                />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 text-[9px] font-mono font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">
                    {selectedDriver.driverId}
                  </span>
                  <h4 className="font-extrabold text-white text-base leading-tight">{selectedDriver.name}</h4>
                  <p className="text-xs text-slate-300 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedDriver.rating || 4.8} Rating ({selectedDriver.completedTripsCount || 30} Completed Trips)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Read-Only Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Driving License (DL)</span>
                <span className="font-mono font-bold text-slate-900 text-xs block mt-0.5">{selectedDriver.licenseNumber}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Duty Status</span>
                <span className="font-extrabold text-emerald-700 text-xs block mt-0.5 uppercase">{selectedDriver.status}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile Phone Number</span>
                <span className="font-bold text-slate-900 text-xs block mt-0.5">{selectedDriver.phone}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Truck</span>
                <span className="font-bold text-cyan-800 text-xs block mt-0.5">{selectedDriver.assignedVehicleNumber || 'Unassigned'}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedDriver(null)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Add Company Driver</h3>
              <button onClick={() => setShowAddModal(false)} className="font-bold text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (+91) *</label>
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData(prev => ({ ...prev, phone: val }));
                  }}
                  placeholder="Enter 10-digit Mobile Number"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Vehicle</label>
                  <select
                    name="assignedVehicleNumber"
                    value={formData.assignedVehicleNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="">Unassigned</option>
                    {myVehicles.map(v => (
                      <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber} ({v.vehicleType})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver App Password</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Create Driver Account
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
