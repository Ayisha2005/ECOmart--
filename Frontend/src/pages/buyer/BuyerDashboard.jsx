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
  const { products, orders, placeOrder, categories } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesState = selectedState === 'all' || p.state === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

  const myOrders = orders.filter(o => o.buyerId === currentUser?.id || o.buyerName === currentUser?.name);

  const handleBuyNow = (product) => {
    placeOrder(product, currentUser);
    setSelectedProductForModal(null);
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
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="BUYER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Buyer Marketplace & Orders" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-500/30">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-lime-400" />
                <h2 className="text-xl font-extrabold tracking-tight">Eco Waste & Recyclable Marketplace</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Source verified scrap materials, e-waste, plastic bales & metal stock from sellers across India with electric vehicle delivery.
              </p>
            </div>

            <Link
              to="/buyer/tracking"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Truck className="w-4 h-4 text-slate-950" />
              <span>Track Active Deliveries &rarr;</span>
            </Link>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scrap name, paper bales, e-waste circuit boards..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 capitalize"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* OpenStreetMap View for Buyer Discovery */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Nearby Scrap Listings (OpenStreetMap)</h3>
                <p className="text-xs text-slate-500">Interactive geographic visualization of seller listings in India</p>
              </div>
            </div>

            <MapView markers={mapMarkers} height="320px" />
          </div>

          {/* Product Catalog Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Available Recyclable Material Listings ({filteredProducts.length})</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold bg-slate-900/90 text-white rounded-full uppercase tracking-wider backdrop-blur-xs">
                        {product.categoryLabel}
                      </span>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded-md shadow-xs">
                        {product.weightKg} kg Tonnage
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{product.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold pt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{product.city}, {product.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Listing Price</p>
                      <p className="text-base font-extrabold text-emerald-700">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBuyNow(product)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-lime-400" />
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
