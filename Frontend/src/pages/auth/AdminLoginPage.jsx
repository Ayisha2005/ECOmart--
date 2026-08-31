import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from '../../components/common/EcoMartLogo';
import DemoCredentialsBox from '../../components/common/DemoCredentialsBox';
import { ShieldCheck, Mail, Lock, ArrowRight, ShieldAlert, Store, ShoppingBag, Truck, KeyRound, Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== 'ayishaparveena36@gmail.com') {
      setErrorMsg("Access Denied: Admin Portal is strictly restricted to Super Admin AYISHA PARVEEN A (ayishaparveena36@gmail.com).");
      return;
    }

    if (securityKey.trim() !== 'Ayisha') {
      setErrorMsg("Invalid Admin Security Key! Access strictly restricted to Super Admin AYISHA PARVEEN A.");
      return;
    }

    const res = await login(email, password, 'ADMIN');
    if (res && res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res?.error || "Invalid Admin password or credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Dynamic Animated Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/30 via-slate-950 to-amber-950/30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(244,63,94,0.15)] backdrop-blur-xl text-white">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <EcoMartLogo size="md" showTagline={true} className="mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Strict Admin Control Center</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-2">ECO MART Admin Login</h2>
          <p className="text-xs text-slate-400 mt-1">Platform administrator authentication portal</p>
        </div>

        {/* Security Rule Warning Box */}
        <div className="mb-5 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <span className="font-bold text-amber-400">Super Admin Access:</span> Access strictly restricted to Super Admin AYISHA PARVEEN A.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-2xl text-center space-y-2 animate-shake">
            <div className="flex items-center justify-center gap-2 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
            
            {/* Quick Switch Links for Users */}
            <div className="pt-2 border-t border-rose-500/20 text-[11px] text-slate-300">
              <span>Switch to your user portal: </span>
              <div className="flex justify-center gap-3 mt-1 font-bold">
                <Link to="/seller/login" className="text-emerald-400 hover:underline flex items-center gap-0.5">
                  <Store className="w-3 h-3" /> Seller
                </Link>
                <Link to="/buyer/login" className="text-cyan-400 hover:underline flex items-center gap-0.5">
                  <ShoppingBag className="w-3 h-3" /> Buyer
                </Link>
                <Link to="/transport/login" className="text-indigo-400 hover:underline flex items-center gap-0.5">
                  <Truck className="w-3 h-3" /> Transport
                </Link>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Admin Email..."
                required
                className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 text-white outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 text-white outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer p-1"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Security Key *</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                placeholder="Enter Security Key..."
                required
                className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 text-white outline-hidden transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-950/60 active:scale-[0.99]"
          >
            <span>Login to Admin Control Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="w-full max-w-md mt-6 relative z-10">
        <DemoCredentialsBox />
      </div>
    </div>
  );
};

export default AdminLoginPage;
