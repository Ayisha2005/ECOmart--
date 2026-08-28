import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Link } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Truck,
  Users,
  Search,
  Send,
  Eye,
  Activity
} from 'lucide-react';

export const AdminTransportationPartners = () => {
  const { partners, updatePartnerStatus, orders, assignPartnerToOrder, fleetVehicles, companyDrivers } = useData();

  const [search, setSearch] = useState('');
  const [selectedPartnerForAssign, setSelectedPartnerForAssign] = useState(null);
  const [assignOrderId, setAssignOrderId] = useState('');

  const filteredPartners = (partners || []).filter(p =>
    p.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    p.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  const unassignedOrders = (orders || []).filter(o => 
    !o.transportCompanyId || o.status === 'Pending' || o.status === 'Confirmed'
  );

  const handleAssignOrderSubmit = (e) => {
    e.preventDefault();
    if (!assignOrderId || !selectedPartnerForAssign) return;

    assignPartnerToOrder(assignOrderId, selectedPartnerForAssign.id);
    setSelectedPartnerForAssign(null);
    setAssignOrderId('');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="3rd Party Transportation Partner Directory & Oversight" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/30">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-tight">External Transportation Partner Companies</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                ECO MART Admin manages business partnerships. Select partner companies to handle marketplace orders. Partners manage their own fleet and drivers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/transportation/live"
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Pan-India Live Fleet Map</span>
              </Link>
              <Link
                to="/admin/transportation-partners/add"
                className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Transportation Partner</span>
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company name, contact person, city..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-hidden"
              />
            </div>
            <span className="text-xs font-bold text-slate-600">
              {partners.length} External Partners Onboarded
            </span>
          </div>

          {/* Partner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPartners.map((partner) => {
              const companyVehicles = (fleetVehicles || []).filter(v => v.transportCompanyId === partner.id);
              const companyDriversCount = (companyDrivers || []).filter(d => d.transportCompanyId === partner.id).length;
              const companyActiveOrders = (orders || []).filter(o => o.transportCompanyId === partner.id);

              return (
                <div key={partner.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900">{partner.companyName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          partner.partnerStatus === 'ACTIVE' || partner.partnerStatus === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : partner.partnerStatus === 'PENDING_ACCEPTANCE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {partner.partnerStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">Reg: {partner.registrationNo || 'GST-IN-9901'}</p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-cyan-50 text-cyan-800 rounded-lg border border-cyan-200">
                      {partner.agreementStatus || 'Verified Partner'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Contact Person</p>
                      <p className="font-bold text-slate-900">{partner.contactPerson}</p>
                      <p className="text-slate-500">{partner.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Base Location</p>
                      <p className="font-bold text-slate-900">{partner.city}, {partner.state}</p>
                      <p className="text-slate-500 truncate">{partner.serviceAreas}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Fleet Monitored</p>
                      <p className="font-extrabold text-cyan-700">{companyVehicles.length || partner.numberOfVehicles || 0} Lorries / Trucks</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Assigned Orders</p>
                      <p className="font-extrabold text-emerald-700">{companyActiveOrders.length} Orders Handled</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPartnerForAssign(partner)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Order Assignment</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => updatePartnerStatus(partner.id, partner.partnerStatus === 'ACTIVE' || partner.partnerStatus === 'Active' ? 'SUSPENDED' : 'ACTIVE')}
                      className={`px-2 py-1 text-xs font-bold rounded-lg ${
                        partner.partnerStatus === 'ACTIVE' || partner.partnerStatus === 'Active'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {partner.partnerStatus === 'ACTIVE' || partner.partnerStatus === 'Active' ? 'Suspend Partner' : 'Reactivate Partner'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Assign Order Modal */}
      {selectedPartnerForAssign && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Assign Order to {selectedPartnerForAssign.companyName}
              </h3>
              <button onClick={() => setSelectedPartnerForAssign(null)} className="font-bold text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAssignOrderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Marketplace Order Requirement</label>
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
                  <p className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-medium">All active marketplace orders already have a transportation partner assigned!</p>
                )}
              </div>

              <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-slate-700 text-[11px] leading-relaxed">
                <span className="font-bold text-cyan-900">Partner Business Rule:</span> Admin selects the Transportation Partner Company ({selectedPartnerForAssign.companyName}). The partner's Transport Manager will accept the order and assign their own driver & lorry.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPartnerForAssign(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!assignOrderId}
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-600 text-slate-950 font-bold hover:bg-cyan-500 disabled:opacity-50"
                >
                  Send Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransportationPartners;
