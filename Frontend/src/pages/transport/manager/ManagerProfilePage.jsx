import React, { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ManagerSidebar from '../../../components/common/ManagerSidebar';
import Navbar from '../../../components/common/Navbar';
import { Building2, ShieldCheck, MapPin, Phone, Mail, Edit3, Camera, Save, CheckCircle2, User, Award } from 'lucide-react';

const MANAGER_AVATAR_PRESETS = [
  { id: 1, label: 'Manager Photo 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: 2, label: 'Manager Photo 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 3, label: 'Manager Photo 3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  { id: 4, label: 'Manager Photo 4', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80' }
];

export const ManagerProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Santhosh Kumar (GreenRoute Manager)',
    phone: currentUser?.phone || '+91 98401 11223',
    email: currentUser?.email || 'manager@greenroute.in',
    companyName: currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd',
    city: currentUser?.city || 'Chennai',
    state: currentUser?.state || 'Tamil Nadu',
    avatar: currentUser?.avatar || MANAGER_AVATAR_PRESETS[0].url
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar: photoUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        companyName: formData.companyName,
        city: formData.city,
        state: formData.state,
        avatar: formData.avatar
      });
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  const avatarPhoto = currentUser?.avatar || formData.avatar;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Company Logistics Partner Profile" />

        <main className="p-6 space-y-6 overflow-y-auto max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            
            {/* Header Banner & Avatar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={avatarPhoto}
                  alt={currentUser?.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500 shadow-md"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.companyName || formData.companyName}</h2>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-cyan-100 text-cyan-800 rounded-full uppercase">
                      Verified Partner
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-cyan-600" />
                    <span>Manager: {currentUser?.name || formData.name}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Transport ID: {currentUser?.transportId || currentUser?.driverId || 'TRM001'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Manager Profile'}</span>
              </button>
            </div>

            {saveSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Transport Manager Profile updated successfully! Live synced across workspace.</span>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                {/* Photo Picker */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Manager Avatar Photo</label>
                  
                  <div className="flex items-center gap-4">
                    <img
                      src={formData.avatar}
                      alt="Manager Avatar Preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-md shrink-0"
                    />

                    <div className="space-y-2 flex-1 min-w-0">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Upload Custom Photo</span>
                      </button>
                      <p className="text-[10px] text-slate-500">Upload a clear photo for profile identity verification</p>
                    </div>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Manager Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Logistics Company Name *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-cyan-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone (+91) *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City / District *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-teal-900 to-cyan-900 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 transition-opacity"
                >
                  <Save className="w-4 h-4 text-cyan-400" />
                  <span>Save Manager Profile Changes</span>
                </button>
              </form>
            ) : (
              /* Read-only View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Contact Manager</label>
                    <p className="font-extrabold text-slate-900 text-sm">{currentUser?.name || formData.name}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Official Email</label>
                    <p className="font-bold text-slate-800 text-sm">{currentUser?.email || formData.email}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Phone Number (+91)</label>
                    <p className="font-bold text-slate-800 text-sm">{currentUser?.phone || formData.phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Headquarters Location</label>
                    <p className="font-bold text-slate-900 text-sm">{currentUser?.city || formData.city}, {currentUser?.state || formData.state}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Transport Company ID</label>
                    <p className="font-mono font-bold text-cyan-700 text-sm">{currentUser?.transportCompanyId || 'comp-greenroute'}</p>
                  </div>
                  <div className="p-3.5 bg-cyan-50 rounded-2xl border border-cyan-200/80">
                    <label className="block text-cyan-700 font-bold uppercase text-[10px] mb-1">Logistics Status</label>
                    <p className="font-extrabold text-cyan-900 text-sm flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-600" />
                      <span>Verified 3rd Party Logistics Fleet</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerProfilePage;
