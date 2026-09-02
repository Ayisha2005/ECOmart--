import React, { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import EcoMartLogo from '../../../components/common/EcoMartLogo';
import MapView from '../../../components/common/MapView';
import { Truck, CheckCircle2, LogOut, Phone, MapPin, ArrowRight, Check, User, Star, Edit3, X, Camera, ShieldCheck, Award, Upload, Save, Sparkles } from 'lucide-react';

const DRIVER_AVATAR_PRESETS = [
  { id: 1, label: 'Driver Photo 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 2, label: 'Driver Photo 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 3, label: 'Driver Photo 3', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
  { id: 4, label: 'Driver Photo 4', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' }
];

export const DriverDashboard = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const { orders, driverAcceptTrip, driverUpdateTripStatus } = useData();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Ramesh Kumar (Driver)',
    phone: currentUser?.phone || '+91 98401 99887',
    licenseNumber: currentUser?.licenseNumber || 'TN-01-2022-8765432',
    avatar: currentUser?.avatar || DRIVER_AVATAR_PRESETS[0].url,
    vehicleNumber: currentUser?.assignedVehicleNumber || 'TN 01 AB 1234 (Demo)',
    companyName: currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd',
    rating: currentUser?.rating || 4.9,
    tripsCompleted: currentUser?.tripsCompleted || 142,
    experienceYears: currentUser?.experienceYears || 6
  });

  const driverId = currentUser?.driverId || currentUser?.transportId || 'DRV001';

  const myTrips = (orders || []).filter(o => {
    const isDriverMatch = o.driverId === driverId || o.driverId === currentUser?.id || o.driverId === currentUser?.driverId;
    const isVehicleMatch = o.vehicleNumber && profileData.vehicleNumber && o.vehicleNumber.toLowerCase().replace(/\s+/g, '') === profileData.vehicleNumber.toLowerCase().replace(/\s+/g, '');
    const isPendingDriver = o.transportRequestStatus === 'DRIVER_ASSIGNED' || o.status === 'DRIVER_ASSIGNED';
    return isDriverMatch || isVehicleMatch || isPendingDriver;
  });

  const activeTrip = myTrips[0];

  const statusWorkflow = [
    { label: 'Start Pickup (En Route)', nextStatus: 'EN_ROUTE_TO_PICKUP' },
    { label: 'Arrived at Pickup', nextStatus: 'ARRIVED_AT_PICKUP' },
    { label: 'Pickup Completed', nextStatus: 'PICKUP_COMPLETED' },
    { label: 'Start Delivery (In Transit)', nextStatus: 'IN_TRANSIT' },
    { label: 'Arrived at Destination', nextStatus: 'ARRIVED_AT_DESTINATION' },
    { label: 'Mark Delivered & Complete', nextStatus: 'COMPLETED' }
  ];

  const pickupLat = Number(activeTrip?.pickupCoordinates?.[0]) || 13.0827;
  const pickupLng = Number(activeTrip?.pickupCoordinates?.[1]) || 80.2707;
  const delivLat = Number(activeTrip?.deliveryCoordinates?.[0]) || 13.1327;
  const delivLng = Number(activeTrip?.deliveryCoordinates?.[1]) || 80.3207;
  const truckLat = Number(activeTrip?.currentTransportCoordinates?.[0]) || pickupLat;
  const truckLng = Number(activeTrip?.currentTransportCoordinates?.[1]) || pickupLng;

  const mapMarkers = activeTrip ? [
    {
      id: 'pickup',
      lat: pickupLat,
      lng: pickupLng,
      title: `Pickup: ${activeTrip.sellerName || 'Seller Location'}`,
      location: activeTrip.sellerAddress || 'Seller Address',
      type: 'seller',
      typeLabel: 'Pickup Location'
    },
    {
      id: 'delivery',
      lat: delivLat,
      lng: delivLng,
      title: `Delivery: ${activeTrip.buyerName || 'Buyer Destination'}`,
      location: activeTrip.buyerAddress || 'Destination Address',
      type: 'buyer',
      typeLabel: 'Destination'
    },
    {
      id: 'truck',
      lat: truckLat,
      lng: truckLng,
      title: `My Truck: ${profileData.vehicleNumber}`,
      location: `Driver: ${profileData.name}`,
      type: 'transport',
      typeLabel: 'My Vehicle GPS'
    }
  ] : [];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, avatar: photoUrl }));
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile({
        name: profileData.name,
        phone: profileData.phone,
        licenseNumber: profileData.licenseNumber,
        assignedVehicleNumber: profileData.vehicleNumber,
        avatar: profileData.avatar,
        companyName: profileData.companyName
      });
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowProfileModal(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <EcoMartLogo size="sm" showTagline={false} />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-cyan-300 transition-all cursor-pointer"
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>Edit Driver Profile</span>
          </button>
          
          <button
            type="button"
            onClick={logout}
            className="px-3.5 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
        
        {/* Driver Profile & Vehicle Identity Card */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 p-5 md:p-6 rounded-3xl border border-cyan-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            {/* Left: Driver Avatar Photo & Details */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => setShowProfileModal(true)}>
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-xl group-hover:opacity-90 transition-all"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1 rounded-full border-2 border-slate-950 text-slate-950" title="Online & On Duty">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="absolute inset-0 bg-slate-950/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Edit3 className="w-5 h-5 text-cyan-300" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-black text-cyan-400 bg-slate-950 px-2.5 py-0.5 rounded border border-cyan-500/40 uppercase tracking-wider">
                    {driverId}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Verified Driver
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">{profileData.name}</h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <p className="flex items-center gap-1">
                    <Building2Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-200">{profileData.companyName}</span>
                  </p>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <p className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{profileData.rating} ({profileData.tripsCompleted} Trips)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Vehicle & Action Badge */}
            <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
              <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 font-mono text-left sm:text-right w-full sm:w-auto shadow-inner">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Truck</p>
                <p className="text-sm font-black text-cyan-300 tracking-wide">{profileData.vehicleNumber}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">DL: {profileData.licenseNumber}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md w-full sm:w-auto"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-950" />
                <span>Edit Profile & Photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Current Trip Control Card */}
        {activeTrip ? (
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Trip ID</span>
                <h3 className="text-lg font-extrabold text-cyan-400 font-mono">{activeTrip.id}</h3>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-extrabold text-xs rounded-full border border-emerald-500/30 uppercase">
                {activeTrip.transportRequestStatus || activeTrip.status}
              </span>
            </div>

            {/* Accept Trip Banner */}
            {activeTrip.transportRequestStatus === 'DRIVER_ASSIGNED' && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-emerald-200">New Trip Assigned by Transport Manager!</p>
                  <p className="text-[11px] text-slate-300">Accept this trip assignment to begin pickup logistics.</p>
                </div>
                <button
                  type="button"
                  onClick={() => driverAcceptTrip(activeTrip.id)}
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Check className="w-4 h-4" />
                  <span>ACCEPT TRIP</span>
                </button>
              </div>
            )}

            {/* Trip Address Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup Location (Seller)</p>
                <p className="font-bold text-white text-sm">{activeTrip.sellerName}</p>
                <p className="text-slate-400">{activeTrip.sellerAddress}</p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Destination (Buyer Delivery)</p>
                <p className="font-bold text-white text-sm">{activeTrip.buyerName}</p>
                <p className="text-slate-400">{activeTrip.buyerAddress}</p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Recyclable Material</p>
                <p className="font-bold text-cyan-300 text-sm">{activeTrip.productTitle} ({activeTrip.quantityKg} kg)</p>
              </div>
            </div>

            {/* Driver Workflow Action Buttons */}
            <div className="pt-2 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Advance Trip Lifecycle</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {statusWorkflow.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => driverUpdateTripStatus(activeTrip.id, action.nextStatus)}
                    className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer hover:border-cyan-500/50"
                  >
                    <span>{action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* OpenStreetMap Driver GPS Route */}
            <div className="pt-3">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Live Route GPS Navigation</p>
              <MapView markers={mapMarkers} height="320px" />
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 p-12 rounded-3xl text-center text-slate-400">
            <Truck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="font-bold text-white">No Active Trip Assigned</p>
            <p className="text-xs text-slate-400 mt-1">Waiting for Transport Manager to dispatch a new order.</p>
          </div>
        )}
      </main>

      {/* Driver Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-800">
              <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Edit Driver Profile & Photo</h3>
                <p className="text-xs text-slate-400">Update your driver credentials, avatar photo & assigned vehicle</p>
              </div>
            </div>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Driver Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              {/* Profile Photo Picker */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Driver Profile Photo</label>
                
                <div className="flex items-center gap-4">
                  <img
                    src={profileData.avatar}
                    alt="Driver Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shrink-0"
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
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload Custom Photo</span>
                    </button>
                    <p className="text-[10px] text-slate-400">Upload a clear photo for driver identity verification</p>
                  </div>
                </div>
              </div>

              {/* Driver Credentials Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driver Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-sm focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driver ID (Fixed)</label>
                    <input
                      type="text"
                      value={driverId}
                      disabled
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 font-mono font-bold opacity-75 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driving License (DL) *</label>
                    <input
                      type="text"
                      value={profileData.licenseNumber}
                      onChange={(e) => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:ring-2 focus:ring-cyan-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Truck Number *</label>
                    <input
                      type="text"
                      value={profileData.vehicleNumber}
                      onChange={(e) => setProfileData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-bold focus:ring-2 focus:ring-cyan-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Logistics Company</label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>Save Driver Profile Changes</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon component
const Building2Icon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
    <path d="M10 6h4"/>
    <path d="M10 10h4"/>
    <path d="M10 14h4"/>
    <path d="M10 18h4"/>
  </svg>
);

export default DriverDashboard;
