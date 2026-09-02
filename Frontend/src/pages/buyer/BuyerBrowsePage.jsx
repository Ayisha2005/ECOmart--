import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Search, ShoppingBag, MapPin, Filter } from 'lucide-react';
import { ECO_CATEGORIES } from '../../data/initialData';

export const BuyerBrowsePage = () => {
  const { currentUser } = useAuth();
  const { products = [], placeOrder } = useData();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const categoriesList = ECO_CATEGORIES || [];

  const filteredProducts = (products || []).filter(p => {
    const isApproved = p?.approvalStatus === 'APPROVED';
    const title = (p?.title || '').toLowerCase();
    const desc = (p?.description || '').toLowerCase();
    const matchesSearch = title.includes(search.toLowerCase()) || desc.includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p?.category === selectedCat;
    return isApproved && matchesSearch && matchesCat;
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="BUYER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Browse Recyclable Marketplace Catalog" />

        <main className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          {/* Controls */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recyclable scrap, PET plastic, corrugated paper, circuit boards..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full md:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 capitalize"
              >
                <option value="all">All Categories ({products.length})</option>
                {categoriesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((prod) => {
              const mainImg = prod.images && prod.images.length > 0 ? prod.images[0] : "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80";
              const priceVal = Number(prod.price || 0);

              return (
                <div key={prod.id || Math.random()} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img src={mainImg} alt={prod.title || 'Scrap Item'} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold bg-slate-900/90 text-white rounded-full uppercase">
                        {prod.categoryLabel || prod.category || 'Recyclable'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm">{prod.title || 'Recyclable Scrap Material'}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{prod.description || 'Quality inspected industrial recyclable material.'}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold pt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{prod.city || 'Chennai'}, {prod.state || 'Tamil Nadu'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Asking Price</p>
                      <p className="text-base font-extrabold text-emerald-700">₹{priceVal.toLocaleString('en-IN')}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => placeOrder(prod, currentUser)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-lime-400" />
                      <span>Buy Material</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyerBrowsePage;
