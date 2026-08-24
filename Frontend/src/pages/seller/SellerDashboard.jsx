import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle2,
  IndianRupee,
  PlusCircle,
  Truck,
  Sparkles,
  Store
} from 'lucide-react';

export const SellerDashboard = () => {
  const { currentUser } = useAuth();
  const { products, orders, updateOrderStatus } = useData();

  const myProducts = products.filter(p => p.sellerId === currentUser?.id || p.sellerName === currentUser?.name);
  const myOrders = orders.filter(o => o.sellerId === currentUser?.id || o.sellerName === currentUser?.name);
  
  const totalEarnings = myOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = myOrders.filter(o => o.status === 'Pending');

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="SELLER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Seller Dashboard" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-amber-500/30">
            <div>
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-extrabold tracking-tight">Welcome, {currentUser?.name || 'Seller'}</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Manage your eco waste listings, request EV pickups, and monitor scrap sales earnings across India.
              </p>
            </div>

            <Link
              to="/seller/add-product"
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Create Listing (AI Scan)</span>
            </Link>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">My Listings</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{myProducts.length}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Active on Marketplace</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Earnings</p>
                <h3 className="text-2xl font-extrabold text-amber-600 mt-1">₹{totalEarnings.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Direct Bank / UPI</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Pending Requests</p>
                <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{pendingOrders.length}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Awaiting Acceptance</p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Orders</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{myOrders.length}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Fulfilled Orders</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Pending Pickup Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Incoming Buyer Orders & Pickup Requests</h3>
                <p className="text-xs text-slate-500">Accept orders to dispatch ECO MART EV transport drivers</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {myOrders.length > 0 ? (
                myOrders.map(order => (
                  <div key={order.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mt-1">{order.productTitle}</h4>
                      <p className="text-xs text-slate-500">Buyer: <span className="font-semibold text-slate-700">{order.buyerName}</span> ({order.buyerAddress})</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-emerald-700">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{order.quantityKg} kg Tonnage</p>
                      </div>

                      {order.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          Accept & Confirm Order
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No orders yet. Create new listings to receive buyer offers!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
