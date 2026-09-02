import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { INDIAN_STATES, MAJOR_CITIES_BY_STATE } from '../../data/indianLocations';
import {
  Package,
  PlusCircle,
  ArrowLeft,
  Camera,
  Trash2,
  CheckCircle,
  MapPin,
  Box,
  ArrowRight
} from 'lucide-react';

export const AddProductPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addProduct } = useData();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'plastic',
    description: '',
    weightKg: 100,
    price: 3500,
    condition: 'Inspected Scrap',
    state: currentUser?.state || 'Tamil Nadu',
    city: currentUser?.city || 'Chennai',
    pincode: currentUser?.pincode || '600001',
    address: currentUser?.address || 'Guindy Industrial Estate Zone 1'
  });

  const [selectedImage, setSelectedImage] = useState(
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
  );
  const [imageFileName, setImageFileName] = useState('scrap_material_sample.jpg');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("File size exceeds 10MB limit. Please upload a smaller photo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImageFileName(file.name);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg("Please enter a valid product / scrap name.");
      return;
    }
    if (!formData.weightKg || Number(formData.weightKg) <= 0) {
      setErrorMsg("Please enter a valid quantity / weight in kg.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg("Please enter a valid selling price in INR.");
      return;
    }
    if (!selectedImage) {
      setErrorMsg("Please upload a photo of your scrap material.");
      return;
    }

    const newProduct = {
      ...formData,
      weightKg: Number(formData.weightKg),
      price: Number(formData.price),
      images: [selectedImage]
    };

    addProduct(newProduct, currentUser);
    navigate('/seller/listings');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar with active SELLER workspace */}
      <Sidebar role="SELLER" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Add Product / Scrap Listing" />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-5xl mx-auto w-full custom-scrollbar space-y-5">
          
          {/* Top Bar Navigation & Manual Badge */}
          <div className="flex items-center justify-between">
            <Link
              to="/seller/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to Dashboard</span>
            </Link>

            <span className="px-3.5 py-1.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold shadow-md">
              Manual Product Listing
            </span>
          </div>

          {/* Main Card Container (Matching Reference Screenshot 2) */}
          <div className="bg-slate-900/90 rounded-3xl p-5 md:p-8 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-xl">
            
            {/* Card Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-wide">Create Scrap Listing</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter your product details manually and upload a photo of your scrap material.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-2xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* UPLOAD SCRAP MATERIAL PHOTO SECTION */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Upload Scrap Material Photo *
                </label>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Large Dashed Dropzone */}
                  <div className="md:col-span-7">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 bg-slate-950/60 hover:bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[160px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors">
                        Click to Upload Scrap Photo
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Image Preview Thumbnail (Right Side) */}
                  <div className="md:col-span-5 flex justify-center md:justify-end">
                    {selectedImage ? (
                      <div className="relative w-full max-w-[280px] h-[160px] rounded-2xl overflow-hidden border border-slate-700 shadow-xl group">
                        <img
                          src={selectedImage}
                          alt="Scrap Preview"
                          className="w-full h-full object-cover"
                        />
                        {/* Red Delete Button Top Right */}
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {/* Photo Attached Indicator Bottom Left */}
                        <div className="absolute bottom-2.5 left-2.5 px-3 py-1 bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Photo Attached</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-[280px] h-[160px] rounded-2xl border border-slate-800 bg-slate-950/40 flex items-center justify-center text-xs text-slate-500 font-medium">
                        No Photo Selected
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* PRODUCT FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Product Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Product / Scrap Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Industrial PET Plastic Scrap Bales"
                    required
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden transition-all placeholder:text-slate-500"
                  />
                </div>

                {/* 2. Recyclable Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Recyclable Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden cursor-pointer"
                  >
                    <option value="plastic" className="bg-slate-900 text-white">Plastic</option>
                    <option value="paper" className="bg-slate-900 text-white">Paper & Cardboard</option>
                    <option value="metal" className="bg-slate-900 text-white">Metal & Alloys</option>
                    <option value="ewaste" className="bg-slate-900 text-white">E-Waste & Electronics</option>
                    <option value="glass" className="bg-slate-900 text-white">Glass Scrap</option>
                    <option value="rubber" className="bg-slate-900 text-white">Rubber & Tyres</option>
                    <option value="textile" className="bg-slate-900 text-white">Textile & Fabric</option>
                    <option value="other" className="bg-slate-900 text-white">Other Industrial Scrap</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 3. Quantity / Weight (kg) */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Quantity / Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weightKg"
                    value={formData.weightKg}
                    onChange={handleChange}
                    placeholder="100"
                    min="1"
                    required
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-extrabold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                {/* 4. Selling Price (INR ₹) */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Selling Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="3500"
                    min="1"
                    required
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-extrabold text-amber-400 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

              </div>

              {/* 5. Material Condition / Quality Grade */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Material Condition / Quality Grade
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden cursor-pointer"
                >
                  <option value="Inspected Scrap" className="bg-slate-900 text-white">Inspected Scrap</option>
                  <option value="Raw Bales" className="bg-slate-900 text-white">Raw Bales</option>
                  <option value="Sorted & Cleaned" className="bg-slate-900 text-white">Sorted & Cleaned</option>
                  <option value="Industrial Waste" className="bg-slate-900 text-white">Industrial Waste</option>
                  <option value="Unsorted Mixed Scrap" className="bg-slate-900 text-white">Unsorted Mixed Scrap</option>
                </select>
              </div>

              {/* 6. Detailed Item Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Detailed Item Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe material purity, moisture level, compression state, and pickup accessibility..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed"
                />
              </div>

              {/* Location Information */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Pickup Location (India Only)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleStateChange}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden cursor-pointer"
                    >
                      {INDIAN_STATES.map(s => (
                        <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">District / City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Chennai"
                      required
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="600001"
                      maxLength={6}
                      required
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Address / Industrial Area</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Plot No / Street / Zone"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <span>CREATE SCRAP LISTING</span>
                <ArrowRight className="w-4.5 h-4.5 text-slate-950" />
              </button>

            </form>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AddProductPage;
