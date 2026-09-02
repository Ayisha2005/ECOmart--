import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_TRANSPORT_PARTNERS,
  INITIAL_FLEET_VEHICLES,
  INITIAL_COMPANY_DRIVERS,
  INITIAL_ORDERS,
  INITIAL_ENVIRONMENTAL_IMPACT,
  ECO_CATEGORIES
} from '../data/initialData';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { showNotification } = useAuth();

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('ecoMartProducts');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [partners, setPartners] = useState(() => {
    try {
      const saved = localStorage.getItem('ecoMartPartners');
      return saved ? JSON.parse(saved) : INITIAL_TRANSPORT_PARTNERS;
    } catch {
      return INITIAL_TRANSPORT_PARTNERS;
    }
  });

  const [fleetVehicles, setFleetVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('ecoMartFleetVehicles');
      return saved ? JSON.parse(saved) : INITIAL_FLEET_VEHICLES;
    } catch {
      return INITIAL_FLEET_VEHICLES;
    }
  });

  const [companyDrivers, setCompanyDrivers] = useState(() => {
    try {
      const saved = localStorage.getItem('ecoMartCompanyDrivers');
      return saved ? JSON.parse(saved) : INITIAL_COMPANY_DRIVERS;
    } catch {
      return INITIAL_COMPANY_DRIVERS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ecoMartOrders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [environmentalImpact, setEnvironmentalImpact] = useState(() => {
    try {
      const saved = localStorage.getItem('ecoMartEnvImpact');
      return saved ? JSON.parse(saved) : INITIAL_ENVIRONMENTAL_IMPACT;
    } catch {
      return INITIAL_ENVIRONMENTAL_IMPACT;
    }
  });

  const [appNotifications, setAppNotifications] = useState([]);

  // Fetch Live Data from Render MongoDB Atlas API on Load
  useEffect(() => {
    async function loadLiveBackendData() {
      try {
        const prods = await apiService.getProducts();
        if (prods && prods.success && prods.products?.length) {
          setProducts(prods.products);
        }
      } catch (e) {
        console.warn("Using cached products state:", e.message);
      }

      try {
        const ords = await apiService.getOrders();
        if (ords && ords.success && ords.orders?.length) {
          setOrders(ords.orders);
        }
      } catch (e) {
        console.warn("Using cached orders state:", e.message);
      }

      try {
        const parts = await apiService.getPartners();
        if (parts && parts.success && parts.partners?.length) {
          setPartners(parts.partners);
        }
      } catch (e) {
        console.warn("Using cached partners state:", e.message);
      }

      try {
        const fleet = await apiService.getFleet();
        if (fleet && fleet.success && fleet.fleet?.length) {
          setFleetVehicles(fleet.fleet);
        }
      } catch (e) {
        console.warn("Using cached fleet state:", e.message);
      }

      try {
        const drivers = await apiService.getDrivers();
        if (drivers && drivers.success && drivers.drivers?.length) {
          setCompanyDrivers(drivers.drivers);
        }
      } catch (e) {
        console.warn("Using cached drivers state:", e.message);
      }
    }

    loadLiveBackendData();
  }, []);

  // Persistent Cache Sync
  useEffect(() => {
    localStorage.setItem('ecoMartProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ecoMartPartners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('ecoMartFleetVehicles', JSON.stringify(fleetVehicles));
  }, [fleetVehicles]);

  useEffect(() => {
    localStorage.setItem('ecoMartCompanyDrivers', JSON.stringify(companyDrivers));
  }, [companyDrivers]);

  useEffect(() => {
    localStorage.setItem('ecoMartOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ecoMartEnvImpact', JSON.stringify(environmentalImpact));
  }, [environmentalImpact]);

  const addNotificationAlert = (title, message, targetRole = 'ALL', companyId = null) => {
    const alertObj = {
      id: `notif-${Date.now()}-${Math.random()}`,
      title,
      message,
      targetRole,
      companyId,
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };
    setAppNotifications(prev => [alertObj, ...prev]);
  };

  // Product Actions with REST API Sync
  const addProduct = (newProdData, seller) => {
    const categoryObj = ECO_CATEGORIES.find(c => c.id === newProdData.category);
    const newProd = {
      id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
      title: newProdData.title,
      category: newProdData.category,
      categoryLabel: categoryObj ? categoryObj.name : "Other Recyclable",
      description: newProdData.description,
      price: Number(newProdData.price),
      weightKg: Number(newProdData.weightKg),
      unit: "kg",
      sellerId: seller?.id || "seller-custom",
      sellerName: seller?.name || "Eco Seller",
      sellerPhone: seller?.phone || "+91 98765 43210",
      state: newProdData.state || "Tamil Nadu",
      city: newProdData.city || "Chennai",
      pincode: newProdData.pincode || "600001",
      address: newProdData.address || "Main Industrial Park",
      lat: newProdData.lat || 13.0827,
      lng: newProdData.lng || 80.2707,
      images: newProdData.images?.length ? newProdData.images : ["https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80"],
      condition: newProdData.condition || "Inspected Scrap",
      availability: "Immediate",
      status: "PENDING_APPROVAL",
      approvalStatus: "PENDING_APPROVAL",
      co2SavedKg: Math.round(Number(newProdData.weightKg) * 1.5),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [newProd, ...(prev || [])]);

    // Async REST API Sync to MongoDB Atlas
    apiService.createProduct(newProd).catch(err => console.warn("API product create error:", err.message));

    showNotification("New product listing published successfully!", 'success');
    return newProd;
  };

  const deleteProduct = (prodId) => {
    setProducts(prev => (prev || []).filter(p => p.id !== prodId));
    apiService.deleteProduct(prodId).catch(err => console.warn("API product delete error:", err.message));
    showNotification("Product listing deleted.", 'info');
  };

  const updateProductStatus = (prodId, status) => {
    setProducts(prev => (prev || []).map(p => p.id === prodId ? { ...p, status, approvalStatus: status } : p));
    apiService.updateProduct(prodId, { status, approvalStatus: status }).catch(err => console.warn("API product update status error:", err.message));
    showNotification(`Listing ${prodId} status updated to ${status}!`, status === 'APPROVED' ? 'success' : 'info');
  };

  // Admin Partnership Onboarding with REST API Sync
  const addPartnerCompany = (partnerData) => {
    const partnerId = `comp-${Date.now()}`;
    const newPartner = {
      id: partnerId,
      invitationCode: `INV-${Date.now().toString().slice(-6)}`,
      agreementStatus: "Verified Partnership",
      partnerStatus: "PENDING_ACCEPTANCE",
      ...partnerData
    };
    setPartners(prev => [newPartner, ...(prev || [])]);

    apiService.createPartner(newPartner).catch(err => console.warn("API partner create error:", err.message));

    addNotificationAlert(
      "Partnership Invitation Sent",
      `ECO MART Admin sent a transportation partnership invitation to ${newPartner.companyName}.`,
      "ADMIN"
    );

    showNotification(`Partnership Invitation created for ${newPartner.companyName}!`, 'success');
    return newPartner;
  };

  const updatePartnerStatus = (partnerId, status) => {
    setPartners(prev => (prev || []).map(p => p.id === partnerId ? { ...p, partnerStatus: status } : p));
    apiService.updatePartnerStatus(partnerId, status).catch(err => console.warn("API partner status update error:", err.message));
    showNotification(`Partner status updated to ${status}`, 'info');
  };

  // Fleet Vehicle Actions
  const addFleetVehicle = (vehicleData, manager) => {
    const newVeh = {
      id: `veh-${Date.now()}`,
      vehicleId: `V-${Date.now().toString().slice(-4)}`,
      transportCompanyId: manager?.transportCompanyId || 'comp-greenroute',
      companyName: manager?.companyName || 'GreenRoute Logistics Pvt Ltd',
      currentStatus: "Available",
      lat: 13.0827,
      lng: 80.2707,
      ...vehicleData
    };
    setFleetVehicles(prev => [newVeh, ...(prev || [])]);
    apiService.addFleetVehicle(newVeh).catch(err => console.warn("API fleet create error:", err.message));
    showNotification(`Vehicle ${newVeh.vehicleNumber} added to company fleet!`, 'success');
    return newVeh;
  };

  // Driver Actions
  const addCompanyDriver = (driverData, manager) => {
    const newDriver = {
      id: driverData.driverId || `DRV00${(companyDrivers || []).length + 1}`,
      driverId: driverData.driverId || `DRV00${(companyDrivers || []).length + 1}`,
      transportCompanyId: manager?.transportCompanyId || 'comp-greenroute',
      companyName: manager?.companyName || 'GreenRoute Logistics Pvt Ltd',
      status: "Available",
      completedTripsCount: 0,
      ...driverData
    };
    setCompanyDrivers(prev => [newDriver, ...(prev || [])]);
    apiService.addDriver(newDriver).catch(err => console.warn("API driver create error:", err.message));
    showNotification(`Driver ${newDriver.name} onboarded successfully!`, 'success');
    return newDriver;
  };

  // Marketplace Order Placement with REST API Sync
  const placeOrder = (product, buyer, quantityKg = null) => {
    const weight = quantityKg || product.weightKg;
    const price = Math.round((product.price / product.weightKg) * weight);

    const newOrder = {
      id: `ORD-${Math.floor(8000 + Math.random() * 1999)}`,
      productId: product.id,
      productTitle: product.title,
      category: product.category,
      quantityKg: weight,
      totalPrice: price,
      buyerId: buyer?.id || "buyer-1",
      buyerName: buyer?.name || "Eco Buyer",
      buyerPhone: buyer?.phone || "+91 97909 00000",
      buyerAddress: `${buyer?.address || 'Central District'}, ${buyer?.city || product.city}, ${buyer?.state || product.state}`,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      sellerAddress: `${product.address}, ${product.city}, ${product.state}`,
      status: "Pending",
      transportRequestStatus: "ORDER_CONFIRMED",
      transportCompanyId: null,
      transportCompanyName: null,
      driverId: null,
      driverName: null,
      vehicleNumber: null,
      pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryEstimate: "2 Days",
      pickupCoordinates: [product.lat || 13.0827, product.lng || 80.2707],
      deliveryCoordinates: [(product.lat || 13.0827) + 0.05, (product.lng || 80.2707) + 0.05],
      currentTransportCoordinates: [product.lat || 13.0827, product.lng || 80.2707],
      paymentMethod: "UPI / Net Banking Secured",
      co2SavedKg: product.co2SavedKg || 100,
      createdAt: new Date().toLocaleString()
    };

    setOrders(prev => [newOrder, ...(prev || [])]);

    apiService.createOrder(newOrder).catch(err => console.warn("API order create error:", err.message));

    showNotification(`Order ${newOrder.id} placed! Waiting for Seller confirmation.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, extraData = {}) => {
    setOrders(prev => (prev || []).map(ord => {
      if (ord.id === orderId) {
        const updated = {
          ...ord,
          status: newStatus,
          transportRequestStatus: extraData.transportRequestStatus || newStatus,
          ...extraData
        };

        if (newStatus === 'Completed' || newStatus === 'DELIVERED' || newStatus === 'COMPLETED') {
          setEnvironmentalImpact(env => ({
            ...env,
            totalWasteRecycledKg: (env?.totalWasteRecycledKg || 0) + (ord.quantityKg || 0),
            co2SavedKg: (env?.co2SavedKg || 0) + (ord.co2SavedKg || 100)
          }));
        }
        return updated;
      }
      return ord;
    }));

    apiService.updateOrderStatus(orderId, { status: newStatus, ...extraData }).catch(err => console.warn("API order status update error:", err.message));

    showNotification(`Order ${orderId} status: ${newStatus}`, 'info');
  };

  // Step 1: ECO MART Admin assigns 3rd Party Transportation Partner COMPANY (NOT driver)
  const assignPartnerToOrder = (orderId, transportCompanyId) => {
    const partner = (partners || []).find(p => p.id === transportCompanyId);
    const compName = partner ? partner.companyName : "GreenRoute Logistics Pvt Ltd";

    updateOrderStatus(orderId, "TRANSPORT_REQUEST_SENT", {
      transportRequestStatus: "TRANSPORT_REQUEST_SENT",
      transportCompanyId: transportCompanyId,
      transportCompanyName: compName
    });

    apiService.assignPartnerToOrder(orderId, transportCompanyId).catch(err => console.warn("API assign partner error:", err.message));

    addNotificationAlert(
      "New Transportation Assignment Requested",
      `ECO MART Admin assigned Order ${orderId} to ${compName}. Pending partner response.`,
      "TRANSPORT_MANAGER",
      transportCompanyId
    );

    showNotification(`Order ${orderId} assigned to Partner Company: ${compName}. Request sent to partner inbox.`, 'success');
  };

  // Step 2: Transport Manager accepts the assigned ECO MART order
  const partnerAcceptOrder = (orderId) => {
    updateOrderStatus(orderId, "PARTNER_ACCEPTED", {
      transportRequestStatus: "PARTNER_ACCEPTED"
    });

    addNotificationAlert(
      "Partner Accepted Assignment",
      `Transportation Partner accepted Order ${orderId}. Pending driver and vehicle assignment.`,
      "ADMIN"
    );

    showNotification(`Assignment for Order ${orderId} accepted! Please assign a Driver & Lorry.`, 'success');
  };

  // Step 2b: Transport Manager rejects the assigned order
  const partnerRejectOrder = (orderId, reason = "Fleet Capacity Full") => {
    updateOrderStatus(orderId, "PARTNER_REJECTED", {
      transportRequestStatus: "PARTNER_REJECTED",
      transportCompanyId: null,
      transportCompanyName: null
    });

    addNotificationAlert(
      "Partner Rejected Assignment",
      `Transportation Partner rejected Order ${orderId} (${reason}). Admin must reassign.`,
      "ADMIN"
    );

    showNotification(`Assignment for Order ${orderId} rejected. Reverted to Admin queue.`, 'info');
  };

  // Step 3: Transport Manager assigns their OWN Driver & Fleet Vehicle
  const assignDriverAndVehicleToOrder = (orderId, driverId, vehicleNumber) => {
    const driver = (companyDrivers || []).find(d => d.driverId === driverId || d.id === driverId);
    const assignedDriverId = driver ? driver.driverId : driverId;

    updateOrderStatus(orderId, "DRIVER_ASSIGNED", {
      transportRequestStatus: "DRIVER_ASSIGNED",
      driverId: assignedDriverId,
      driverName: driver ? driver.name : "Assigned Driver",
      driverPhone: driver ? driver.phone : "+91 98401 00000",
      vehicleNumber: vehicleNumber
    });

    // Mark Driver as ON DELIVERY in companyDrivers list
    setCompanyDrivers(prev => (prev || []).map(d => 
      (d.driverId === assignedDriverId || d.id === assignedDriverId) ? { ...d, status: "ON DELIVERY" } : d
    ));

    // Mark Fleet Vehicle as On Pickup
    setFleetVehicles(prev => (prev || []).map(v => 
      v.vehicleNumber === vehicleNumber ? { ...v, currentStatus: "On Pickup", assignedOrderId: orderId } : v
    ));

    addNotificationAlert(
      "Driver & Vehicle Dispatched",
      `Driver ${driver?.name || driverId} with Vehicle ${vehicleNumber} assigned to Order ${orderId}. Status set to ON DELIVERY.`,
      "ADMIN"
    );

    showNotification(`Order ${orderId} assigned to Driver ${driver?.name || driverId}! Driver status updated to ON DELIVERY.`, 'success');
  };

  // Step 4: Driver Accepts Assigned Trip
  const driverAcceptTrip = (orderId) => {
    updateOrderStatus(orderId, "DRIVER_ACCEPTED", {
      transportRequestStatus: "DRIVER_ACCEPTED"
    });

    const ord = (orders || []).find(o => o.id === orderId);
    if (ord && ord.driverId) {
      setCompanyDrivers(prev => (prev || []).map(d => 
        (d.driverId === ord.driverId || d.id === ord.driverId) ? { ...d, status: "ON DELIVERY" } : d
      ));
      if (ord.vehicleNumber) {
        setFleetVehicles(prev => (prev || []).map(v => 
          v.vehicleNumber === ord.vehicleNumber ? { ...v, currentStatus: "In Transit", assignedOrderId: orderId } : v
        ));
      }
    }

    addNotificationAlert(
      "Driver Accepted Trip",
      `Driver accepted assigned trip for Order ${orderId}. Driver status is ON DELIVERY.`,
      "TRANSPORT_MANAGER"
    );

    showNotification(`Trip for Order ${orderId} accepted! Ready to start pickup.`, 'success');
  };

  // Step 5: Driver Advances Trip Lifecycle
  const driverUpdateTripStatus = (orderId, nextStatus) => {
    updateOrderStatus(orderId, nextStatus, {
      transportRequestStatus: nextStatus
    });

    // If trip is completed/delivered, free up Driver & Lorry back to AVAILABLE!
    if (['COMPLETED', 'DELIVERED', 'Completed'].includes(nextStatus)) {
      const ord = (orders || []).find(o => o.id === orderId);
      if (ord && ord.driverId) {
        setCompanyDrivers(prev => (prev || []).map(d => 
          (d.driverId === ord.driverId || d.id === ord.driverId) ? { ...d, status: "AVAILABLE" } : d
        ));
      }
      if (ord && ord.vehicleNumber) {
        setFleetVehicles(prev => (prev || []).map(v => 
          v.vehicleNumber === ord.vehicleNumber ? { ...v, currentStatus: "Available", assignedOrderId: null } : v
        ));
      }
    }

    addNotificationAlert(
      `Trip Status Updated: ${nextStatus}`,
      `Order ${orderId} advanced to ${nextStatus}.`,
      "ALL"
    );

    showNotification(`Order ${orderId} updated to ${nextStatus}.`, 'info');
  };

  return (
    <DataContext.Provider value={{
      products,
      partners,
      fleetVehicles,
      companyDrivers,
      orders,
      environmentalImpact,
      appNotifications,
      addProduct,
      deleteProduct,
      updateProductStatus,
      addPartnerCompany,
      updatePartnerStatus,
      addFleetVehicle,
      addCompanyDriver,
      placeOrder,
      updateOrderStatus,
      assignPartnerToOrder,
      partnerAcceptOrder,
      partnerRejectOrder,
      assignDriverAndVehicleToOrder,
      driverAcceptTrip,
      driverUpdateTripStatus,
      addNotificationAlert
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
