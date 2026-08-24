import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, Trash2, Edit3, Eye } from 'lucide-react';

export const SellerListingsPage = () => {
  const { currentUser } = useAuth();
  const { products, deleteProduct } = useData();

  const myProducts = products.filter(p => p.sellerId === currentUser?.id || p.sellerName === currentUser?.name);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="SELLER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="My Scrap & Product Listings" />

        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Manage Published Listings ({myProducts.length})</h2>
              <p className="text-xs text-slate-500">Edit prices, view buyer inquiries, or add new eco listings</p>
            </div>
            <Link
              to="/seller/add-product"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-lime-400" />
              <span>Add New Product (AI Scan)</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Listing ID</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Quantity / Weight</th>
                    <th className="p-4">Asking Price</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-extrabold text-emerald-700">{prod.id}</td>
                      <td className="p-4 font-bold text-slate-900">{prod.title}</td>
                      <td className="p-4 capitalize font-semibold text-slate-700">{prod.categoryLabel || prod.category}</td>
                      <td className="p-4 font-bold text-slate-900">{prod.weightKg} kg</td>
                      <td className="p-4 font-extrabold text-emerald-700">₹{prod.price.toLocaleString('en-IN')}</td>
                      <td className="p-4 font-medium">{prod.city}, {prod.state}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => deleteProduct(prod.id)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition-all cursor-pointer"
                        >
                          Delete
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
    </div>
  );
};

export default SellerListingsPage;
