import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EcoMartLogo from '../../components/common/EcoMartLogo';
import DemoCredentialsBox from '../../components/common/DemoCredentialsBox';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@ecomart.in');
  const [password, setPassword] = useState('Admin@123');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password, 'ADMIN');
    if (res.success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-white">
        <div className="flex flex-col items-center text-center mb-6">
          <EcoMartLogo size="md" showTagline={true} className="mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full border border-rose-500/30 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Portal</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-2">ECO MART Platform Administration</h2>
          <p className="text-xs text-slate-400">Control center authentication for administrators</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecomart.in"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 text-white outline-hidden"
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
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 text-white outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-950/50"
          >
            <span>Admin Portal Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Need an Admin account? <Link to="/admin/register" className="text-amber-400 font-bold hover:underline">Register Admin</Link>
        </div>
      </div>

      <div className="w-full max-w-md mt-4">
        <DemoCredentialsBox />
      </div>
    </div>
  );
};

export default AdminLoginPage;
