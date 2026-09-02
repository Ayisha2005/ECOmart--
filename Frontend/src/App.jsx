import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotificationToast from './components/common/NotificationToast';
import ErrorBoundary from './components/common/ErrorBoundary';
import EcoAiChatbot from './components/common/EcoAiChatbot';

// Auth Pages
import RegisterPage from './pages/auth/RegisterPage';
import AdminRegisterPage from './pages/auth/AdminRegisterPage';
import SellerLoginPage from './pages/auth/SellerLoginPage';
import BuyerLoginPage from './pages/auth/BuyerLoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import TransportLoginPage from './pages/auth/TransportLoginPage';
import PartnerInvitationPage from './pages/auth/PartnerInvitationPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TransportManagement from './pages/admin/TransportManagement';
import AdminTransportationPartners from './pages/admin/AdminTransportationPartners';
import AddPartnerPage from './pages/admin/AddPartnerPage';
import AdminGlobalFleetMap from './pages/admin/AdminGlobalFleetMap';
import AdminUsers from './pages/admin/AdminUsers';
import AdminListings from './pages/admin/AdminListings';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminEcoImpact from './pages/admin/AdminEcoImpact';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProductPage from './pages/seller/AddProductPage';
import SellerListingsPage from './pages/seller/SellerListingsPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerEarningsPage from './pages/seller/SellerEarningsPage';
import SellerProfilePage from './pages/seller/SellerProfilePage';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerBrowsePage from './pages/buyer/BuyerBrowsePage';
import BuyerMapPage from './pages/buyer/BuyerMapPage';
import BuyerOrdersPage from './pages/buyer/BuyerOrdersPage';
import DeliveryTrackingPage from './pages/buyer/DeliveryTrackingPage';
import BuyerProfilePage from './pages/buyer/BuyerProfilePage';

// Transport Manager Pages
import TransportManagerDashboard from './pages/transport/manager/TransportManagerDashboard';
import ManagerFleetPage from './pages/transport/manager/ManagerFleetPage';
import ManagerDriversPage from './pages/transport/manager/ManagerDriversPage';
import ManagerOrdersPage from './pages/transport/manager/ManagerOrdersPage';
import ManagerTrackingPage from './pages/transport/manager/ManagerTrackingPage';
import ManagerPickupsPage from './pages/transport/manager/ManagerPickupsPage';
import ManagerTripsHistoryPage from './pages/transport/manager/ManagerTripsHistoryPage';
import ManagerReportsPage from './pages/transport/manager/ManagerReportsPage';
import ManagerProfilePage from './pages/transport/manager/ManagerProfilePage';
import ManagerMessagesPage from './pages/transport/manager/ManagerMessagesPage';
import ManagerDeliveriesPage from './pages/transport/manager/ManagerDeliveriesPage';

// Transport Driver Pages
import DriverLoginPage from './pages/transport/driver/DriverLoginPage';
import DriverDashboard from './pages/transport/driver/DriverDashboard';
import DriverRequestsPage from './pages/transport/driver/DriverRequestsPage';
import DriverNavigationPage from './pages/transport/driver/DriverNavigationPage';
import DriverHistoryPage from './pages/transport/driver/DriverHistoryPage';
import DriverProfilePage from './pages/transport/driver/DriverProfilePage';
import TransportDashboard from './pages/transport/TransportDashboard';

// Forbidden Transport Public Self-Registration
const ForbiddenTransportRegister = () => {
  return <Navigate to="/register" replace />;
};

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <NotificationToast />
            <Routes>
              {/* Root / Route ALWAYS opens directly to /register */}
              <Route path="/" element={<Navigate to="/register" replace />} />

              {/* Public Auth Routes */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/register" element={<Navigate to="/admin/login" replace />} />
              <Route path="/seller/login" element={<SellerLoginPage />} />
              <Route path="/buyer/login" element={<BuyerLoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              {/* Transportation Partner Portals */}
              <Route path="/transport/login" element={<TransportLoginPage />} />
              <Route path="/transport/partner/login" element={<TransportLoginPage />} />
              <Route path="/transport/partner/invitation" element={<PartnerInvitationPage />} />
              <Route path="/transport/driver/login" element={<DriverLoginPage />} />

              {/* Forbidden Public Transport Registration Route */}
              <Route path="/transport/register" element={<ForbiddenTransportRegister />} />

              {/* ADMIN Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/transportation"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminTransportationPartners />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/transportation-partners"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminTransportationPartners />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/transportation-partners/add"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AddPartnerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/transportation/live"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminGlobalFleetMap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/listings"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminListings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/eco-impact"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminEcoImpact />
                  </ProtectedRoute>
                }
              />

              {/* SELLER Protected Routes */}
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['SELLER']}>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/add-product"
                element={
                  <ProtectedRoute allowedRoles={['SELLER']}>
                    <AddProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/listings"
                element={
                  <ProtectedRoute allowedRoles={['SELLER']}>
                    <SellerListingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/orders"
                element={
                  <ProtectedRoute allowedRoles={['SELLER']}>
                    <SellerOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/earnings"
                element={
                  <ProtectedRoute allowedRoles={['SELLER']}>
                    <SellerEarningsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/profile"
                element={
                  <ProtectedRoute allowedRoles={['SELLER']}>
                    <SellerProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* BUYER Protected Routes */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/products"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerBrowsePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/map"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerMapPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/orders"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/tracking"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <DeliveryTrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/profile"
                element={
                  <ProtectedRoute allowedRoles={['BUYER']}>
                    <BuyerProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* TRANSPORT MANAGER / PARTNER Protected Routes */}
              <Route
                path="/transport/manager/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <TransportManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/partner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <TransportManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/fleet"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerFleetPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/partner/fleet"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerFleetPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/drivers"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerDriversPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/partner/drivers"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerDriversPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/orders"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/partner/orders"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/tracking"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerTrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/live-tracking"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerTrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/pickups"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerPickupsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/deliveries"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerDeliveriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/trips"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerTripsHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/history"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerTripsHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/reports"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/messages"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerMessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/manager/profile"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION']}>
                    <ManagerProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Legacy Transport route fallback */}
              <Route
                path="/transport/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_MANAGER', 'TRANSPORTATION', 'TRANSPORT_DRIVER']}>
                    <TransportDashboard />
                  </ProtectedRoute>
                }
              />

              {/* TRANSPORT DRIVER Protected Routes */}
              <Route
                path="/transport/driver/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_DRIVER']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/driver/requests"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_DRIVER']}>
                    <DriverRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/driver/navigation"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_DRIVER']}>
                    <DriverNavigationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/driver/history"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_DRIVER']}>
                    <DriverHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport/driver/profile"
                element={
                  <ProtectedRoute allowedRoles={['TRANSPORT_DRIVER']}>
                    <DriverProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-All Route ALWAYS opens Registration Page */}
              <Route path="*" element={<Navigate to="/register" replace />} />
            </Routes>
            <EcoAiChatbot />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
