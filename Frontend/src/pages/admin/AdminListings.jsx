import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Package, Search, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export const AdminListings = () => {
  const { products, deleteProduct, updateProductStatus } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredProducts = (products || []).filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(search.toLowerCase()) || (p.sellerName || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="All Listings Management (Admin Authority)" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>Marketplace Scrap & Eco Product Listings</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Review, approve, reject or disable eco listings published by verified sellers across India</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listing title or seller name..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Listing ID</th>
                    <th className="p-4">Product / Scrap</th>
                    <th className="p-4">Seller</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Quantity / Weight</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4 text-right">Super Admin Authority Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((prod) => {
                    const status = prod.approvalStatus || prod.status || 'PENDING_APPROVAL';
                    const isApproved = status === 'APPROVED';
                    const isRejected = status === 'REJECTED';

                    return (
                      <tr key={prod.id || Math.random()} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono font-extrabold text-emerald-700">{prod.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{prod.title}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{prod.condition || 'Inspected Scrap'}</p>
                        </td>
                        <td className="p-4 font-medium text-slate-800">{prod.sellerName}</td>
                        <td className="p-4 capitalize font-semibold text-slate-700">{prod.categoryLabel || prod.category}</td>
                        <td className="p-4 font-bold text-slate-900">{prod.weightKg} kg</td>
                        <td className="p-4 font-extrabold text-emerald-700">₹{Number(prod.price || 0).toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${
                            isApproved ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300' :
                            isRejected ? 'bg-rose-500/10 text-rose-700 border-rose-300' :
                            'bg-amber-500/10 text-amber-700 border-amber-300'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => updateProductStatus(prod.id, 'APPROVED')}
                            disabled={isApproved}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 ${
                              isApproved ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateProductStatus(prod.id, 'REJECTED')}
                            disabled={isRejected}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 ${
                              isRejected ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Permanently remove product listing '${prod.title}'?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
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
    </div>
  );
};

export default AdminListings;
