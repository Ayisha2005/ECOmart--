import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from '../../components/common/EcoMartLogo';
import DemoCredentialsBox from '../../components/common/DemoCredentialsBox';
import { Building2, ShieldAlert, Lock, ArrowRight, KeyRound, Eye, EyeOff } from 'lucide-react';

export const TransportLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [transportId, setTransportId] = useState('TRM001');
  const [password, setPassword] = useState('Manager@123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(transportId, password, 'TRANSPORT_MANAGER');
    if (res && res.success) {
      navigate('/transport/manager/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl text-white">
        <div className="flex flex-col items-center text-center mb-6">
          <EcoMartLogo size="md" showTagline={true} className="mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30 text-xs font-bold uppercase">
            <Building2 className="w-4 h-4" />
            <span>Transportation Partner Portal</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-2">ECO MART Partner Login</h2>
          <p className="text-xs text-slate-400 mt-1">For authorized external transportation companies & managers</p>
        </div>

        {/* Security & Partner Rule Notice */}
        <div className="mb-6 p-3.5 bg-cyan-950/60 border border-cyan-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-cyan-200">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-white">External Partner Access:</span> Credentials are issued by ECO MART Admin when onboarding external logistics companies. Self-registration is disabled.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Transport Manager ID / Email *</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={transportId}
                onChange={(e) => setTransportId(e.target.value)}
                placeholder="e.g. TRM001"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-cyan-300 tracking-wider focus:ring-2 focus:ring-cyan-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Access Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 text-white outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer p-1"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/50"
          >
            <span>Log In To Partner Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-1">
          <p>Truck Drivers: Use <Link to="/transport/driver/login" className="text-cyan-400 font-bold hover:underline">Driver Mobile Portal</Link></p>
          <p>Return to <Link to="/register" className="text-emerald-400 font-bold hover:underline">Marketplace Registration</Link></p>
        </div>
      </div>

      <div className="w-full max-w-md mt-4">
        <DemoCredentialsBox />
      </div>
    </div>
  );
};

export default TransportLoginPage;
