import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { ShoppingCart, Truck, CheckCircle2, Clock, Send, Building2 } from 'lucide-react';

export const AdminOrders = () => {
  const { orders = [], updateOrderStatus, partners = [], assignPartnerToOrder } = useData();

  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderForAssign || !selectedPartnerId) return;

    assignPartnerToOrder(selectedOrderForAssign.id, selectedPartnerId);
    setSelectedOrderForAssign(null);
    setSelectedPartnerId('');
  };

  return (
    <div className="flex min-h-screen bg-slate-100 overflow-x-hidden">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title="Orders & Logistics Control (Admin Oversight)" />

        <main className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                <span>Pan-India Marketplace Orders & Partner Dispatch</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Assign orders to 3rd-party Transportation Partner Companies. Monitor partner responses, driver dispatches, and live delivery status.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Product / Scrap</th>
                    <th className="p-4">Seller</th>
                    <th className="p-4">Buyer</th>
                    <th className="p-4">Assigned Partner Company</th>
                    <th className="p-4">Driver & Lorry (Read-Only)</th>
                    <th className="p-4">Request Status</th>
                    <th className="p-4 text-right">Assign Partner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(orders || []).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-extrabold text-cyan-700">{ord.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{ord.productTitle}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{ord.quantityKg} kg • ₹{ord.totalPrice}</p>
                      </td>
                      <td className="p-4 font-medium text-slate-800">{ord.sellerName}</td>
                      <td className="p-4 font-medium text-slate-800">{ord.buyerName}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {ord.transportCompanyName || 'Unassigned'}
                      </td>
                      <td className="p-4">
                        {ord.driverName ? (
                          <div>
                            <p className="font-bold text-slate-800">{ord.driverName}</p>
                            <p className="font-mono text-[10px] text-cyan-700 font-bold">{ord.vehicleNumber}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium text-[11px]">Not Dispatched Yet</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          ord.transportRequestStatus === 'TRANSPORT_REQUEST_SENT'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.transportRequestStatus === 'PARTNER_ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.transportRequestStatus === 'PARTNER_REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : ord.transportRequestStatus === 'DRIVER_ASSIGNED'
                            ? 'bg-cyan-100 text-cyan-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {ord.transportRequestStatus || ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderForAssign(ord);
                            setSelectedPartnerId(partners[0]?.id || '');
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Send className="w-3 h-3 text-cyan-400" />
                          <span>Assign Partner Company</span>
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

      {/* Assign Partner Company Modal */}
      {selectedOrderForAssign && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Assign Transportation Partner Company for {selectedOrderForAssign.id}
              </h3>
              <button onClick={() => setSelectedOrderForAssign(null)} className="font-bold text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select 3rd-Party Transportation Partner *</label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                >
                  <option value="">-- Choose Partner Company --</option>
                  {(partners || []).map(p => (
                    <option key={p.id} value={p.id}>{p.companyName} ({p.city})</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-cyan-50 text-cyan-900 rounded-xl text-[11px] leading-relaxed">
                <span className="font-bold">Business Model Enforced:</span> Admin assigns the order to the external Partner Company. The partner's Transport Manager will accept the request and dispatch their own driver and lorry.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForAssign(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedPartnerId}
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-600 text-slate-950 font-bold hover:bg-cyan-500 disabled:opacity-50"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
