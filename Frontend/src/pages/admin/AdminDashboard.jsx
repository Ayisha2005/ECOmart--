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
  Building2,
  Sparkles
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
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Admin Control Center" />

        {/* Scrollable Container with Custom Scrollbar */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <h2 className="text-xl font-extrabold tracking-tight">ECO MART Platform Oversight</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Full administration control over India Sellers, Buyers, 3rd-party Transportation Partners & OpenStreetMap logistics.
              </p>
            </div>
            <div className="flex gap-2 relative z-10">
              <Link
                to="/admin/transportation-partners"
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-950" />
                <span>Transportation Partners &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Users</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">{safeUsers.length}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Sellers: {totalSellers} | Buyers: {totalBuyers}</p>
              </div>
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Partner Fleets</p>
                <h3 className="text-2xl font-extrabold text-cyan-400 mt-1">{safePartners.length}</h3>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">{safeFleetVehicles.length} Trucks Monitored</p>
              </div>
              <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                <Truck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Active Listings</p>
                <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{safeProducts.length}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Across Indian States</p>
              </div>
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Gross Platform Volume</p>
                <h3 className="text-2xl font-extrabold text-amber-400 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">Verified Escrow</p>
              </div>
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Environmental Impact Summary */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-950 rounded-2xl p-6 text-white shadow-xl border border-emerald-500/30 grid grid-cols-1 md:grid-cols-4 gap-4 backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase">
                <Leaf className="w-4 h-4" />
                <span>Waste Recycled</span>
              </div>
              <p className="text-2xl font-extrabold mt-1 text-white">{(environmentalImpact?.totalWasteRecycledKg || 48520).toLocaleString('en-IN')} kg</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase">
                <TrendingUp className="w-4 h-4" />
                <span>CO₂ Offset Saved</span>
              </div>
              <p className="text-2xl font-extrabold mt-1 text-white">{(environmentalImpact?.co2SavedKg || 72780).toLocaleString('en-IN')} kg</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase">
                <Activity className="w-4 h-4" />
                <span>Active Pickups</span>
              </div>
              <p className="text-2xl font-extrabold mt-1 text-white">{activePickups} Orders</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed Deliveries</span>
              </div>
              <p className="text-2xl font-extrabold mt-1 text-white">{completedDeliveries} Trips</p>
            </div>
          </div>

          {/* Map Overview */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">Pan-India Seller & Partner Transport Fleet Map</h3>
                <p className="text-xs text-slate-400">Live locations of active scrap sellers and 3rd-party logistics trucks</p>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                OpenStreetMap Active
              </span>
            </div>

            <MapView markers={mapMarkers} height="380px" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
