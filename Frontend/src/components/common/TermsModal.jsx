import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Leaf, Lock, Scale } from 'lucide-react';

export const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const [activeTab, setActiveTab] = useState('terms');

  if (!isOpen) return null;

  const handleAccept = () => {
    if (onAccept) onAccept();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">ECO MART Platform Terms & Conditions</h3>
              <p className="text-xs text-slate-400">Legal Agreement & Environmental Compliance Standards (India 2026)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Platform Usage</span>
          </button>
          <button
            onClick={() => setActiveTab('recycling')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'recycling'
                ? 'border-lime-500 text-lime-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Recycling Compliance</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy & Security</span>
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans max-h-[50vh]">
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                1. User Account Registration & Role Integrity
              </h4>
              <p>
                By registering on ECO MART, you certify that all information provided (including Business Name, Email, Phone Number, and Pincode) is authentic and complies with laws of India.
              </p>
              <p>
                Platform Administrators reserve the right to verify user credentials and suspend accounts found violating trade regulations or engaging in hazardous misrepresentation.
              </p>

              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                2. Marketplace Transactions & Payments
              </h4>
              <p>
                Sellers are responsible for providing accurate weight, material grade (Plastic, Metal, Paper, E-waste, Rubber), and quality descriptions. Buyers agree to adhere to agreed dispatch timelines and standard weight verifications.
              </p>
            </div>
          )}

          {activeTab === 'recycling' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Leaf className="w-4 h-4 text-lime-400" />
                1. Indian Waste Management Rules Compliance
              </h4>
              <p>
                All recyclable materials traded via ECO MART must comply with the Solid Waste Management Rules 2016, E-Waste (Management) Rules 2022, and Plastic Waste Management Guidelines issued by CPCB (Central Pollution Control Board).
              </p>

              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2 pt-2">
                <Leaf className="w-4 h-4 text-lime-400" />
                2. Transportation Safety & Logistics
              </h4>
              <p>
                Trips dispatched via authorized 3rd-party Transportation Partners must follow loading limits and valid vehicle registration standards across state boundaries in India.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                1. Data Protection & Privacy Policy
              </h4>
              <p>
                ECO MART safeguards user phone numbers, emails, and address locations. Data is strictly processed for facilitating scrap trade transactions, live shipment tracking, and administrative verification.
              </p>

              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2 pt-2">
                <Lock className="w-4 h-4 text-amber-400" />
                2. Security & Access Control
              </h4>
              <p>
                Platform Admin access is guarded via strict security keys. Unauthorized login attempts to protected portals are logged for security auditing.
              </p>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Reading terms is required for account creation
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Have Read & Accept Terms</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsModal;
