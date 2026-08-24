import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { INDIAN_STATES, MAJOR_CITIES_BY_STATE } from '../../data/indianLocations';
import {
  Truck,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  KeyRound,
  Lock,
  Phone,
  User,
  MapPin,
  Send,
  AlertCircle
} from 'lucide-react';

export const TransportManagement = () => {
  const { createTransportAccountByAdmin } = useAuth();
  const { transportUsers = [], addTransportUser, toggleTransportStatus, orders = [], assignTransportToOrder } = useData();

  const safeTransportUsers = Array.isArray(transportUsers) ? transportUsers : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDriverForAssign, setSelectedDriverForAssign] = useState(null);
  const [assignOrderId, setAssignOrderId] = useState('');

  const [formData, setFormData] = useState({
    transportId: `TRANS00${safeTransportUsers.length + 1}`,
    password: 'Eco@123',
    name: '',
    driverName: '',
    phone: '',
    vehicleType: 'Tata Ace EV (Electric Commercial)',
    vehicleNumber: '',
    state: 'Tamil Nadu',
    city: 'Chennai',
    serviceArea: 'Metropolitan Zone'
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const cities = MAJOR_CITIES_BY_STATE[newState] || [];
    setFormData(prev => ({
      ...prev,
      state: newState,
      city: cities[0]?.name || ''
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.vehicleNumber) {
      setError("Please fill out all required driver and vehicle fields.");
      return;
    }

    if (createTransportAccountByAdmin) {
      const authRes = createTransportAccountByAdmin(formData);
      if (!authRes?.success) {
        setError(authRes?.error || "Failed to create account");
        return;
      }
    }

    if (addTransportUser) {
      addTransportUser(formData);
    }

    setShowAddModal(false);
    setFormData({
      transportId: `TRANS00${safeTransportUsers.length + 2}`,
      password: 'Eco@123',
      name: '',
      driverName: '',
      phone: '',
      vehicleType: 'Tata Ace EV (Electric Commercial)',
      vehicleNumber: '',
      state: 'Tamil Nadu',
      city: 'Chennai',
      serviceArea: 'Metropolitan Zone'
    });
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignOrderId || !selectedDriverForAssign) return;

    if (assignTransportToOrder) {
      assignTransportToOrder(assignOrderId, selectedDriverForAssign.transportId);
    }
    setSelectedDriverForAssign(null);
    setAssignOrderId('');
  };

  const unassignedOrders = safeOrders.filter(o => !o.transportId || o.status === 'Pending' || o.status === 'Confirmed');

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Transportation Management (Admin Only)" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/30">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-tight">Admin Transportation Account Generator & Logistics</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Public self-registration for Transportation is strictly disabled. Create and assign official Transport IDs and passwords below.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Transport Account</span>
            </button>
          </div>

          {/* Transport Fleet Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Active EV Fleet & Transport Accounts</h3>
                <p className="text-xs text-slate-500">Authorized transportation drivers operating across Indian logistics corridors</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-extrabold bg-cyan-50 text-cyan-800 rounded-full border border-cyan-200">
                {safeTransportUsers.length} Fleet Users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Transport ID</th>
                    <th className="p-4">Transport / Driver</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Vehicle Details</th>
                    <th className="p-4">State & City</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Trips</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeTransportUsers.map((user) => (
                    <tr key={user.id || user.transportId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-extrabold text-cyan-700">
                        {user.transportId}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500">Driver: {user.driverName || user.name}</p>
                      </td>
                      <td className="p-4 font-medium">{user.phone}</td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{user.vehicleType}</p>
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 rounded border border-slate-300">
                          {user.vehicleNumber}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-slate-800">{user.city}</p>
                        <p className="text-[10px] text-slate-500">{user.state}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{user.completedOrdersCount || 0} Done</p>
                        <p className="text-[10px] text-cyan-600 font-semibold">{user.assignedOrdersCount || 0} Assigned</p>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDriverForAssign(user)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200 transition-all cursor-pointer"
                        >
                          Assign Order
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleTransportStatus && toggleTransportStatus(user.transportId)}
                          className={`px-2.5 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                            user.status === 'Active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {user.status === 'Active' ? 'Disable' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Add Transportation Account */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-600" />
                <h3 className="font-extrabold text-lg text-slate-900">Create Transportation Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Generated Transport ID *</label>
                  <input
                    type="text"
                    name="transportId"
                    value={formData.transportId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-cyan-700 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Password *</label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / Transport Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Transport Services"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    placeholder="Ramesh Kumar"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Driver Phone (+91) *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98401 99887"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Plate Number *</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="TN 09 CB 4512"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Model / EV Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Tata Ace EV (Electric Commercial)">Tata Ace EV (Electric Commercial)</option>
                  <option value="Mahindra Zor Grand EV">Mahindra Zor Grand EV</option>
                  <option value="Eicher Pro 2049 EV Truck">Eicher Pro 2049 EV Truck</option>
                  <option value="Piaggio Ape E-Xtra Cargo">Piaggio Ape E-Xtra Cargo</option>
                  <option value="Heavy Industrial Tipper Truck">Heavy Industrial Tipper Truck</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / District *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Chennai"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Save & Issue Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Order to Driver */}
      {selectedDriverForAssign && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Assign Order to {selectedDriverForAssign.name} ({selectedDriverForAssign.transportId})
              </h3>
              <button onClick={() => setSelectedDriverForAssign(null)} className="font-bold text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Pending Order</label>
                {unassignedOrders.length > 0 ? (
                  <select
                    value={assignOrderId}
                    onChange={(e) => setAssignOrderId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="">-- Choose Order --</option>
                    {unassignedOrders.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.productTitle} ({o.quantityKg} kg) - ₹{o.totalPrice}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="p-3 bg-amber-50 text-amber-800 rounded-xl font-medium">All active orders already have transport assigned!</p>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDriverForAssign(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!assignOrderId}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportManagement;
