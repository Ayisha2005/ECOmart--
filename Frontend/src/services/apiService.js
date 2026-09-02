const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://ecomart-backend-api.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Generic Fetch Helper with Bearer Authorization Token
 */
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('eco_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP Error ${response.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`API call failed [${endpoint}]:`, err.message);
    throw err;
  }
}

export const apiService = {
  // Auth API
  registerUser: (formData, role) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...formData, role })
  }),

  registerAdmin: (formData) => fetchAPI('/auth/admin/register', {
    method: 'POST',
    body: JSON.stringify(formData)
  }),

  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  getCurrentUser: () => fetchAPI('/auth/me'),

  updateUser: (userId, changes) => fetchAPI(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(changes)
  }),

  deleteUser: (userId) => fetchAPI(`/users/${userId}`, {
    method: 'DELETE'
  }),

  // Products API
  getProducts: (category, sellerId) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (sellerId) params.append('sellerId', sellerId);
    return fetchAPI(`/products?${params.toString()}`);
  },

  createProduct: (productData) => fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),

  updateProduct: (id, changes) => fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes)
  }),

  deleteProduct: (id) => fetchAPI(`/products/${id}`, {
    method: 'DELETE'
  }),

  // Orders API
  getOrders: () => fetchAPI('/orders'),

  createOrder: (orderData) => fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),

  updateOrderStatus: (orderId, statusData) => fetchAPI(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData)
  }),

  assignPartnerToOrder: (orderId, transportCompanyId) => fetchAPI(`/orders/${orderId}/assign-partner`, {
    method: 'PATCH',
    body: JSON.stringify({ transportCompanyId })
  }),

  // Transport Partners & Fleet API
  getPartners: () => fetchAPI('/partners'),

  createPartner: (partnerData) => fetchAPI('/partners', {
    method: 'POST',
    body: JSON.stringify(partnerData)
  }),

  updatePartnerStatus: (id, status) => fetchAPI(`/partners/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  deletePartner: (id) => fetchAPI(`/partners/${id}`, {
    method: 'DELETE'
  }),

  getFleet: () => fetchAPI('/fleet'),

  addFleetVehicle: (vehicleData) => fetchAPI('/fleet', {
    method: 'POST',
    body: JSON.stringify(vehicleData)
  }),

  getDrivers: () => fetchAPI('/drivers'),

  addDriver: (driverData) => fetchAPI('/drivers', {
    method: 'POST',
    body: JSON.stringify(driverData)
  }),

  // Dashboard & Metrics API
  getDashboardMetrics: () => fetchAPI('/dashboard'),

  // ECO AI Chat API (Google Gemini Multimodal + Database Context)
  sendAiChat: (chatPayload) => fetchAPI('/ai/chat', {
    method: 'POST',
    body: JSON.stringify(chatPayload)
  }),

  // Notifications & Dispatch Messages API
  getNotifications: () => fetchAPI('/notifications'),

  createNotification: (notifData) => fetchAPI('/notifications', {
    method: 'POST',
    body: JSON.stringify(notifData)
  })
};

export default apiService;
