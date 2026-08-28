import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from '../../components/common/EcoMartLogo';
import TermsModal from '../../components/common/TermsModal';
import { ShieldCheck, Lock, Mail, Phone, User, KeyRound, ArrowRight, Eye, EyeOff, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const { registerAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    securityKey: '',
    agreedTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecurityKey, setShowSecurityKey] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All required fields (*) must be filled out.");
      return;
    }

    if (!formData.securityKey.trim()) {
      setError("Admin Security Key is required for platform administrator registration.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreedTerms) {
      setError("You must read and agree to the Terms & Conditions.");
      return;
    }

    const res = registerAdmin(formData);
    if (res.success) {
      navigate('/admin/login');
    } else if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Animated Gradients & Glowing Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Glassmorphic Card Container with Smooth Scroll */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-xl text-white max-h-[95vh] overflow-y-auto custom-scrollbar">
        
        {/* Header Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <EcoMartLogo size="md" showTagline={true} className="mb-4" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 text-amber-400 rounded-full border border-amber-500/40 text-xs font-extrabold uppercase tracking-wider shadow-md">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>PLATFORM ADMIN REGISTRATION</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white mt-3">
            Create Super-User Admin Account
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted access for ECO MART platform system managers
          </p>
        </div>

        {/* Security Alert Banner */}
        <div className="mb-6 p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300">Security Key Required:</span>
            <p className="text-slate-300 leading-relaxed">
              Regular users cannot register as Admin. An official Security Key (<code className="px-1.5 py-0.5 bg-slate-950 rounded border border-amber-500/30 text-amber-400 font-mono font-bold">ECO-ADMIN-2026</code>) is required.
            </p>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-2xl text-center flex items-center justify-center gap-2 animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Admin Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. System Platform Manager"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 text-white outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Official Email & Mobile Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Official Admin Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@ecomart.in"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 text-white outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number (+91) *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 00000"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 text-white outline-hidden transition-all"
                />
              </div>
            </div>
          </div>

          {/* Admin Security Key Field (CRITICAL REQUIREMENT) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-amber-400 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                Admin Security Authorization Key *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Secret Key: ECO-ADMIN-2026</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-500 absolute left-3.5 top-3.5" />
              <input
                type={showSecurityKey ? "text" : "password"}
                name="securityKey"
                value={formData.securityKey}
                onChange={handleChange}
                placeholder="Enter Authorization Key (e.g. ECO-ADMIN-2026)"
                required
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-amber-500/50 rounded-xl text-sm font-mono font-bold text-amber-300 focus:ring-2 focus:ring-amber-400 outline-hidden tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowSecurityKey(!showSecurityKey)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-amber-400 cursor-pointer"
              >
                {showSecurityKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 text-white outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 text-white outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-amber-400 cursor-pointer"
                  title={showConfirmPassword ? "Hide Password" : "Show Password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Checkbox & Read Modal Link */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="agreedTermsAdmin"
                name="agreedTerms"
                checked={formData.agreedTerms}
                onChange={handleChange}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500 border-slate-700 bg-slate-900 cursor-pointer accent-amber-500"
              />
              <label htmlFor="agreedTermsAdmin" className="text-xs text-slate-300 font-medium leading-tight cursor-pointer">
                I have read and agree to the <span className="font-bold text-amber-400">ECO MART Platform Admin Terms</span> & Data Privacy Policy.
              </label>
            </div>
            
            <div className="pl-7">
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Read Full Terms & Conditions Document →</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/60 active:scale-[0.99]"
          >
            <span>Register Admin Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>Already registered as Admin?</span>
          <Link to="/admin/login" className="text-amber-400 font-extrabold hover:underline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal Login →</span>
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Link to="/register" className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">
            ← Switch to User Marketplace Registration (Seller / Buyer)
          </Link>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => setFormData(prev => ({ ...prev, agreedTerms: true }))}
      />
    </div>
  );
};

export default AdminRegisterPage;
