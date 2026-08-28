import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import MapView from '../../components/common/MapView';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  ShoppingBag,
  Package,
  Truck,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const BuyerDashboard = () => {
  const { currentUser } = useAuth();
  const { products = [], orders = [], placeOrder, categories = [] } = useData();

  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  const filteredProducts = safeProducts.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesState = selectedState === 'all' || p.state === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

  const handleBuyNow = (product) => {
    placeOrder(product, currentUser);
  };

  const mapMarkers = filteredProducts.map(p => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    title: p.title,
    location: `${p.city}, ${p.state}`,
    price: p.price,
    type: 'seller',
    typeLabel: `${p.categoryLabel} (${p.weightKg} kg)`
  }));

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar role="BUYER" />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Buyer Marketplace & Orders" />

        {/* Scrollable Main Container */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950/50 to-slate-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-tight">Eco Waste & Recyclable Marketplace</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Source verified scrap materials, e-waste, plastic bales & metal stock from sellers across India with electric vehicle delivery.
              </p>
            </div>

            <Link
              to="/buyer/tracking"
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 relative z-10"
            >
              <Truck className="w-4 h-4 text-slate-950" />
              <span>Track Active Deliveries &rarr;</span>
            </Link>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-3 backdrop-blur-xl">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scrap name, paper bales, e-waste circuit boards..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500 text-white outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 capitalize cursor-pointer focus:ring-2 focus:ring-cyan-500 outline-hidden"
              >
                <option value="all">All Categories</option>
                {safeCategories.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* OpenStreetMap View for Buyer Discovery */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">Nearby Scrap Listings (OpenStreetMap)</h3>
                <p className="text-xs text-slate-400">Interactive geographic visualization of seller listings in India</p>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                OpenStreetMap Active
              </span>
            </div>

            <MapView markers={mapMarkers} height="340px" />
          </div>

          {/* Product Catalog Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Available Recyclable Material Listings ({filteredProducts.length})</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 transition-all backdrop-blur-xl">
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-950">
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold bg-slate-950/90 text-cyan-400 rounded-full uppercase tracking-wider backdrop-blur-md border border-cyan-500/30">
                        {product.categoryLabel}
                      </span>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-cyan-500 text-slate-950 rounded-md shadow-xs">
                        {product.weightKg} kg Tonnage
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{product.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold pt-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{product.city}, {product.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-800 flex items-center justify-between mt-2">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Listing Price</p>
                      <p className="text-base font-extrabold text-cyan-400">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBuyNow(product)}
                      className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy & Order</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;
