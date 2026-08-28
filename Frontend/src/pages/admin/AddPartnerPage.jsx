import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { INDIAN_STATES, MAJOR_CITIES_BY_STATE } from '../../data/indianLocations';
import { Building2, ArrowLeft, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AddPartnerPage = () => {
  const navigate = useNavigate();
  const { addPartnerCompany } = useData();

  const [formData, setFormData] = useState({
    companyName: '',
    registrationNo: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    state: 'Tamil Nadu',
    city: 'Chennai',
    pincode: '600032',
    serviceAreas: 'Metropolitan & Surrounding Industrial Belts',
    transportationType: 'Electric Mini Commercials & Heavy Tippers',
    partnershipNotes: 'Requested for primary Chennai eco corridor pickup & delivery'
  });

  const [createdPartner, setCreatedPartner] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactPerson || !formData.phone || !formData.email) return;

    // Creates company partnership invitation with PENDING_ACCEPTANCE status
    const newPartner = addPartnerCompany({
      ...formData,
      numberOfVehicles: 0,
      numberOfDrivers: 0
    });

    setCreatedPartner(newPartner);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar role="ADMIN" />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Add 3rd-Party Transportation Partner Company" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl mx-auto w-full custom-scrollbar">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin/transportation-partners')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Partners List</span>
            </button>
          </div>

          {!createdPartner ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Add Transportation Partner Company</h3>
                    <p className="text-xs text-slate-500">ECO MART Admin creates company partnership record. External partner receives invitation to activate account.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Registered Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. GreenRoute Logistics Pvt Ltd"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registration / GST Number</label>
                  <input
                    type="text"
                    name="registrationNo"
                    value={formData.registrationNo}
                    onChange={handleChange}
                    placeholder="e.g. TN-LOG-2026-9901"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-cyan-500 outline-hidden uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Manager Name *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Santhosh Kumar"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Phone (+91) *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98401 11223"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@greenroute.in"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Headquarters City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Coverage Zones</label>
                  <input
                    type="text"
                    name="serviceAreas"
                    value={formData.serviceAreas}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Send Partnership Invitation</span>
              </button>
            </form>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Partnership Invitation Generated!</h3>
                <p className="text-xs text-slate-500 mt-1">Invitation code sent to {createdPartner.companyName} ({createdPartner.email}).</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <p className="font-bold text-slate-900">Invitation Summary:</p>
                <p className="font-mono text-cyan-700 font-bold">Invitation Code: {createdPartner.invitationCode}</p>
                <p className="text-slate-700 font-medium">Company: {createdPartner.companyName}</p>
                <p className="text-slate-700 font-medium">Contact: {createdPartner.contactPerson} ({createdPartner.phone})</p>
                <p className="text-emerald-700 font-bold">Partnership Status: PENDING_ACCEPTANCE</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/transportation-partners')}
                  className="w-1/2 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Return to Partners Directory
                </button>
                <a
                  href={`/transport/partner/invitation?code=${createdPartner.invitationCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-1/2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Open Partner Invitation Portal &rarr;</span>
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AddPartnerPage;
