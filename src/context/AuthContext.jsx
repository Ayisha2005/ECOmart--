import React, { createContext, useContext, useState, useEffect } from 'react';

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
    id: "user-admin-1",
    name: "Platform Administrator",
    email: "admin@ecomart.in",
    phone: "+91 98765 00000",
    password: "Admin@123",
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
  // Transport Manager Accounts (External 3rd Party Partner)
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
    city: "Chennai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
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
  // Transport Driver Accounts
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
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
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
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    rating: 4.8,
    tripsCompleted: 98,
    experienceYears: 4
  },
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
      const parsed = JSON.parse(saved);
      // Ensure PRESEEDED accounts TRM001 and DRV001 exist
      const hasTrm001 = parsed.some(u => u.transportId === 'TRM001' || u.id === 'TRM001');
      const hasDrv001 = parsed.some(u => u.driverId === 'DRV001' || u.id === 'DRV001');
      if (!hasTrm001 || !hasDrv001) return PRESEEDED_USERS;
      return parsed;
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

  const registerSellerBuyer = (formData, selectedRole) => {
    const { email, phone } = formData;
    const normalizedSelectedRole = normalizeRole(selectedRole);

    if (!['SELLER', 'BUYER'].includes(normalizedSelectedRole)) {
      showNotification("Public registration is strictly restricted to Sellers and Buyers.", 'error');
      return { success: false, error: "Unauthorized role selection" };
    }

    const existing = users.find(u => u.email?.toLowerCase() === email.toLowerCase() || u.phone === phone);
    if (existing) {
      showNotification(`Account already exists with this ${existing.email?.toLowerCase() === email.toLowerCase() ? 'email' : 'phone number'}. Please login.`, 'error');
      return { success: false, error: "Account already exists" };
    }

    const newUser = {
      id: `user-${normalizedSelectedRole.toLowerCase()}-${Date.now()}`,
      ...formData,
      role: normalizedSelectedRole
    };

    setUsers(prev => [...prev, newUser]);
    showNotification(`Registration successful as ${normalizedSelectedRole}! Please login.`, 'success');
    return { success: true, user: newUser };
  };

  const registerAdmin = (formData) => {
    const { email } = formData;
    const existing = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      showNotification("Admin email already registered. Please login.", 'error');
      return { success: false, error: "Email exists" };
    }

    const newAdmin = {
      id: `user-admin-${Date.now()}`,
      ...formData,
      role: "ADMIN"
    };

    setUsers(prev => [...prev, newAdmin]);
    showNotification("Admin registered successfully! Please login at Admin Portal.", 'success');
    return { success: true, user: newAdmin };
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

  const login = (identifier, password, expectedPortalRole) => {
    if (!identifier || !password) {
      showNotification("Please enter your login identifier and password.", 'error');
      return { success: false, error: "Missing fields" };
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Flexible identifier matching: email, transportId, driverId, id, or phone number!
    const foundUser = users.find(u => {
      const matchEmail = u.email?.toLowerCase() === cleanIdentifier;
      const matchTransportId = u.transportId?.toLowerCase() === cleanIdentifier;
      const matchDriverId = u.driverId?.toLowerCase() === cleanIdentifier;
      const matchId = u.id?.toLowerCase() === cleanIdentifier;
      const matchPhone = u.phone?.replace(/\D/g, '') === cleanIdentifier;
      
      const pwdMatches = u.password === cleanPassword;
      return (matchEmail || matchTransportId || matchDriverId || matchId || matchPhone) && pwdMatches;
    });

    if (!foundUser) {
      showNotification(`Invalid credentials for '${identifier}'. Demo Manager: TRM001 / Manager@123 | Demo Driver: DRV001 / Driver@123.`, 'error');
      return { success: false, error: "Invalid credentials" };
    }

    const userNormalizedRole = normalizeRole(foundUser.role);
    const expectedNormalizedRole = normalizeRole(expectedPortalRole);

    if (expectedNormalizedRole && userNormalizedRole !== expectedNormalizedRole) {
      showNotification(`This account is registered as ${userNormalizedRole}. Please use the ${userNormalizedRole} login portal.`, 'error');
      return { success: false, error: "Role mismatch" };
    }

    const updatedUser = {
      ...foundUser,
      role: userNormalizedRole
    };

    setCurrentUser(updatedUser);
    setRole(userNormalizedRole);

    const authState = {
      isAuthenticated: true,
      user: updatedUser,
      role: userNormalizedRole,
      transportCompanyId: updatedUser.transportCompanyId || null
    };

    localStorage.setItem('ecoMartUser', JSON.stringify(updatedUser));
    localStorage.setItem('ecoMartRole', userNormalizedRole);
    localStorage.setItem('ecoMartAuth', JSON.stringify(authState));

    showNotification(`Welcome back, ${updatedUser.name}! Logged in as ${userNormalizedRole}.`, 'success');
    return { success: true, user: updatedUser };
  };

  const updateUserProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    localStorage.setItem('ecoMartUser', JSON.stringify(updated));
    showNotification("Driver Profile updated successfully! ✅", 'success');
    return updated;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
    localStorage.removeItem('ecoMartUser');
    localStorage.removeItem('ecoMartRole');
    localStorage.removeItem('ecoMartAuth');
    showNotification("Logged out successfully.", 'info');
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
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
