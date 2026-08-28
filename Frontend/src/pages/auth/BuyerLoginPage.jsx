import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from '../../components/common/EcoMartLogo';
import DemoCredentialsBox from '../../components/common/DemoCredentialsBox';
import { ShoppingBag, Mail, Lock, ArrowRight, Store, Truck, ShieldAlert } from 'lucide-react';

export const BuyerLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('buyer@ecomart.in');
  const [password, setPassword] = useState('Buyer@123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(email, password, 'BUYER');
    if (res.success) {
      navigate('/buyer/dashboard');
    } else {
      setErrorMsg(res.error || "Invalid Buyer credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl text-white">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <EcoMartLogo size="md" showTagline={true} className="mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span>Buyer Portal</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-2">Welcome Back, Recycler Buyer</h2>
          <p className="text-xs text-slate-400 mt-1">Browse verified scrap listings & order green raw materials</p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-2xl text-center flex items-center justify-center gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Buyer Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@ecomart.in"
                required
                className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 text-white outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 text-white outline-hidden transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/60 active:scale-[0.99]"
          >
            <span>Buyer Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2 text-center text-xs text-slate-400">
          <p>Don't have a Buyer account? <Link to="/register" className="text-emerald-400 font-bold hover:underline">Register Now</Link></p>
          <div className="flex justify-center gap-4 text-[11px] text-slate-500 pt-1">
            <Link to="/seller/login" className="hover:text-amber-400 flex items-center gap-1">
              <Store className="w-3 h-3" /> Seller Login
            </Link>
            <span>•</span>
            <Link to="/transport/login" className="hover:text-indigo-400 flex items-center gap-1">
              <Truck className="w-3 h-3" /> Transport Partner
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mt-6 relative z-10">
        <DemoCredentialsBox />
      </div>
    </div>
  );
};

export default BuyerLoginPage;
