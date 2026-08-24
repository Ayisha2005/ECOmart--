import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { Truck, PlusCircle, Wrench, CheckCircle2, UserCheck } from 'lucide-react';

export const ManagerFleetPage = () => {
  const { currentUser } = useAuth();
  const { fleetVehicles, companyDrivers, addFleetVehicle } = useData();

  const companyId = currentUser?.transportCompanyId || 'comp-greenroute';
  const myVehicles = fleetVehicles.filter(v => v.transportCompanyId === companyId);
  const myDrivers = companyDrivers.filter(d => d.transportCompanyId === companyId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: 'TN 01 XY 9988 (Demo)',
    vehicleType: 'Tata Ace EV (Electric)',
    capacity: '1.5 Tons',
    serviceArea: 'Metropolitan Zone',
    driverId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignedDriver = myDrivers.find(d => d.driverId === formData.driverId);
    
    addFleetVehicle({
      ...formData,
      driverName: assignedDriver ? assignedDriver.name : "Unassigned",
      driverPhone: assignedDriver ? assignedDriver.phone : ""
    }, currentUser);

    setShowAddModal(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Fleet Management (Vehicles & Trucks)" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Company Vehicle Fleet ({myVehicles.length})</h2>
              <p className="text-xs text-slate-500">Manage Mini Trucks, Tata Ace EVs, and Heavy Commercial vehicles</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Add Vehicle to Fleet</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Vehicle Plate No</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Payload Capacity</th>
                    <th className="p-4">Assigned Driver</th>
                    <th className="p-4">Service Area</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myVehicles.map(veh => (
                    <tr key={veh.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-extrabold text-cyan-700">{veh.vehicleNumber}</td>
                      <td className="p-4 font-bold text-slate-900">{veh.vehicleType}</td>
                      <td className="p-4 font-medium text-slate-700">{veh.capacity}</td>
                      <td className="p-4 font-medium text-slate-800">{veh.driverName || 'Unassigned'}</td>
                      <td className="p-4 font-medium">{veh.serviceArea}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          veh.currentStatus === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'
                        }`}>
                          {veh.currentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Add New Fleet Vehicle</h3>
              <button onClick={() => setShowAddModal(false)} className="font-bold text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Plate Number (Demo) *</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Type *</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Pickup Truck">Pickup Truck</option>
                  <option value="Tata Ace EV (Electric)">Tata Ace EV (Electric)</option>
                  <option value="Light Commercial Vehicle">Light Commercial Vehicle</option>
                  <option value="Medium Truck">Medium Truck</option>
                  <option value="Heavy Truck">Heavy Truck</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payload Capacity</label>
                  <input
                    type="text"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Driver</label>
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="">Unassigned</option>
                    {myDrivers.map(d => (
                      <option key={d.id} value={d.driverId}>{d.name} ({d.driverId})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerFleetPage;
