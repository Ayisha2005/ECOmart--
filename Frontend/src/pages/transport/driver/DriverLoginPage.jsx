import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import EcoMartLogo from '../../../components/common/EcoMartLogo';
import { Truck, Lock, KeyRound, ArrowRight, ShieldAlert } from 'lucide-react';

export const DriverLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [driverId, setDriverId] = useState('DRV001');
  const [password, setPassword] = useState('Driver@123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(driverId, password, 'TRANSPORT_DRIVER');
    if (res && res.success) {
      navigate('/transport/driver/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl text-white">
        <div className="flex flex-col items-center text-center mb-6">
          <EcoMartLogo size="md" showTagline={true} className="mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30 text-xs font-bold uppercase">
            <Truck className="w-4 h-4" />
            <span>Driver Mobile Portal</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-2">Truck Driver Login</h2>
          <p className="text-xs text-slate-400">Log in with credentials issued by your Transport Manager</p>
        </div>

        <div className="mb-6 p-3.5 bg-cyan-950/60 border border-cyan-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-cyan-200">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-white">Manager Issued Credentials:</span> Drivers must log in using Driver ID issued by their Transportation Partner Company.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Driver ID *</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value.toUpperCase())}
                placeholder="e.g. DRV001"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-cyan-300 tracking-wider focus:ring-2 focus:ring-cyan-500 outline-hidden uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 text-white outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/50"
          >
            <span>Log In To Driver App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Return to <Link to="/register" className="text-emerald-400 font-bold hover:underline">Marketplace Registration</Link>
        </div>
      </div>
    </div>
  );
};

export default DriverLoginPage;
