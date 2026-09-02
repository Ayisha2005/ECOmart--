import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import EcoMartLogo from '../../components/common/EcoMartLogo';
import { Building2, ShieldCheck, CheckCircle2, XCircle, ArrowRight, User, Mail, Phone, Lock } from 'lucide-react';

export const PartnerInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invitationCode = searchParams.get('code');

  const { partners, updatePartnerStatus } = useData();
  const { createCompanyManagerByAdmin, login } = useAuth();

  const partner = (partners || []).find(p => p.invitationCode === invitationCode || p.id === invitationCode) || partners[0];

  const [step, setStep] = useState('INVITATION'); // 'INVITATION' or 'REGISTER'
  const [managerForm, setManagerForm] = useState({
    name: partner?.contactPerson || '',
    email: partner?.email || '',
    phone: partner?.phone || '',
    password: 'Manager@123',
    confirmPassword: 'Manager@123'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManagerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAcceptClick = () => {
    setStep('REGISTER');
  };

  const handleDeclineClick = () => {
    if (partner) {
      updatePartnerStatus(partner.id, 'DECLINED');
    }
    navigate('/register');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!managerForm.name || !managerForm.email || !managerForm.password) return;

    if (partner) {
      // 1. Create Transport Manager user account in AuthContext
      createCompanyManagerByAdmin(partner, {
        managerId: `TRM-${Date.now().toString().slice(-4)}`,
        name: managerForm.name,
        email: managerForm.email,
        phone: managerForm.phone,
        password: managerForm.password
      });

      // 2. Activate partner status
      updatePartnerStatus(partner.id, 'ACTIVE');

      // 3. Authenticate and redirect to Transport Partner Dashboard
      login(managerForm.email, managerForm.password, 'TRANSPORT_MANAGER');
      navigate('/transport/partner/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl text-white space-y-6">
        <div className="flex flex-col items-center text-center">
          <EcoMartLogo size="md" showTagline={true} className="mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30 text-xs font-bold uppercase">
            <Building2 className="w-4 h-4" />
            <span>Official Transportation Partnership Invitation</span>
          </div>
        </div>

        {step === 'INVITATION' ? (
          <div className="space-y-6">
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-extrabold text-white">ECO MART Logistics Partnership Offer</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                ECO MART invites <span className="font-bold text-cyan-400">{partner?.companyName}</span> to partner with our national eco-marketplace for scrap pickup and recyclable material transportation.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Invited Company</p>
                  <p className="font-bold text-white mt-0.5">{partner?.companyName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Contact Manager</p>
                  <p className="font-bold text-white mt-0.5">{partner?.contactPerson}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Service Coverage</p>
                  <p className="font-bold text-cyan-300 mt-0.5">{partner?.city}, {partner?.state}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Requested Service</p>
                  <p className="font-bold text-emerald-400 mt-0.5">Scrap Pickup & Delivery</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeclineClick}
                className="w-1/2 py-3.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 font-bold text-xs cursor-pointer"
              >
                Decline Offer
              </button>
              <button
                type="button"
                onClick={handleAcceptClick}
                className="w-1/2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/50"
              >
                <span>Accept Partnership & Setup Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">Create Transport Manager Account</h3>
              <p className="text-xs text-slate-400">Setup manager credentials for {partner?.companyName}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Transport Manager Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  value={managerForm.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-cyan-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Business Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={managerForm.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Business Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={managerForm.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setManagerForm(prev => ({ ...prev, phone: val }));
                    }}
                    placeholder="Enter 10-digit Mobile Number"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    value={managerForm.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={managerForm.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Activate Partner Account & Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PartnerInvitationPage;
