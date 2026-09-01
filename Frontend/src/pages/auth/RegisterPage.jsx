import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from '../../components/common/EcoMartLogo';
import DemoCredentialsBox from '../../components/common/DemoCredentialsBox';
import LogoSplashScreen from '../../components/common/LogoSplashScreen';
import TermsModal from '../../components/common/TermsModal';
import { INDIAN_STATES, MAJOR_CITIES_BY_STATE } from '../../data/indianLocations';
import { Store, ShoppingBag, ShieldCheck, ArrowRight, Truck, Lock, Phone, Mail, User, Sparkles, FileText, CheckCircle2, Play, Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerSellerBuyer } = useAuth();

  // Logo Splash Intro State
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('ecoMartSplashSeen');
  });

  const [selectedRole, setSelectedRole] = useState('SELLER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleSplashComplete = () => {
    sessionStorage.setItem('ecoMartSplashSeen', 'true');
    setShowSplash(false);
  };

  const handleReplayIntro = () => {
    setShowSplash(true);
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
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = "Valid email address is required";
    
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (phoneClean.length < 10) errs.phone = "Valid 10-digit Indian mobile number required";

    if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!formData.pincode.trim() || formData.pincode.length < 6) errs.pincode = "Valid 6-digit Indian Pincode required";
    if (!formData.agreedTerms) errs.agreedTerms = "You must read and agree to the Terms & Conditions";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await registerSellerBuyer(formData, selectedRole);
    if (res && res.success) {
      if (selectedRole === 'SELLER') {
        navigate('/seller/dashboard');
      } else {
        navigate('/buyer/dashboard');
      }
    }
  };

  return (
    <>
      {/* 1. Gradient Logo Intro Splash Screen */}
      {showSplash && <LogoSplashScreen onComplete={handleSplashComplete} />}

      {/* 2. Main Scrollable Register Page */}
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        
        {/* Background Ambient Cinematic Eco Video Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30 scale-105 filter blur-[1px]"
            poster="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-green-leaves-in-a-forest-4416/1080p.mp4"
              type="video/mp4"
            />
          </video>
          {/* Dynamic Glassmorphism Mesh Gradients over Ambient Video */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/60 via-transparent to-amber-950/50 pointer-events-none" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />

        {/* Top Right Header Quick Portal Links (Matching User Image 1) */}
        <div className="w-full max-w-6xl flex justify-end gap-2 mb-3 relative z-20">
          <Link
            to="/seller/login"
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Seller</span>
          </Link>

          <Link
            to="/buyer/login"
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Buyer</span>
          </Link>

          <Link
            to="/transport/login"
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-teal-400 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          >
            <Truck className="w-3.5 h-3.5 text-teal-400" />
            <span>Transport</span>
          </Link>

          <Link
            to="/transport/driver/login"
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-indigo-400 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Fleet</span>
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-6xl bg-slate-900/90 rounded-2xl sm:rounded-3xl shadow-[0_0_70px_rgba(16,185,129,0.2)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-800 backdrop-blur-xl">
          
          {/* Left Visual Branding Side with Ambient Panel Video */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950/95 via-emerald-950/90 to-slate-950 p-4 sm:p-6 md:p-10 text-white flex flex-col justify-between relative lg:max-h-[92vh] lg:overflow-y-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden">
            
            {/* Embedded Panel Video Background */}
            <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-110 filter blur-[1px]"
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-the-leaves-of-a-tree-11855-large.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-emerald-950/60" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <EcoMartLogo size="lg" showTagline={true} />
                <button
                  type="button"
                  onClick={handleReplayIntro}
                  title="Replay Logo Intro Animation"
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-emerald-400" />
                  <span className="hidden sm:inline">Replay Intro</span>
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ECO MART RECYCLING ECOSYSTEM</span>
              </div>

              <div className="space-y-4 my-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white">
                  India's Premier Eco Marketplace & Green Logistics Platform
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Connect directly as a verified Seller or Buyer. Trade recyclable materials, manage industrial scrap, and dispatch 3rd-party logistics fleets across Indian cities.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-lime-400 border border-emerald-500/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">Strict Role-Based Authorization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-lime-400 border border-emerald-500/30">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">3rd Party Transport Partner Network</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-lime-400 border border-emerald-500/30">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">AI Scrap Pricing & OpenStreetMap Tracking</span>
                </div>
              </div>

              {/* Role Portals Box */}
              <div className="mt-8">
                <DemoCredentialsBox />
              </div>
            </div>
          </div>

          {/* Right Form Side with Modern Glassmorphism & Top Logo */}
          <div className="lg:col-span-7 p-4 sm:p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-900/90 to-emerald-950/30 text-white flex flex-col justify-center lg:max-h-[92vh] lg:overflow-y-auto custom-scrollbar relative">
            
            {/* Top Form Header with Logo */}
            <div className="mb-6 flex flex-col items-start pb-4 border-b border-slate-800/80">
              <EcoMartLogo size="md" showTagline={true} className="mb-3" />
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight">Create your ECO MART account</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 uppercase">
                  India Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Select your role to get started with India-only eco trading</p>
            </div>

            {/* Ultra-Modern Role Toggle Selector */}
            <div className="mb-6 bg-slate-950/90 p-1.5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-800/90 shadow-inner">
              <button
                type="button"
                onClick={() => setSelectedRole('SELLER')}
                className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'SELLER'
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-950/80 scale-[1.01]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className={`w-4 h-4 ${selectedRole === 'SELLER' ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>I want to SELL</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('BUYER')}
                className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'BUYER'
                    ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-950/80 scale-[1.01]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 ${selectedRole === 'BUYER' ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>I want to BUY</span>
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500/80 outline-hidden transition-all placeholder:text-slate-500"
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-rose-400 font-semibold mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ayesha@gmail.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500/80 outline-hidden transition-all placeholder:text-slate-500"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-rose-400 font-semibold mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Mobile Number (India +91) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500/80 outline-hidden transition-all placeholder:text-slate-500"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-400 font-semibold mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 600001"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500/80 outline-hidden transition-all placeholder:text-slate-500"
                  />
                  {errors.pincode && <p className="text-[11px] text-rose-400 font-semibold mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">State (Fixed: India) *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500/80 outline-hidden cursor-pointer"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">District / City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Chennai"
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500/80 outline-hidden transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Address / Industrial Area</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Plot No / Street / Zone"
                  className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500/80 outline-hidden transition-all placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500/80 outline-hidden transition-all placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer p-1"
                      title={showPassword ? "Hide Password" : "Show Password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-rose-400 font-semibold mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500/80 outline-hidden transition-all placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer p-1"
                      title={showConfirmPassword ? "Hide Password" : "Show Password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] text-rose-400 font-semibold mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Terms & Conditions Box with Modal Link */}
              <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2 shadow-inner">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="agreedTerms"
                    name="agreedTerms"
                    checked={formData.agreedTerms}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 border-slate-700 bg-slate-900 cursor-pointer accent-emerald-500"
                  />
                  <label htmlFor="agreedTerms" className="text-xs text-slate-200 font-medium leading-tight cursor-pointer">
                    I agree to the <span className="font-extrabold text-white">ECO MART India Terms of Service</span> & Privacy Policy
                  </label>
                </div>

                <div className="pl-7">
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Read Full Terms & Conditions Document →</span>
                  </button>
                </div>
              </div>
              {errors.agreedTerms && <p className="text-[11px] text-rose-400 font-semibold">{errors.agreedTerms}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-950/80 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Create {selectedRole} Account</span>
                <ArrowRight className="w-4.5 h-4.5 text-slate-950" />
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span className="font-medium">Need Platform Administration?</span>
              <Link to="/admin/login" className="font-extrabold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login Portal →</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => setFormData(prev => ({ ...prev, agreedTerms: true }))}
      />
    </>
  );
};

export default RegisterPage;
