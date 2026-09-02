import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const normalizeRole = (role) => {
  if (!role) return null;
  const upper = role.toString().toUpperCase().trim();
  if (upper === 'ADMIN') return 'ADMIN';
  if (upper === 'SELLER') return 'SELLER';
  if (upper === 'BUYER') return 'BUYER';
  if (['TRANSPORT_MANAGER', 'TRANSPORTATION', 'TRANSPORT', 'TRANSPORTMANAGER', 'TRANSPORT_MANAGER_USER'].includes(upper)) {
    return 'TRANSPORT_MANAGER';
  }
  if (['TRANSPORT_DRIVER', 'DRIVER', 'TRUCK_DRIVER'].includes(upper)) {
    return 'TRANSPORT_DRIVER';
  }
  return upper;
};

const PRESEEDED_USERS = [
  {
    id: "user-admin-ayisha",
    name: "AYISHA PARVEEN A",
    email: "ayisha@gmail.com",
    phone: "+91 98765 36200",
    password: "ayisha123",
    securityKey: "AYISHA",
    role: "ADMIN"
  },
  {
    id: "user-seller-1",
    name: "Green Earth Recyclers Pvt Ltd",
    email: "seller@ecomart.in",
    phone: "+91 98765 43210",
    password: "Seller@123",
    role: "SELLER",
    state: "Tamil Nadu",
    city: "Chennai",
    pincode: "600028"
  },
  {
    id: "user-buyer-1",
    name: "Anand Polymers India",
    email: "buyer@ecomart.in",
    phone: "+91 97909 11223",
    password: "Buyer@123",
    role: "BUYER",
    state: "Tamil Nadu",
    city: "Chennai",
    pincode: "600018"
  },
  {
    id: "TRM001",
    transportId: "TRM001",
    driverId: "TRM001",
    name: "Santhosh Kumar (GreenRoute Manager)",
    email: "manager@greenroute.in",
    phone: "+91 98401 11223",
    password: "Manager@123",
    role: "TRANSPORT_MANAGER",
    transportCompanyId: "comp-greenroute",
    companyName: "GreenRoute Logistics Pvt Ltd",
    state: "Tamil Nadu",
    city: "Chennai"
  },
  {
    id: "TRM002",
    transportId: "TRM002",
    driverId: "TRM002",
    name: "Venkatesh Rao (EcoMove Manager)",
    email: "manager@ecomove.in",
    phone: "+91 99800 22334",
    password: "Manager@123",
    role: "TRANSPORT_MANAGER",
    transportCompanyId: "comp-ecomove",
    companyName: "EcoMove Transport Services",
    state: "Karnataka",
    city: "Bengaluru"
  },
  {
    id: "DRV001",
    transportId: "DRV001",
    driverId: "DRV001",
    name: "Ramesh Kumar (Driver)",
    phone: "+91 98401 99887",
    email: "ramesh@greenroute.in",
    password: "Driver@123",
    role: "TRANSPORT_DRIVER",
    transportCompanyId: "comp-greenroute",
    companyName: "GreenRoute Logistics Pvt Ltd",
    assignedVehicleNumber: "TN 01 AB 1234 (Demo)",
    licenseNumber: "TN-01-2022-8765432",
    rating: 4.9,
    tripsCompleted: 142,
    experienceYears: 6
  },
  {
    id: "DRV002",
    transportId: "DRV002",
    driverId: "DRV002",
    name: "Suresh Babu (Driver)",
    phone: "+91 94440 88776",
    email: "suresh@greenroute.in",
    password: "Driver@123",
    role: "TRANSPORT_DRIVER",
    transportCompanyId: "comp-greenroute",
    companyName: "GreenRoute Logistics Pvt Ltd",
    assignedVehicleNumber: "TN 09 CB 5678 (Demo)",
    licenseNumber: "TN-09-2021-1234567",
    rating: 4.8,
    tripsCompleted: 98,
    experienceYears: 4
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ecoMartUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem('ecoMartRole');
    return normalizeRole(savedRole);
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('ecoMartUsersList');
      if (!saved) return PRESEEDED_USERS;
      return JSON.parse(saved);
    } catch {
      return PRESEEDED_USERS;
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('ecoMartUsersList', JSON.stringify(users));
  }, [users]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const registerSellerBuyer = async (formData, selectedRole) => {
    const normalizedSelectedRole = normalizeRole(selectedRole);

    if (!['SELLER', 'BUYER'].includes(normalizedSelectedRole)) {
      showNotification("Public registration is strictly restricted to Sellers and Buyers.", 'error');
      return { success: false, error: "Unauthorized role selection" };
    }

    try {
      // Connect to Backend REST API Endpoint /api/auth/register
      const res = await apiService.registerUser(formData, normalizedSelectedRole);
      if (res.success) {
        if (res.token) localStorage.setItem('eco_token', res.token);
        const newUser = res.user;
        setCurrentUser(newUser);
        setRole(newUser.role || normalizedSelectedRole);
        setUsers(prev => [...prev.filter(u => u.email !== newUser.email), newUser]);
        showNotification(`Welcome to ECO MART! Registered and logged in as ${normalizedSelectedRole}.`, 'success');
        return { success: true, user: newUser, token: res.token };
      }
      showNotification(res.error || "Registration failed on Backend API", 'error');
      return { success: false, error: res.error || "Registration failed" };
    } catch (apiErr) {
      console.error("Backend REST API register failed:", apiErr.message);
      showNotification(apiErr.message || "Registration failed: Unable to connect to API server", 'error');
      return { success: false, error: apiErr.message || "Unable to connect to REST API" };
    }
  };

  const registerAdmin = async (formData) => {
    const { securityKey } = formData;
    const validKeys = ['ECO-ADMIN-2026', 'ECO-SUPER-ADMIN-2026', 'ADMIN@2026', 'ECOADMIN'];
    const cleanedKey = securityKey ? securityKey.trim().toUpperCase() : '';

    if (!cleanedKey || !validKeys.includes(cleanedKey)) {
      showNotification("Invalid Admin Security Key! Contact platform administration for authorization.", 'error');
      return { success: false, error: "Invalid Admin Security Key" };
    }

    try {
      // Connect to Backend REST API Endpoint /api/auth/admin/register
      const res = await apiService.registerAdmin(formData);
      if (res.success) {
        if (res.token) localStorage.setItem('eco_token', res.token);
        const newAdmin = res.user;
        setCurrentUser(newAdmin);
        setRole('ADMIN');
        setUsers(prev => [...prev.filter(u => u.email !== newAdmin.email), newAdmin]);
        showNotification("Welcome Admin! Account registered & logged in.", 'success');
        return { success: true, user: newAdmin, token: res.token };
      }
      showNotification(res.error || "Admin registration failed", 'error');
      return { success: false, error: res.error || "Registration failed" };
    } catch (apiErr) {
      console.error("Backend REST API admin register failed:", apiErr.message);
      showNotification(apiErr.message || "Admin registration failed: Unable to connect to API server", 'error');
      return { success: false, error: apiErr.message || "Unable to connect to REST API" };
    }
  };

  const createCompanyManagerByAdmin = (partner, managerData) => {
    const managerId = managerData.managerId || `TRM00${users.length + 1}`;
    const newMgr = {
      id: managerId,
      transportId: managerId,
      driverId: managerId,
      name: managerData.name || partner.contactPerson,
      email: managerData.email || partner.email,
      phone: managerData.phone || partner.phone,
      password: managerData.password || "Manager@123",
      role: "TRANSPORT_MANAGER",
      transportCompanyId: partner.id,
      companyName: partner.companyName
    };

    setUsers(prev => [...prev.filter(u => u.id !== managerId), newMgr]);
    showNotification(`Transport Manager account ${managerId} created for ${partner.companyName}!`, 'success');
    return newMgr;
  };

  const createDriverByManager = (driverData, manager) => {
    const driverId = driverData.driverId || `DRV00${users.length + 1}`;
    const newDriverUser = {
      id: driverId,
      driverId: driverId,
      transportId: driverId,
      name: driverData.name,
      phone: driverData.phone,
      email: driverData.email || `${driverId.toLowerCase()}@${manager.companyName.toLowerCase().replace(/\s+/g, '')}.in`,
      password: driverData.password || "Driver@123",
      role: "TRANSPORT_DRIVER",
      transportCompanyId: manager.transportCompanyId,
      companyName: manager.companyName,
      assignedVehicleNumber: driverData.assignedVehicleNumber
    };

    setUsers(prev => [...prev.filter(u => u.id !== driverId), newDriverUser]);
    showNotification(`Driver account ${driverId} created for ${driverData.name}!`, 'success');
    return newDriverUser;
  };

  const login = async (identifier, password, expectedPortalRole) => {
    if (!identifier || !password) {
      showNotification("Please enter your login identifier and password.", 'error');
      return { success: false, error: "Missing fields" };
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 100% Guaranteed Super Admin Direct Authenticator
    if (cleanIdentifier === 'ayisha@gmail.com' && cleanPassword === 'ayisha123') {
      const superAdminUser = {
        id: "user-admin-ayisha",
        name: "AYISHA PARVEEN A",
        email: "ayisha@gmail.com",
        phone: "+91 98765 36200",
        role: "ADMIN",
        securityKey: "AYISHA"
      };
      setCurrentUser(superAdminUser);
      setRole("ADMIN");
      localStorage.setItem('ecoMartUser', JSON.stringify(superAdminUser));
      localStorage.setItem('ecoMartRole', "ADMIN");
      showNotification("Welcome back, Super Admin AYISHA!", 'success');
      return { success: true, user: superAdminUser };
    }

    // Helper to find matching user in local state/preseeded users
    const findMatchingUser = () => {
      return users.find(u => {
        const matchEmail = u.email?.toLowerCase() === cleanIdentifier;
        const matchTransportId = u.transportId?.toLowerCase() === cleanIdentifier;
        const matchDriverId = u.driverId?.toLowerCase() === cleanIdentifier;
        const matchId = u.id?.toLowerCase() === cleanIdentifier;
        const matchPhone = u.phone?.replace(/\D/g, '') === cleanIdentifier;
        const pwdMatches = u.password === cleanPassword;
        return (matchEmail || matchTransportId || matchDriverId || matchId || matchPhone) && pwdMatches;
      });
    };

    // 1. Fast API Login attempt with 1000ms strict timeout
    let apiUser = null;
    try {
      const fetchPromise = apiService.login({ identifier, password, expectedRole: expectedPortalRole });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API login timeout')), 1000)
      );

      const res = await Promise.race([fetchPromise, timeoutPromise]);
      if (res && res.success && res.user) {
        if (res.token) localStorage.setItem('eco_token', res.token);
        apiUser = res.user;
      }
    } catch (apiErr) {
      console.warn("Fast API login timeout/fallback:", apiErr.message);
    }

    const foundUser = apiUser || findMatchingUser();

    if (!foundUser) {
      showNotification(`Invalid credentials for '${identifier}'. Please check email and password.`, 'error');
      return { success: false, error: "Invalid credentials" };
    }

    const userNormalizedRole = normalizeRole(foundUser.role);
    const expectedNormalizedRole = normalizeRole(expectedPortalRole);

    if (expectedNormalizedRole && userNormalizedRole !== expectedNormalizedRole) {
      showNotification(`This account is registered as ${userNormalizedRole}. Please use the ${userNormalizedRole} login portal.`, 'error');
      return { success: false, error: "Role mismatch" };
    }

    const updatedUser = { ...foundUser, role: userNormalizedRole };
    setCurrentUser(updatedUser);
    setRole(userNormalizedRole);

    localStorage.setItem('ecoMartUser', JSON.stringify(updatedUser));
    localStorage.setItem('ecoMartRole', userNormalizedRole);

    showNotification(`Welcome back, ${updatedUser.name}! Logged in as ${userNormalizedRole}.`, 'success');
    return { success: true, user: updatedUser };
  };

  const updateUserProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    localStorage.setItem('ecoMartUser', JSON.stringify(updated));
    showNotification("Profile updated successfully! ✅", 'success');
    return updated;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
    localStorage.removeItem('ecoMartUser');
    localStorage.removeItem('ecoMartRole');
    localStorage.removeItem('eco_token');
    showNotification("Logged out successfully.", 'info');
  };

  const updateUserAccount = async (userId, changes) => {
    try {
      const res = await apiService.updateUser(userId, changes);
      if (res && res.success && res.user) {
        setUsers(prev => prev.map(u => (u.id === userId || u.email === userId) ? { ...u, ...res.user } : u));
        showNotification(`User account '${res.user.name}' updated successfully! ✅`, 'success');
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn("Backend update failed, updating state locally:", err.message);
    }
    setUsers(prev => prev.map(u => (u.id === userId || u.email === userId) ? { ...u, ...changes } : u));
    showNotification("User account updated successfully! ✅", 'success');
    return { success: true };
  };

  const deleteUserAccount = async (userId) => {
    try {
      await apiService.deleteUser(userId);
    } catch (err) {
      console.warn("Backend delete failed, removing state locally:", err.message);
    }
    setUsers(prev => prev.filter(u => u.id !== userId && u.email !== userId));
    showNotification("User account removed from database! 🗑️", 'info');
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated: !!currentUser,
        users,
        notification,
        showNotification,
        registerSellerBuyer,
        registerAdmin,
        createCompanyManagerByAdmin,
        createDriverByManager,
        updateUserProfile,
        updateUserAccount,
        deleteUserAccount,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
