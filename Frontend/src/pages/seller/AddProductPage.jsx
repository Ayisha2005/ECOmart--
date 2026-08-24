import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import AIWasteScanner from '../../components/ai/AIWasteScanner';
import AISuggestedPrice from '../../components/ai/AISuggestedPrice';
import { INDIAN_STATES, MAJOR_CITIES_BY_STATE } from '../../data/indianLocations';
import { Package, PlusCircle, ArrowLeft, Image, MapPin, IndianRupee, Edit3, Sparkles } from 'lucide-react';

export const AddProductPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addProduct, categories } = useData();

  const [formData, setFormData] = useState({
    title: '',
    category: 'plastic',
    description: '',
    weightKg: 100,
    price: 3500,
    state: currentUser?.state || 'Tamil Nadu',
    city: currentUser?.city || 'Chennai',
    pincode: currentUser?.pincode || '600001',
    address: currentUser?.address || 'Industrial Estate Zone 1',
    condition: 'Inspected Scrap',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
  });

  const [aiAnalysis, setAiAnalysis] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const cities = MAJOR_CITIES_BY_STATE[newState] || [];
    setFormData(prev => ({
      ...prev,
      state: newState,
      city: cities[0]?.name || ''
    }));
  };

  const handleApplyAiResult = (result) => {
    setAiAnalysis(result);
    setFormData(prev => ({
      ...prev,
      title: result.name,
      category: result.category,
      weightKg: result.weight,
      price: result.recommendedPrice,
      condition: result.condition,
      description: `${result.name} - ${result.condition}.\n\n🤖 AI Vision Analysis Breakdown:\n• Category: ${result.categoryLabel}\n• Predicted Weight: ${result.weight} kg (${(result.weight / 1000).toFixed(2)} Metric Tons)\n• Estimated Item Count: ~${result.unitCount} items\n• Volume: ${result.volumeM3} m³\n• Purity Grade: ${result.purity}%\n• Market Rate: ₹${result.pricePerKg}/kg\n• Composition: ${result.breakdown}`,
      imageUrl: result.image
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.weightKg) return;

    addProduct(
      {
        ...formData,
        images: [formData.imageUrl]
      },
      currentUser
    );

    navigate('/seller/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="SELLER" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Add Product / Waste Listing" />

        <main className="p-6 space-y-6 overflow-y-auto max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              India Scrap Marketplace
            </span>
          </div>

          {/* AI Waste Scanner Module */}
          <AIWasteScanner onApplyAiResult={handleApplyAiResult} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Listing Information & Location</h3>
                <p className="text-xs text-slate-500">Manual edits allowed anytime. AI classifications can be customized.</p>
              </div>

              {aiAnalysis && (
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold rounded-xl flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Auto-Synced ({aiAnalysis.weight} kg)</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product / Scrap Name *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Compressed PET Plastic Bottles"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recyclable Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden capitalize"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* AI Suggested Price Indicator */}
            {aiAnalysis && (
              <AISuggestedPrice
                suggestedMin={aiAnalysis.suggestedPriceMin}
                suggestedMax={aiAnalysis.suggestedPriceMax}
                recommended={aiAnalysis.recommendedPrice}
                currentPrice={formData.price}
                onAcceptSuggested={(rec) => setFormData(prev => ({ ...prev, price: rec }))}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Quantity / Weight (kg) *</label>
                  {aiAnalysis && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      AI Predicted: {aiAnalysis.weight} kg (~{aiAnalysis.unitCount} units)
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Selling Price (INR ₹) *</label>
                  {aiAnalysis && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                      Rate: ₹{aiAnalysis.pricePerKg}/kg
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Item Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe material purity, moisture level, compression state, and pickup accessibility..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Pickup Address in India */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Pickup Address (India Only)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / District *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Pickup Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Plot No / Industrial Hub / Warehouse Landmark"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <PlusCircle className="w-4 h-4 text-lime-400" />
              <span>Publish Listing to Marketplace</span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddProductPage;
