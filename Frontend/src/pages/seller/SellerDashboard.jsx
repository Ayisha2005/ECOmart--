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
  const { products = [], orders = [], updateOrderStatus } = useData();

  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const myProducts = safeProducts.filter(p => p.sellerId === currentUser?.id || p.sellerName === currentUser?.name);
  const myOrders = safeOrders.filter(o => o.sellerId === currentUser?.id || o.sellerName === currentUser?.name);
  
  const totalEarnings = myOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = myOrders.filter(o => o.status === 'Pending');

  return (
    <div className="flex min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Sidebar role="SELLER" />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Navbar title="Seller Dashboard" />

        {/* Scrollable Main Container */}
        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-extrabold tracking-tight">Welcome, {currentUser?.name || 'Eco Seller'}</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Manage your eco waste listings, request EV pickups, and monitor scrap sales earnings across India.
              </p>
            </div>

            <Link
              to="/seller/add-product"
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer relative z-10"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Create Listing (AI Scan)</span>
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">My Listings</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">{myProducts.length}</h3>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">Active on Marketplace</p>
              </div>
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Earnings</p>
                <h3 className="text-2xl font-extrabold text-amber-400 mt-1">₹{totalEarnings.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Direct Bank / UPI</p>
              </div>
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Pending Requests</p>
                <h3 className="text-2xl font-extrabold text-rose-400 mt-1">{pendingOrders.length}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Awaiting Acceptance</p>
              </div>
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Orders</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">{myOrders.length}</h3>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">Fulfilled Orders</p>
              </div>
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Pending Pickup Requests Table / Cards */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">Incoming Buyer Orders & Pickup Requests</h3>
                <p className="text-xs text-slate-400">Accept orders to dispatch ECO MART 3rd-party logistics drivers</p>
              </div>
            </div>

            <div className="divide-y divide-slate-800">
              {myOrders.length > 0 ? (
                myOrders.map(order => (
                  <div key={order.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-300">{order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          order.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{order.productTitle}</h4>
                      <p className="text-xs text-slate-400">Buyer: <span className="font-semibold text-slate-200">{order.buyerName}</span> ({order.buyerAddress})</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-amber-400">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{order.quantityKg} kg Tonnage</p>
                      </div>

                      {order.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                          className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                        >
                          Accept & Confirm Order
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
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
