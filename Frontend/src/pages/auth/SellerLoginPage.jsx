import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from '../../components/common/EcoMartLogo';
import DemoCredentialsBox from '../../components/common/DemoCredentialsBox';
import { Store, Mail, Lock, ArrowRight } from 'lucide-react';

export const SellerLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('seller@ecomart.in');
  const [password, setPassword] = useState('Seller@123');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password, 'SELLER');
    if (res.success) {
      navigate('/seller/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
        <div className="flex flex-col items-center text-center mb-6">
          <EcoMartLogo size="md" showTagline={true} className="mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-xs font-bold uppercase">
            <Store className="w-4 h-4 text-amber-600" />
            <span>Seller Portal</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">Welcome back to ECO MART</h2>
          <p className="text-xs text-slate-500">Sign in to manage your eco product listings & pickup requests</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Seller Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@ecomart.in"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Seller Login</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2 text-center text-xs text-slate-500">
          <p>Don't have a Seller account? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Register Now</Link></p>
        </div>
      </div>

      <div className="w-full max-w-md mt-4">
        <DemoCredentialsBox />
      </div>
    </div>
  );
};

export default SellerLoginPage;
