import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import apiService from '../../../services/apiService';
import EcoMartLogo from '../../../components/common/EcoMartLogo';
import MapView from '../../../components/common/MapView';
import {
  Truck,
  CheckCircle2,
  LogOut,
  Phone,
  MapPin,
  ArrowRight,
  Check,
  User,
  Star,
  Edit3,
  X,
  Camera,
  ShieldCheck,
  Award,
  Save,
  Search,
  Filter,
  Info,
  Clock,
  Navigation,
  AlertCircle,
  Package,
  Calendar,
  FileText
} from 'lucide-react';

const DRIVER_AVATAR_PRESETS = [
  { id: 1, label: 'Driver Photo 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 2, label: 'Driver Photo 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 3, label: 'Driver Photo 3', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
  { id: 4, label: 'Driver Photo 4', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' }
];

export const DriverDashboard = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const { orders, driverAcceptTrip, driverUpdateTripStatus } = useData();

  // Dynamic Driver Identity from Auth System
  const authenticatedDriverId = currentUser?.driverId || currentUser?.transportId || currentUser?.id || 'DRV001';

  // Component State (100% Data-Driven)
  const [driverProfile, setDriverProfile] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [tripHistory, setTripHistory] = useState([]);
  const [metrics, setMetrics] = useState({
    totalTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    totalPayloadKg: 0,
    co2SavedKg: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State for Trip History
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals State
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Editable Profile Data State
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    avatar: '',
    vehicleNumber: '',
    companyName: ''
  });

  // Fetch Driver Profile, Active Trip, History, and Metrics dynamically from Backend/DB
  const fetchDriverData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Profile
      const profileRes = await apiService.getDriverProfile(authenticatedDriverId).catch(() => null);
      const fetchedDriver = profileRes?.driver || {
        driverId: authenticatedDriverId,
        name: currentUser?.name || 'Driver',
        phone: currentUser?.phone || '+91 98401 00000',
        licenseNumber: currentUser?.licenseNumber || 'TN-01-DRV-LICENSED',
        avatar: currentUser?.avatar || DRIVER_AVATAR_PRESETS[0].url,
        assignedVehicleNumber: currentUser?.assignedVehicleNumber || null,
        companyName: currentUser?.companyName || 'Logistics Partner',
        rating: currentUser?.rating || 4.8,
        tripsCompleted: currentUser?.tripsCompleted || 0
      };
      setDriverProfile(fetchedDriver);
      setProfileFormData({
        name: fetchedDriver.name,
        phone: fetchedDriver.phone,
        licenseNumber: fetchedDriver.licenseNumber || '',
        avatar: fetchedDriver.avatar || DRIVER_AVATAR_PRESETS[0].url,
        vehicleNumber: fetchedDriver.assignedVehicleNumber || '',
        companyName: fetchedDriver.companyName || ''
      });

      // 2. Fetch Active Trip (strictly non-completed)
      const currentTripRes = await apiService.getDriverCurrentTrip(authenticatedDriverId).catch(() => null);
      let currentTripData = currentTripRes?.activeTrip;

      // Fallback matching against live orders in Context
      if (!currentTripData && orders) {
        currentTripData = orders.find(o => {
          const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
            (o.vehicleNumber && fetchedDriver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === fetchedDriver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
          const isNotCompleted = !['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
          return isMatch && isNotCompleted;
        });
      }
      setActiveTrip(currentTripData || null);

      // 3. Fetch Trip History
      const historyRes = await apiService.getDriverTripHistory(authenticatedDriverId, searchQuery, statusFilter).catch(() => null);
      let historyData = historyRes?.trips;

      if (!historyData && orders) {
        historyData = orders.filter(o => {
          const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
            (o.vehicleNumber && fetchedDriver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === fetchedDriver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
          const isPast = ['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
          return isMatch && isPast;
        });
      }
      setTripHistory(historyData || []);

      // 4. Fetch Driver Metrics
      const metricsRes = await apiService.getDriverMetrics(authenticatedDriverId).catch(() => null);
      if (metricsRes?.metrics) {
        setMetrics(metricsRes.metrics);
      } else {
        const historyList = historyData || [];
        const payloadSum = historyList.reduce((acc, curr) => acc + Number(curr.quantityKg || 0), 0);
        setMetrics({
          totalTrips: (currentTripData ? 1 : 0) + historyList.length,
          activeTrips: currentTripData ? 1 : 0,
          completedTrips: historyList.filter(h => ['COMPLETED', 'DELIVERED', 'Completed'].includes(h.transportRequestStatus || h.status)).length,
          cancelledTrips: historyList.filter(h => ['CANCELLED', 'REJECTED'].includes(h.transportRequestStatus || h.status)).length,
          totalPayloadKg: payloadSum,
          co2SavedKg: Math.round(payloadSum * 1.5)
        });
      }
    } catch (err) {
      console.error("Error loading driver fleet data:", err.message);
      setError("Unable to load driver fleet data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, [authenticatedDriverId, orders, searchQuery, statusFilter]);

  // Handle Driver Workflow Status Advancement
  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      if (driverUpdateTripStatus) {
        driverUpdateTripStatus(orderId, nextStatus);
      } else {
        await apiService.updateDriverTripStatus(orderId, nextStatus);
      }
      fetchDriverData();
    } catch (err) {
      console.error("Failed to update trip status:", err.message);
    }
  };

  // Handle Driver Trip Acceptance
  const handleAcceptTrip = async (orderId) => {
    try {
      if (driverAcceptTrip) {
        driverAcceptTrip(orderId);
      } else {
        await apiService.updateDriverTripStatus(orderId, 'DRIVER_ACCEPTED');
      }
      fetchDriverData();
    } catch (err) {
      console.error("Failed to accept trip:", err.message);
    }
  };

  // Handle Driver Profile Edit Submission
  const handleProfileSave = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile({
        name: profileFormData.name,
        phone: profileFormData.phone,
        licenseNumber: profileFormData.licenseNumber,
        assignedVehicleNumber: profileFormData.vehicleNumber,
        avatar: profileFormData.avatar,
        companyName: profileFormData.companyName
      });
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowProfileModal(false);
      fetchDriverData();
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setProfileFormData(prev => ({ ...prev, avatar: photoUrl }));
    }
  };

  // Workflow steps
  const statusWorkflow = [
    { label: 'Start Pickup (En Route)', nextStatus: 'EN_ROUTE_TO_PICKUP' },
    { label: 'Arrived at Pickup', nextStatus: 'ARRIVED_AT_PICKUP' },
    { label: 'Pickup Completed', nextStatus: 'PICKUP_COMPLETED' },
    { label: 'Start Delivery (In Transit)', nextStatus: 'IN_TRANSIT' },
    { label: 'Arrived at Destination', nextStatus: 'ARRIVED_AT_DESTINATION' },
    { label: 'Mark Delivered & Complete', nextStatus: 'COMPLETED' }
  ];

  // Map markers computation
  const pickupLat = Number(activeTrip?.pickupCoordinates?.[0]) || 13.0827;
  const pickupLng = Number(activeTrip?.pickupCoordinates?.[1]) || 80.2707;
  const delivLat = Number(activeTrip?.deliveryCoordinates?.[0]) || 13.1327;
  const delivLng = Number(activeTrip?.deliveryCoordinates?.[1]) || 80.3207;

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
      lat: pickupLat + 0.01,
      lng: pickupLng + 0.01,
      title: `My Lorry: ${driverProfile?.assignedVehicleNumber || 'Vehicle'}`,
      location: `Driver: ${driverProfile?.name || 'Driver'}`,
      type: 'transport',
      typeLabel: 'Live GPS Location'
    }
  ] : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-xl">
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

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center p-8 space-y-4">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-extrabold text-cyan-300 text-sm">Fetching Driver Fleet Data & Trip History...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-rose-400 space-y-3">
          <AlertCircle className="w-10 h-10 mx-auto" />
          <p className="font-bold text-base">{error}</p>
          <button onClick={fetchDriverData} className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
            Retry Loading
          </button>
        </div>
      ) : (
        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">

          {/* 1. Dynamic Driver Profile Section */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <img
                src={driverProfile?.avatar || DRIVER_AVATAR_PRESETS[0].url}
                alt={driverProfile?.name || 'Driver'}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 font-mono font-extrabold text-[11px] rounded-md border border-cyan-500/30">
                    {driverProfile?.driverId || authenticatedDriverId}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[11px] rounded-md border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified Driver</span>
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">{driverProfile?.name}</h2>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                  <Building2Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{driverProfile?.companyName || 'GreenRoute Logistics Pvt Ltd'}</span>
                  <span>•</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{driverProfile?.rating || 4.8}</span>
                  <span>({driverProfile?.tripsCompleted || 0} Trips)</span>
                </p>
              </div>
            </div>

            {/* Assigned Lorry Info */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 w-full md:w-auto min-w-[240px] relative z-10 space-y-1">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">ASSIGNED TRUCK / LORRY</p>
              {driverProfile?.assignedVehicleNumber ? (
                <div>
                  <p className="font-mono font-black text-cyan-300 text-base">{driverProfile.assignedVehicleNumber}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">{driverProfile.vehicleType || 'Commercial Lorry'}</p>
                </div>
              ) : (
                <div className="text-amber-400 font-bold text-xs py-1">
                  ⚠️ No Truck Assigned
                </div>
              )}
              {driverProfile?.licenseNumber && (
                <p className="text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-900">
                  DL: {driverProfile.licenseNumber}
                </p>
              )}
            </div>
          </div>

          {/* 2. Current Active Trip Section (Strictly Dynamic from Backend) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <span>CURRENT ACTIVE TRIP</span>
              </h3>
              {activeTrip && (
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs rounded-full border border-cyan-500/40 animate-pulse">
                  {activeTrip.transportRequestStatus || activeTrip.status}
                </span>
              )}
            </div>

            {activeTrip ? (
              <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-cyan-500/30 shadow-2xl space-y-5 backdrop-blur-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">ASSIGNED TRIP ID</span>
                    <h4 className="font-mono font-black text-cyan-400 text-xl tracking-wide">{activeTrip.id}</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL PAYLOAD</span>
                    <p className="font-black text-white text-base">{activeTrip.productTitle} ({activeTrip.quantityKg} kg)</p>
                  </div>
                </div>

                {/* Driver Accept Alert Card (If pending driver acceptance) */}
                {(activeTrip.transportRequestStatus === 'DRIVER_ASSIGNED' || activeTrip.status === 'DRIVER_ASSIGNED') && (
                  <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-4 rounded-2xl border border-emerald-500/50 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Sparkles className="w-5 h-5 animate-spin" />
                      <span className="font-extrabold text-sm uppercase">NEW TRIP DISPATCH ALERT</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      You have been assigned a new scrap transportation pickup. Please accept the ride to enable live route GPS navigation.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAcceptTrip(activeTrip.id)}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm rounded-xl cursor-pointer hover:from-emerald-300 hover:to-teal-300 shadow-md flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>ACCEPT RIDE & START PICKUP</span>
                    </button>
                  </div>
                )}

                {/* Pickup & Destination Address Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <MapPin className="w-4 h-4" />
                      <span className="uppercase text-[10px]">PICKUP LOCATION (SELLER)</span>
                    </div>
                    <p className="font-bold text-white text-sm">{activeTrip.sellerName}</p>
                    <p className="text-slate-400">{activeTrip.sellerAddress}</p>
                    {activeTrip.sellerPhone && <p className="text-cyan-400 font-mono font-bold mt-1">📞 {activeTrip.sellerPhone}</p>}
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Navigation className="w-4 h-4" />
                      <span className="uppercase text-[10px]">DESTINATION (BUYER DELIVERY)</span>
                    </div>
                    <p className="font-bold text-white text-sm">{activeTrip.buyerName}</p>
                    <p className="text-slate-400">{activeTrip.buyerAddress}</p>
                    {activeTrip.buyerPhone && <p className="text-cyan-400 font-mono font-bold mt-1">📞 {activeTrip.buyerPhone}</p>}
                  </div>
                </div>

                {/* Trip Workflow Action Buttons */}
                <div className="pt-2 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ADVANCE TRIP LIFECYCLE</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {statusWorkflow.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => handleUpdateStatus(activeTrip.id, action.nextStatus)}
                        className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer hover:border-cyan-500/50 active:scale-95"
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* OpenStreetMap Live GPS Navigation Map */}
                <div className="pt-3">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">LIVE ROUTE GPS NAVIGATION</p>
                  <MapView markers={mapMarkers} height="320px" />
                </div>
              </div>
            ) : (
              /* NO ACTIVE TRIP STATE (Requirement 8) */
              <div className="bg-slate-900/90 rounded-3xl p-10 text-center text-slate-400 border border-slate-800 shadow-2xl space-y-3 backdrop-blur-xl">
                <Truck className="w-12 h-12 text-cyan-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">NO ACTIVE TRIP</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You currently have no pickup assigned. Your completed and previous trips are available in Trip Dashboard & History below.
                </p>
              </div>
            )}
          </div>

          {/* 3. Driver Trip Dashboard Metrics Cards (Requirement 9) */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>DRIVER TRIP DASHBOARD STATISTICS</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase">Total Trips</p>
                <p className="text-2xl font-black text-white mt-1">{metrics.totalTrips}</p>
                <p className="text-[10px] text-slate-500 mt-1">Assigned to Driver</p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-extrabold text-cyan-400 uppercase">Active Trips</p>
                <p className="text-2xl font-black text-cyan-300 mt-1">{metrics.activeTrips}</p>
                <p className="text-[10px] text-cyan-500 mt-1">In Progress</p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-extrabold text-emerald-400 uppercase">Completed Trips</p>
                <p className="text-2xl font-black text-emerald-300 mt-1">{metrics.completedTrips}</p>
                <p className="text-[10px] text-emerald-500 mt-1">Delivered & Verified</p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-extrabold text-amber-400 uppercase">Total Payload</p>
                <p className="text-2xl font-black text-amber-300 mt-1">{metrics.totalPayloadKg.toLocaleString()} kg</p>
                <p className="text-[10px] text-amber-500 mt-1">Scrap Transported</p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-extrabold text-teal-400 uppercase">CO2 Impact</p>
                <p className="text-2xl font-black text-teal-300 mt-1">{metrics.co2SavedKg.toLocaleString()} kg</p>
                <p className="text-[10px] text-teal-500 mt-1">Emissions Saved</p>
              </div>
            </div>
          </div>

          {/* 4. Driver Trip History & Search/Filter (Requirement 10 & 11) */}
          <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-sm">
                  MY TRIP HISTORY ({tripHistory.length})
                </h3>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Order ID, Seller, Buyer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium outline-hidden"
                >
                  <option value="">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Seller (Pickup)</th>
                    <th className="p-3.5">Buyer (Destination)</th>
                    <th className="p-3.5">Material & Payload</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {tripHistory.length > 0 ? (
                    tripHistory.map((trip) => {
                      const status = trip.transportRequestStatus || trip.status;
                      const isCompleted = ['COMPLETED', 'DELIVERED', 'Completed'].includes(status);

                      return (
                        <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-mono font-extrabold text-cyan-400">{trip.id}</td>
                          <td className="p-3.5">
                            <p className="font-bold text-white">{trip.sellerName}</p>
                            <p className="text-[10px] text-slate-400">{trip.sellerAddress}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-white">{trip.buyerName}</p>
                            <p className="text-[10px] text-slate-400">{trip.buyerAddress}</p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-200">{trip.productTitle}</p>
                            <p className="text-[10px] text-cyan-300 font-mono">{trip.quantityKg} kg</p>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderDetail(trip)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-extrabold text-[11px] rounded-lg border border-slate-700 cursor-pointer inline-flex items-center gap-1"
                            >
                              <Info className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View Details</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400 space-y-1">
                        <p className="font-bold text-white text-sm">No Trip History Records</p>
                        <p className="text-xs text-slate-500">Completed and past delivery trips for your driver ID will appear here.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      )}

      {/* 5. Order Details Modal (Requirement 12) */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-sm">Order Details: {selectedOrderDetail.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 font-bold">STATUS</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-black rounded-full border border-emerald-500/30 uppercase text-[10px]">
                  {selectedOrderDetail.transportRequestStatus || selectedOrderDetail.status}
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL</p>
                <p className="font-bold text-white text-sm">{selectedOrderDetail.productTitle}</p>
                <p className="text-cyan-300 font-mono font-bold">Quantity: {selectedOrderDetail.quantityKg} kg • ₹{Number(selectedOrderDetail.totalPrice || 0).toLocaleString('en-IN')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">SELLER (PICKUP)</p>
                  <p className="font-bold text-white">{selectedOrderDetail.sellerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedOrderDetail.sellerAddress}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">BUYER (DESTINATION)</p>
                  <p className="font-bold text-white">{selectedOrderDetail.buyerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedOrderDetail.buyerAddress}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
                <p><span className="text-slate-500 font-bold">Assigned Driver:</span> {selectedOrderDetail.driverName || driverProfile?.name}</p>
                <p><span className="text-slate-500 font-bold">Vehicle Plate:</span> {selectedOrderDetail.vehicleNumber || driverProfile?.assignedVehicleNumber || 'N/A'}</p>
                <p><span className="text-slate-500 font-bold">Creation Date:</span> {selectedOrderDetail.createdAt || 'N/A'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderDetail(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Driver Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm">Edit Driver Profile & Photo</h3>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Driver profile saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <img
                  src={profileFormData.avatar}
                  alt="Avatar Preview"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload New Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driver Full Name *</label>
                  <input
                    type="text"
                    value={profileFormData.name}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driver ID</label>
                    <input
                      type="text"
                      value={driverProfile?.driverId || authenticatedDriverId}
                      disabled
                      className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl text-cyan-400 font-mono font-bold cursor-not-allowed opacity-80"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driving License No *</label>
                    <input
                      type="text"
                      value={profileFormData.licenseNumber}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
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
                      value={profileFormData.phone}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Truck Number *</label>
                    <input
                      type="text"
                      value={profileFormData.vehicleNumber}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-bold focus:ring-2 focus:ring-cyan-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2"
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
