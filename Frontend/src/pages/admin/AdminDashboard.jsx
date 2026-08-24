import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import MapView from '../../components/common/MapView';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  ShoppingBag,
  Truck,
  Package,
  ShoppingCart,
  IndianRupee,
  Leaf,
  Activity,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const AdminDashboard = () => {
  const { users = [] } = useAuth();
  const { products = [], orders = [], partners = [], fleetVehicles = [], environmentalImpact = {} } = useData();

  const safeUsers = Array.isArray(users) ? users : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeFleetVehicles = Array.isArray(fleetVehicles) ? fleetVehicles : [];
  const safePartners = Array.isArray(partners) ? partners : [];

  const totalSellers = safeUsers.filter(u => u?.role === 'SELLER').length;
  const totalBuyers = safeUsers.filter(u => u?.role === 'BUYER').length;
  const totalRevenue = safeOrders.reduce((sum, o) => sum + (o?.totalPrice || 0), 0);
  const activePickups = safeOrders.filter(o => ['Transportation Assigned', 'Pickup Scheduled', 'Picked Up', 'In Transit'].includes(o?.status)).length;
  const completedDeliveries = safeOrders.filter(o => ['Delivered', 'Completed'].includes(o?.status)).length;

  const mapMarkers = [
    ...safeProducts.map(p => ({
      id: p.id,
      lat: p.lat || 13.0827,
      lng: p.lng || 80.2707,
      title: p.title || 'Eco Scrap Material',
      location: `${p.city || 'Chennai'}, ${p.state || 'TN'}`,
      price: p.price,
      type: 'seller',
      typeLabel: 'Seller Listing'
    })),
    ...safeFleetVehicles.map(v => ({
      id: v.id || v.vehicleNumber,
      lat: v.lat || 13.0827,
      lng: v.lng || 80.2707,
      title: `🚚 ${v.vehicleNumber}`,
      location: `Partner: ${v.companyName} | Driver: ${v.driverName || 'Unassigned'}`,
      type: 'transport',
      typeLabel: `${v.currentStatus} (${v.vehicleType})`
    }))
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Admin Control Center" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <h2 className="text-xl font-extrabold tracking-tight">ECO MART Platform Oversight</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Full administration control over India Sellers, Buyers, 3rd-party Transportation Partners & OpenStreetMap logistics.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/admin/transportation-partners"
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-950" />
                <span>Transportation Partners &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Users</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{safeUsers.length}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Sellers: {totalSellers} | Buyers: {totalBuyers}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Partner Fleets</p>
                <h3 className="text-2xl font-extrabold text-cyan-700 mt-1">{safePartners.length}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">{safeFleetVehicles.length} Trucks Monitored</p>
              </div>
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Active Listings</p>
                <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{safeProducts.length}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Across Indian States</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Gross Platform Volume</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Verified Escrow</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Environmental Impact Summary */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-emerald-500/30 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase">
                <Leaf className="w-4 h-4" />
                <span>Waste Recycled</span>
              </div>
              <p className="text-2xl font-extrabold mt-1">{(environmentalImpact?.totalWasteRecycledKg || 48520).toLocaleString('en-IN')} kg</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase">
                <TrendingUp className="w-4 h-4" />
                <span>CO₂ Offset Saved</span>
              </div>
              <p className="text-2xl font-extrabold mt-1">{(environmentalImpact?.co2SavedKg || 72780).toLocaleString('en-IN')} kg</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase">
                <Activity className="w-4 h-4" />
                <span>Active Pickups</span>
              </div>
              <p className="text-2xl font-extrabold mt-1">{activePickups} Orders</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed Deliveries</span>
              </div>
              <p className="text-2xl font-extrabold mt-1">{completedDeliveries} Trips</p>
            </div>
          </div>

          {/* Map Overview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Pan-India Seller & Partner Transport Fleet Map</h3>
                <p className="text-xs text-slate-500">Live locations of active scrap sellers and 3rd-party logistics trucks</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                OpenStreetMap Active
              </span>
            </div>

            <MapView markers={mapMarkers} height="360px" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
