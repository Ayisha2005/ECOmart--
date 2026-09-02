import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FileText,
  Sparkles,
  Building2,
  LayoutDashboard
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
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Authenticated Driver Identity
  const authenticatedDriverId = currentUser?.driverId || currentUser?.transportId || currentUser?.id || 'DRV001';

  // Active Tab State: 'dashboard' | 'current' | 'history' | 'vehicle' | 'profile'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dynamic Driver Fleet States
  const [driverProfile, setDriverProfile] = useState(null);
  const [currentAssignedOrder, setCurrentAssignedOrder] = useState(null);
  const [oldOrdersHistory, setOldOrdersHistory] = useState([]);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State for Order History
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals State
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form State
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    avatar: '',
    vehicleNumber: '',
    companyName: ''
  });

  // Fetch Driver Profile, Current Active Assignment, History, and Metrics from Backend/DB
  const fetchDriverFleetData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Driver Profile
      const profileRes = await apiService.getDriverProfile(authenticatedDriverId).catch(() => null);
      const fetchedDriver = profileRes?.driver || {
        driverId: authenticatedDriverId,
        name: currentUser?.name || 'Driver',
        phone: currentUser?.phone || '+91 98401 00000',
        licenseNumber: currentUser?.licenseNumber || 'TN-01-2026-LICENSED',
        avatar: currentUser?.avatar || DRIVER_AVATAR_PRESETS[0].url,
        assignedVehicleNumber: currentUser?.assignedVehicleNumber || null,
        vehicleType: currentUser?.vehicleType || 'Commercial Lorry Truck',
        companyName: currentUser?.companyName || 'GreenRoute Logistics Pvt Ltd',
        rating: currentUser?.rating || 4.9,
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

      // 2. Fetch Single Current Active Assigned Order (Strictly Non-Completed)
      const currentTripRes = await apiService.getDriverCurrentTrip(authenticatedDriverId).catch(() => null);
      let activeTrip = currentTripRes?.activeTrip;

      if (!activeTrip && orders) {
        const matchingActiveOrders = orders.filter(o => {
          const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
            (o.vehicleNumber && fetchedDriver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === fetchedDriver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
          const isNotCompleted = !['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
          return isMatch && isNotCompleted;
        });
        activeTrip = matchingActiveOrders.length > 0 ? matchingActiveOrders[matchingActiveOrders.length - 1] : null;
      }
      setCurrentAssignedOrder(activeTrip || null);

      // 3. Fetch Old Orders / Order History
      const historyRes = await apiService.getDriverTripHistory(authenticatedDriverId, searchQuery, statusFilter).catch(() => null);
      let historyList = historyRes?.trips;

      if (!historyList && orders) {
        historyList = orders.filter(o => {
          const isMatch = (o.driverId && (o.driverId === authenticatedDriverId || o.driverId === currentUser?.id)) ||
            (o.vehicleNumber && fetchedDriver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === fetchedDriver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
          const isPast = ['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
          return isMatch && isPast;
        });
      }
      setOldOrdersHistory(historyList || []);

      // 4. Fetch Dashboard Statistics
      const metricsRes = await apiService.getDriverMetrics(authenticatedDriverId).catch(() => null);
      if (metricsRes?.metrics) {
        setMetrics({
          totalOrders: metricsRes.metrics.totalTrips,
          activeOrders: metricsRes.metrics.activeTrips,
          completedOrders: metricsRes.metrics.completedTrips,
          pendingOrders: activeTrip && (activeTrip.transportRequestStatus === 'DRIVER_ASSIGNED' || activeTrip.status === 'DRIVER_ASSIGNED') ? 1 : 0,
          cancelledOrders: metricsRes.metrics.cancelledTrips
        });
      } else {
        const history = historyList || [];
        setMetrics({
          totalOrders: (activeTrip ? 1 : 0) + history.length,
          activeOrders: activeTrip ? 1 : 0,
          completedOrders: history.filter(h => ['COMPLETED', 'DELIVERED', 'Completed'].includes(h.transportRequestStatus || h.status)).length,
          pendingOrders: activeTrip && (activeTrip.transportRequestStatus === 'DRIVER_ASSIGNED' || activeTrip.status === 'DRIVER_ASSIGNED') ? 1 : 0,
          cancelledOrders: history.filter(h => ['CANCELLED', 'REJECTED'].includes(h.transportRequestStatus || h.status)).length
        });
      }
    } catch (err) {
      console.error("Error loading driver fleet data:", err.message);
      setError("Unable to load current order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverFleetData();
  }, [authenticatedDriverId, orders, searchQuery, statusFilter]);

  // Workflow Status Advancement Action
  const handleUpdateTripStatus = async (orderId, nextStatus) => {
    try {
      if (driverUpdateTripStatus) {
        driverUpdateTripStatus(orderId, nextStatus);
      } else {
        await apiService.updateDriverTripStatus(orderId, nextStatus);
      }
      fetchDriverFleetData();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Driver Accept Ride Action
  const handleAcceptRide = async (orderId) => {
    try {
      if (driverAcceptTrip) {
        driverAcceptTrip(orderId);
      } else {
        await apiService.updateDriverTripStatus(orderId, 'DRIVER_ACCEPTED');
      }
      fetchDriverFleetData();
    } catch (err) {
      console.error("Failed to accept ride:", err);
    }
  };

  // Save Profile Handler
  const handleSaveProfile = (e) => {
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
      fetchDriverFleetData();
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileFormData(prev => ({ ...prev, avatar: url }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/transport/driver/login');
  };

  // Status workflow steps
  const statusWorkflow = [
    { label: 'Start Pickup (En Route)', nextStatus: 'EN_ROUTE_TO_PICKUP' },
    { label: 'Arrived at Pickup', nextStatus: 'ARRIVED_AT_PICKUP' },
    { label: 'Pickup Completed', nextStatus: 'PICKUP_COMPLETED' },
    { label: 'Start Delivery (In Transit)', nextStatus: 'IN_TRANSIT' },
    { label: 'Arrived at Destination', nextStatus: 'ARRIVED_AT_DESTINATION' },
    { label: 'Mark Delivered & Complete', nextStatus: 'COMPLETED' }
  ];

  // Map markers
  const pickupLat = Number(currentAssignedOrder?.pickupCoordinates?.[0]) || 13.0827;
  const pickupLng = Number(currentAssignedOrder?.pickupCoordinates?.[1]) || 80.2707;
  const delivLat = Number(currentAssignedOrder?.deliveryCoordinates?.[0]) || 13.1327;
  const delivLng = Number(currentAssignedOrder?.deliveryCoordinates?.[1]) || 80.3207;

  const mapMarkers = currentAssignedOrder ? [
    {
      id: 'pickup',
      lat: pickupLat,
      lng: pickupLng,
      title: `Pickup: ${currentAssignedOrder.sellerName || 'Seller Location'}`,
      location: currentAssignedOrder.sellerAddress || 'Seller Address',
      type: 'seller',
      typeLabel: 'Pickup Location'
    },
    {
      id: 'delivery',
      lat: delivLat,
      lng: delivLng,
      title: `Delivery: ${currentAssignedOrder.buyerName || 'Buyer Destination'}`,
      location: currentAssignedOrder.buyerAddress || 'Destination Address',
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
      
      {/* 1. TOP HEADER BAR */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        <EcoMartLogo size="sm" showTagline={false} />

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white">{driverProfile?.name || currentUser?.name || 'Driver'}</span>
            <span className="text-[10px] text-cyan-400 font-mono">ID: {driverProfile?.driverId || authenticatedDriverId}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-extrabold text-cyan-300 transition-all cursor-pointer"
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* 2. SECONDARY NAVIGATION TABS */}
      <nav className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 sticky top-[65px] z-20 overflow-x-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'current', label: 'Current Order', icon: Truck, badge: currentAssignedOrder ? 'Active' : null },
            { id: 'history', label: 'Order History', icon: CheckCircle2, count: oldOrdersHistory.length },
            { id: 'vehicle', label: 'Vehicle Details', icon: Package },
            { id: 'profile', label: 'Driver Profile', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-slate-950 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-2 py-0.5 text-[9px] font-black bg-cyan-400 text-slate-950 rounded-full uppercase">
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-800 text-cyan-300 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center p-8 space-y-4">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-extrabold text-cyan-300 text-sm">Loading Driver Profile & Fleet Data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-rose-400 space-y-3">
          <AlertCircle className="w-10 h-10 mx-auto" />
          <p className="font-bold text-base">{error}</p>
          <button onClick={fetchDriverFleetData} className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
            Retry Loading
          </button>
        </div>
      ) : (
        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">

          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Welcome Driver Banner */}
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
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Driver</span>
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white">WELCOME, {driverProfile?.name?.toUpperCase()}</h2>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{driverProfile?.companyName || 'GreenRoute Logistics Pvt Ltd'}</span>
                      <span>•</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white">{driverProfile?.rating || 4.9}</span>
                      <span>({driverProfile?.tripsCompleted || 0} Trips)</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 font-bold text-xs rounded-xl border border-slate-800 cursor-pointer flex items-center gap-2 shrink-0 relative z-10"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>EDIT PROFILE</span>
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <span>FLEET DASHBOARD STATISTICS</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase">Total Orders</p>
                    <p className="text-2xl font-black text-white mt-1">{metrics.totalOrders}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Assigned to Driver</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-cyan-400 uppercase">Active Orders</p>
                    <p className="text-2xl font-black text-cyan-300 mt-1">{metrics.activeOrders}</p>
                    <p className="text-[10px] text-cyan-500 mt-1">In Progress</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-emerald-400 uppercase">Completed Orders</p>
                    <p className="text-2xl font-black text-emerald-300 mt-1">{metrics.completedOrders}</p>
                    <p className="text-[10px] text-emerald-500 mt-1">Delivered & Verified</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-amber-400 uppercase">Pending Orders</p>
                    <p className="text-2xl font-black text-amber-300 mt-1">{metrics.pendingOrders}</p>
                    <p className="text-[10px] text-amber-500 mt-1">Awaiting Acceptance</p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                    <p className="text-[10px] font-extrabold text-rose-400 uppercase">Cancelled Orders</p>
                    <p className="text-2xl font-black text-rose-300 mt-1">{metrics.cancelledOrders}</p>
                    <p className="text-[10px] text-rose-500 mt-1">Rejected / Cancelled</p>
                  </div>
                </div>
              </div>

              {/* Current Assigned Order Card Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-cyan-400" />
                    <span>CURRENT ASSIGNED ORDER</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('current')}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Full Assignment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {currentAssignedOrder ? (
                  <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-cyan-500/40 shadow-2xl space-y-4 backdrop-blur-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">ORDER ID</span>
                        <h4 className="font-mono font-black text-cyan-400 text-lg">{currentAssignedOrder.id}</h4>
                        <p className="font-bold text-white text-sm mt-1">{currentAssignedOrder.productTitle} ({currentAssignedOrder.quantityKg} kg)</p>
                      </div>
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs rounded-full border border-cyan-500/40 uppercase">
                        {currentAssignedOrder.transportRequestStatus || currentAssignedOrder.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">SELLER PICKUP</span>
                        <p className="font-bold text-white">{currentAssignedOrder.sellerName}</p>
                        <p className="text-slate-400 text-[11px]">{currentAssignedOrder.sellerAddress}</p>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">BUYER DESTINATION</span>
                        <p className="font-bold text-white">{currentAssignedOrder.buyerName}</p>
                        <p className="text-slate-400 text-[11px]">{currentAssignedOrder.buyerAddress}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/90 rounded-3xl p-8 text-center text-slate-400 border border-slate-800 shadow-xl space-y-2 backdrop-blur-xl">
                    <Truck className="w-10 h-10 text-cyan-400 mx-auto" />
                    <h4 className="font-extrabold text-white text-sm">NO ACTIVE ORDER</h4>
                    <p className="text-xs text-slate-400">
                      You currently have no active pickup or delivery assignment. Your previous orders are stored in Order History.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DEDICATED CURRENT ASSIGNED ORDER */}
          {activeTab === 'current' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Truck className="w-6 h-6 text-cyan-400" />
                  <span>CURRENT ACTIVE ASSIGNMENT</span>
                </h3>
                {currentAssignedOrder && (
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs rounded-full border border-cyan-500/40 uppercase">
                    {currentAssignedOrder.transportRequestStatus || currentAssignedOrder.status}
                  </span>
                )}
              </div>

              {currentAssignedOrder ? (
                <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-cyan-500/40 shadow-2xl space-y-5 backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">ORDER ID</span>
                      <h4 className="font-mono font-black text-cyan-400 text-xl tracking-wide">{currentAssignedOrder.id}</h4>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL</span>
                      <p className="font-black text-white text-base">{currentAssignedOrder.productTitle} ({currentAssignedOrder.quantityKg} kg)</p>
                    </div>
                  </div>

                  {/* Ride Acceptance Banner if DRIVER_ASSIGNED */}
                  {(currentAssignedOrder.transportRequestStatus === 'DRIVER_ASSIGNED' || currentAssignedOrder.status === 'DRIVER_ASSIGNED') && (
                    <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-4 rounded-2xl border border-emerald-500/50 shadow-xl space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Sparkles className="w-5 h-5 animate-spin" />
                        <span className="font-extrabold text-sm uppercase">NEW ASSIGNED DISPATCH</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        You have been assigned a new scrap transportation pickup. Accept ride to enable live route GPS navigation.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAcceptRide(currentAssignedOrder.id)}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm rounded-xl cursor-pointer hover:from-emerald-300 hover:to-teal-300 shadow-md flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>ACCEPT RIDE & START PICKUP</span>
                      </button>
                    </div>
                  )}

                  {/* Pickup & Destination Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <MapPin className="w-4 h-4" />
                        <span className="uppercase text-[10px]">SELLER (PICKUP LOCATION)</span>
                      </div>
                      <p className="font-bold text-white text-sm">{currentAssignedOrder.sellerName}</p>
                      <p className="text-slate-400">{currentAssignedOrder.sellerAddress}</p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                        <Navigation className="w-4 h-4" />
                        <span className="uppercase text-[10px]">BUYER (DESTINATION LOCATION)</span>
                      </div>
                      <p className="font-bold text-white text-sm">{currentAssignedOrder.buyerName}</p>
                      <p className="text-slate-400">{currentAssignedOrder.buyerAddress}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ADVANCE TRIP WORKFLOW STATUS</p>
                      <button
                        type="button"
                        onClick={() => setSelectedOrderDetail(currentAssignedOrder)}
                        className="text-xs font-extrabold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                        <span>VIEW ORDER DETAILS</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {statusWorkflow.map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          onClick={() => handleUpdateTripStatus(currentAssignedOrder.id, action.nextStatus)}
                          className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer hover:border-cyan-500/50 active:scale-95"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* OpenStreetMap Live GPS Navigation Map */}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">LIVE ROUTE GPS NAVIGATION</p>
                    <MapView markers={mapMarkers} height="360px" />
                  </div>
                </div>
              ) : (
                /* CLEAN NO ACTIVE ORDER STATE */
                <div className="bg-slate-900/90 rounded-3xl p-12 text-center text-slate-400 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl">
                  <Truck className="w-14 h-14 text-cyan-400 mx-auto" />
                  <h4 className="font-extrabold text-white text-lg">NO ACTIVE ORDER</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    You currently have no active pickup or delivery assignment. Your previous completed orders are available in Order History below.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>VIEW ORDER HISTORY</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OLD ORDERS / ORDER HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-slate-900/90 rounded-3xl p-5 md:p-6 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-xl animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-white text-base">
                    OLD ORDERS / ORDER HISTORY ({oldOrdersHistory.length})
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
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-cyan-500 outline-hidden font-medium"
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
                      <th className="p-3.5">ORDER ID</th>
                      <th className="p-3.5">SELLER (PICKUP)</th>
                      <th className="p-3.5">BUYER (DESTINATION)</th>
                      <th className="p-3.5">MATERIAL & QUANTITY</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5">DATE</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {oldOrdersHistory.length > 0 ? (
                      oldOrdersHistory.map((trip) => {
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
                            <td className="p-3.5 font-bold text-slate-200">
                              {trip.productTitle} ({trip.quantityKg} kg)
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              }`}>
                                {status}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-[11px] text-slate-400">{trip.pickupDate || trip.createdAt || 'Recent'}</td>
                            <td className="p-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderDetail(trip)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-extrabold text-[11px] rounded-lg border border-slate-700 cursor-pointer inline-flex items-center gap-1"
                              >
                                <Info className="w-3.5 h-3.5 text-cyan-400" />
                                <span>VIEW DETAILS</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-400 space-y-1">
                          <Package className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="font-bold text-white text-xs">No Historical Orders Found</p>
                          <p className="text-[11px] text-slate-500">Completed scrap delivery orders will appear in this history archive.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: VEHICLE DETAILS */}
          {activeTab === 'vehicle' && (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5 backdrop-blur-xl animate-fadeIn max-w-2xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Package className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-base">ASSIGNED VEHICLE & TRUCK DETAILS</h3>
              </div>

              {driverProfile?.assignedVehicleNumber ? (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">VEHICLE PLATE NUMBER</span>
                    <p className="font-mono font-black text-cyan-300 text-2xl">{driverProfile.assignedVehicleNumber}</p>
                    <p className="text-slate-400 font-semibold text-sm">{driverProfile.vehicleType || 'Commercial Truck'}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">FLEET STATUS</span>
                      <p className="font-bold text-emerald-400 text-sm mt-0.5">Active Commercial Lorry</p>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">SERVICE REGION</span>
                      <p className="font-bold text-white text-sm mt-0.5">Chennai Metro & Industrial Belt</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-amber-400 space-y-2">
                  <AlertCircle className="w-10 h-10 mx-auto" />
                  <h4 className="font-extrabold text-white text-base">NO VEHICLE ASSIGNED</h4>
                  <p className="text-xs text-slate-400">Your Transport Manager has not assigned a truck plate number to your account yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DRIVER PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5 backdrop-blur-xl animate-fadeIn max-w-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-extrabold text-white text-base">DRIVER PROFILE & CREDENTIALS</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
                >
                  EDIT PROFILE
                </button>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={driverProfile?.avatar || DRIVER_AVATAR_PRESETS[0].url}
                  alt="Driver Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg"
                />
                <div className="space-y-1">
                  <h4 className="font-black text-white text-lg">{driverProfile?.name}</h4>
                  <p className="text-xs text-cyan-400 font-mono font-bold">Driver ID: {driverProfile?.driverId || authenticatedDriverId}</p>
                  <p className="text-xs text-slate-400">{driverProfile?.companyName || 'GreenRoute Logistics Pvt Ltd'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">MOBILE PHONE</span>
                  <p className="font-mono font-bold text-white mt-0.5">{driverProfile?.phone || 'N/A'}</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">DRIVING LICENSE NO</span>
                  <p className="font-mono font-bold text-cyan-300 mt-0.5">{driverProfile?.licenseNumber || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* 6. ORDER DETAILS MODAL */}
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

              {/* Status Timeline */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">TRIP TIMELINE</p>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <p className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Order Created: {selectedOrderDetail.createdAt || 'Recent'}</span>
                  </p>
                  <p className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Assigned Driver: {selectedOrderDetail.driverName || driverProfile?.name}</span>
                  </p>
                  <p className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Vehicle Plate: {selectedOrderDetail.vehicleNumber || driverProfile?.assignedVehicleNumber || 'TN 01 AB 1234'}</span>
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">RECYCLABLE MATERIAL</p>
                <p className="font-bold text-white text-sm">{selectedOrderDetail.productTitle}</p>
                <p className="text-cyan-300 font-mono font-bold">Quantity: {selectedOrderDetail.quantityKg} kg • Total Value: ₹{Number(selectedOrderDetail.totalPrice || 0).toLocaleString('en-IN')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">SELLER (PICKUP)</p>
                  <p className="font-bold text-white">{selectedOrderDetail.sellerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedOrderDetail.sellerAddress}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] text-cyan-400 font-bold uppercase">BUYER (DESTINATION)</p>
                  <p className="font-bold text-white">{selectedOrderDetail.buyerName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedOrderDetail.buyerAddress}</p>
                </div>
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

      {/* 7. DRIVER PROFILE EDIT MODAL */}
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

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
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
                <span>Save Driver Profile</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
