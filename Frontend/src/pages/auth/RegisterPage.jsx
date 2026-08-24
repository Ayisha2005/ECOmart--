import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from '../../components/common/EcoMartLogo';
import DemoCredentialsBox from '../../components/common/DemoCredentialsBox';
import { INDIAN_STATES, MAJOR_CITIES_BY_STATE } from '../../data/indianLocations';
import { Store, ShoppingBag, ShieldCheck, ArrowRight, Truck, Lock, Phone, Mail, User } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerSellerBuyer } = useAuth();

  const [selectedRole, setSelectedRole] = useState('SELLER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    state: 'Tamil Nadu',
    city: 'Chennai',
    pincode: '',
    agreedTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const cities = MAJOR_CITIES_BY_STATE[newState] || [];
    setFormData(prev => ({
      ...prev,
      state: newState,
      city: cities[0]?.name || ''
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full Name is required";
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = "Valid email is required";
    
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (phoneClean.length < 10) errs.phone = "Valid 10-digit Indian mobile number required";

    if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!formData.pincode.trim() || formData.pincode.length < 6) errs.pincode = "Valid 6-digit Indian Pincode required";
    if (!formData.agreedTerms) errs.agreedTerms = "You must agree to Terms & Conditions";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = registerSellerBuyer(formData, selectedRole);
    if (res.success) {
      if (selectedRole === 'SELLER') {
        navigate('/seller/login');
      } else {
        navigate('/buyer/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-800">
        
        {/* Left Visual Branding Side */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <EcoMartLogo size="lg" showTagline={true} className="mb-8" />

            <div className="space-y-4 my-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                India's Premier Eco Marketplace & Green Logistics Platform
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect directly as a verified Seller or Buyer. Trade recyclable materials, manage industrial scrap, and dispatch 3rd-party logistics fleets across Indian cities.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-lime-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Strict Role-Based Authorization</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-lime-400">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">3rd Party Transport Partner Network</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-lime-400">
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200">AI Scrap Pricing & OpenStreetMap Tracking</span>
              </div>
            </div>

            {/* Demo Login Credentials Box */}
            <div className="mt-6">
              <DemoCredentialsBox />
            </div>

          </div>
        </div>

        {/* Right Form Side */}
        <div className="lg:col-span-7 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Create your ECO MART account</h2>
            <p className="text-xs text-slate-500 mt-1">Select your role to get started with India-only eco trading</p>
          </div>

          {/* Role Toggle Selector */}
          <div className="mb-6 bg-slate-100 p-1.5 rounded-2xl grid grid-cols-2 gap-2 border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedRole('SELLER')}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'SELLER'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>I want to SELL</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('BUYER')}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'BUYER'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-lime-400" />
              <span>I want to BUY</span>
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (India +91) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 600001"
                  maxLength={6}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
                {errors.pincode && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State (Fixed: India) *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District / City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Chennai"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Address / Industrial Area</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Plot No / Street / Zone"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                {errors.password && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="agreedTerms"
                name="agreedTerms"
                checked={formData.agreedTerms}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="agreedTerms" className="text-xs text-slate-600 font-medium">
                I agree to the <span className="font-bold text-slate-900">ECO MART India Terms of Service</span> & Privacy Policy
              </label>
            </div>
            {errors.agreedTerms && <p className="text-[11px] text-rose-500 font-semibold">{errors.agreedTerms}</p>}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create {selectedRole} Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Need Platform Administration?</span>
            <Link to="/admin/register" className="font-extrabold text-amber-600 hover:text-amber-700">
              Admin Registration Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
