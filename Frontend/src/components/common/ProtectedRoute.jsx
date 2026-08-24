import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, normalizeRole } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser, role, showNotification } = useAuth();
  const location = useLocation();

  const userNormalizedRole = normalizeRole(role || currentUser?.role);
  const normalizedAllowedRoles = allowedRoles ? allowedRoles.map(r => normalizeRole(r)) : null;

  useEffect(() => {
    if (isAuthenticated && userNormalizedRole && normalizedAllowedRoles && !normalizedAllowedRoles.includes(userNormalizedRole)) {
      showNotification(`Access Denied! Logged in as ${userNormalizedRole}. Cannot access ${location.pathname}.`, 'error');
    }
  }, [location.pathname, userNormalizedRole, isAuthenticated, normalizedAllowedRoles, showNotification]);

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/register" replace />;
  }

  if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(userNormalizedRole)) {
    switch (userNormalizedRole) {
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'SELLER':
        return <Navigate to="/seller/dashboard" replace />;
      case 'BUYER':
        return <Navigate to="/buyer/dashboard" replace />;
      case 'TRANSPORT_MANAGER':
        return <Navigate to="/transport/manager/dashboard" replace />;
      case 'TRANSPORT_DRIVER':
        return <Navigate to="/transport/driver/dashboard" replace />;
      default:
        return <Navigate to="/register" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
