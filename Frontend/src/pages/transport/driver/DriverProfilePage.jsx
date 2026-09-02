import React, { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DriverSidebar from '../../../components/common/DriverSidebar';
import Navbar from '../../../components/common/Navbar';
import { User, Camera, ShieldCheck, Save, CheckCircle2, Truck, Phone, FileText, Star } from 'lucide-react';

export const DriverProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);

  const authenticatedDriverId = currentUser?.driverId || currentUser?.transportId || currentUser?.id || 'DRV001';

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Driver',
    phone: currentUser?.phone || '+91 98401 00000',
    licenseNumber: currentUser?.licenseNumber || 'TN-01-2022-8765432',
    assignedVehicleNumber: currentUser?.assignedVehicleNumber || 'TN 01 AB 1234',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    companyName: currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd'
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiService.getDriverProfile(authenticatedDriverId);
        if (res?.driver) {
          setProfileData({
            name: res.driver.name || currentUser?.name || 'Driver',
            phone: res.driver.phone || currentUser?.phone || '+91 98401 00000',
            licenseNumber: res.driver.licenseNumber || currentUser?.licenseNumber || 'TN-01-2022-8765432',
            assignedVehicleNumber: res.driver.assignedVehicleNumber || currentUser?.assignedVehicleNumber || 'TN 01 AB 1234',
            avatar: res.driver.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            companyName: res.driver.companyName || currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd'
          });
        }
      } catch (err) {
        console.warn("Could not load dynamic driver profile:", err);
      }
    }
    loadProfile();
  }, [authenticatedDriverId, currentUser]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, avatar: url }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile(profileData);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar title="Driver Account Profile & Vehicle Settings" />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-extrabold tracking-wide">Driver Profile & Lorry Credentials</h2>
              </div>
              <p className="text-xs text-slate-300">
                Manage personal profile photo, verified phone number, driving license, and assigned vehicle details.
              </p>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-4 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-2xl border border-emerald-500/40 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Driver profile credentials updated successfully!</span>
            </div>
          )}

          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-xl max-w-2xl">
            <div className="flex items-center gap-5">
              <img
                src={profileData.avatar}
                alt="Driver Photo"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg"
              />
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-extrabold text-xs rounded-xl border border-slate-700 cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Upload Profile Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-[10px] text-slate-400 font-medium">JPEG or PNG. Maximum 5MB</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driver Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driver ID</label>
                  <input
                    type="text"
                    value={currentUser?.driverId || currentUser?.transportId || 'DRV001'}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-cyan-400 font-mono font-bold cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile Phone Number *</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driving License Number *</label>
                  <input
                    type="text"
                    value={profileData.licenseNumber}
                    onChange={(e) => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Lorry Plate *</label>
                  <input
                    type="text"
                    value={profileData.assignedVehicleNumber}
                    onChange={(e) => setProfileData(prev => ({ ...prev, assignedVehicleNumber: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono font-bold focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Logistics Partner Company</label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-medium focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-950/60 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Save Driver Profile Settings</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverProfilePage;
