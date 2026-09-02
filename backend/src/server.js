import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { randomUUID } from 'node:crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, '../../Frontend/dist');

// Import Custom Middlewares & Swagger Config
import { verifyToken, authorizeRoles, requireAdminSecurityKey } from './middleware/authMiddleware.js';
import { validateRegistration, validateLogin, validateProduct } from './middleware/validationMiddleware.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import { loggerMiddleware } from './middleware/loggerMiddleware.js';
import { swaggerSpec } from './config/swagger.js';
import { generateEcoAiResponse } from './services/geminiService.js';

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET || 'eco-mart-secret-key-2026';
const allowedOrigin = process.env.CLIENT_ORIGIN || '*';

// Base Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(loggerMiddleware);

// Swagger Documentation Route
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Demo Seed Data
const demoUsers = [
  { id: 'user-admin-ayisha', name: 'AYISHA PARVEEN A', email: 'ayisha@gmail.com', phone: '+91 98765 36200', password: 'ayisha123', role: 'ADMIN', securityKey: 'AYISHA' },
  { id: 'user-seller-1', name: 'Green Earth Recyclers Pvt Ltd', email: 'seller@ecomart.in', phone: '+91 98765 43210', password: 'Seller@123', role: 'SELLER', state: 'Tamil Nadu', city: 'Chennai', pincode: '600028' },
  { id: 'user-buyer-1', name: 'Anand Polymers India', email: 'buyer@ecomart.in', phone: '+91 97909 11223', password: 'Buyer@123', role: 'BUYER', state: 'Tamil Nadu', city: 'Chennai', pincode: '600018' },
  { id: 'TRM001', transportId: 'TRM001', driverId: 'TRM001', name: 'Santhosh Kumar (GreenRoute Manager)', email: 'manager@greenroute.in', phone: '+91 98401 11223', password: 'Manager@123', role: 'TRANSPORT_MANAGER', transportCompanyId: 'comp-greenroute', companyName: 'GreenRoute Logistics Pvt Ltd', state: 'Tamil Nadu', city: 'Chennai' },
  { id: 'TRM002', transportId: 'TRM002', driverId: 'TRM002', name: 'Venkatesh Rao (EcoMove Manager)', email: 'manager@ecomove.in', phone: '+91 99800 22334', password: 'Manager@123', role: 'TRANSPORT_MANAGER', transportCompanyId: 'comp-ecomove', companyName: 'EcoMove Transport Services', state: 'Karnataka', city: 'Bengaluru' },
  { id: 'DRV001', transportId: 'DRV001', driverId: 'DRV001', name: 'Ramesh Kumar (Driver)', email: 'ramesh@greenroute.in', phone: '+91 98401 99887', password: 'Driver@123', role: 'TRANSPORT_DRIVER', transportCompanyId: 'comp-greenroute', companyName: 'GreenRoute Logistics Pvt Ltd', assignedVehicleNumber: 'TN 01 AB 1234 (Demo)', licenseNumber: 'TN-01-2022-8765432', rating: 4.9, tripsCompleted: 142, experienceYears: 6 },
  { id: 'DRV002', transportId: 'DRV002', driverId: 'DRV002', name: 'Suresh Babu (Driver)', email: 'suresh@greenroute.in', phone: '+91 94440 88776', password: 'Driver@123', role: 'TRANSPORT_DRIVER', transportCompanyId: 'comp-greenroute', companyName: 'GreenRoute Logistics Pvt Ltd', assignedVehicleNumber: 'TN 09 CB 5678 (Demo)', licenseNumber: 'TN-09-2021-1234567', rating: 4.8, tripsCompleted: 98, experienceYears: 4 }
];

const demoPartners = [
  { id: 'comp-greenroute', companyName: 'GreenRoute Logistics Pvt Ltd (Demo Partner)', registrationNo: 'TN-LOG-2024-8891', contactPerson: 'Santhosh Kumar', phone: '+91 98401 11223', email: 'contact@greenroute.in', state: 'Tamil Nadu', city: 'Chennai', serviceAreas: 'Chennai Metro, Kanchipuram, Tiruvallur', partnerStatus: 'ACTIVE', agreementStatus: 'Verified' },
  { id: 'comp-ecomove', companyName: 'EcoMove Transport Services (Demo Partner)', registrationNo: 'KA-LOG-2024-4412', contactPerson: 'Venkatesh Rao', phone: '+91 99800 22334', email: 'support@ecomove.in', state: 'Karnataka', city: 'Bengaluru', serviceAreas: 'Bengaluru Urban, Mysuru, Hosur', partnerStatus: 'ACTIVE', agreementStatus: 'Verified' }
];

const demoProducts = [
  { id: 'PROD-101', title: 'High-Grade PET Plastic Bottle Bundles', category: 'plastic', categoryLabel: 'Plastic', description: 'Compressed PET clear bottles, cleaned and sorted.', price: 12500, weightKg: 500, unit: 'kg', sellerId: 'user-seller-1', sellerName: 'Green Earth Recyclers Pvt Ltd', sellerPhone: '+91 98765 43210', state: 'Tamil Nadu', city: 'Chennai', pincode: '600028', address: 'Plot 42, Guindy Industrial Estate', lat: 13.0067, lng: 80.202, images: ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'], condition: 'Sorted & Cleaned', availability: 'Immediate', co2SavedKg: 750, createdAt: '2026-08-18' },
  { id: 'PROD-102', title: 'Industrial Corrugated Cardboard Bales', category: 'paper', categoryLabel: 'Paper', description: 'Dry warehouse cardboard baled in blocks.', price: 8400, weightKg: 1200, unit: 'kg', sellerId: 'user-seller-1', sellerName: 'Tamil Nadu Scrap Solutions', sellerPhone: '+91 94440 12345', state: 'Tamil Nadu', city: 'Coimbatore', pincode: '641004', address: 'Peelamedu Eco Park', lat: 11.0287, lng: 76.9958, images: [], condition: 'Dry & Compressed', availability: 'Immediate', co2SavedKg: 1440, createdAt: '2026-08-19' }
];

const demoFleet = [
  { id: 'veh-101', vehicleId: 'V-TN-01', vehicleNumber: 'TN 01 AB 1234 (Demo)', vehicleType: 'Tata Ace EV (Electric)', capacity: '1.5 Tons', driverId: 'DRV001', driverName: 'Ramesh Kumar', driverPhone: '+91 98401 99887', transportCompanyId: 'comp-greenroute', companyName: 'GreenRoute Logistics Pvt Ltd', currentStatus: 'In Transit', lat: 13.0827, lng: 80.2707, assignedOrderId: null, serviceArea: 'Chennai Metro' },
  { id: 'veh-102', vehicleId: 'V-TN-02', vehicleNumber: 'TN 09 CB 4512 (Demo)', vehicleType: 'Mahindra Zor Grand EV', capacity: '1.0 Ton', driverId: 'DRV002', driverName: 'Suresh Babu', driverPhone: '+91 94440 88776', transportCompanyId: 'comp-greenroute', companyName: 'GreenRoute Logistics Pvt Ltd', currentStatus: 'Available', lat: 13.1147, lng: 80.1548, assignedOrderId: null, serviceArea: 'Chennai Metro' }
];

const demoDrivers = [
  { id: 'driver-1', driverId: 'DRV001', name: 'Ramesh Kumar', phone: '+91 98401 99887', licenseNumber: 'TN01-2018-009841', transportCompanyId: 'comp-greenroute', companyName: 'GreenRoute Logistics Pvt Ltd', assignedVehicleNumber: 'TN 01 AB 1234 (Demo)', rating: 4.9, status: 'On Delivery', completedTripsCount: 48 },
  { id: 'driver-2', driverId: 'DRV002', name: 'Suresh Babu', phone: '+91 94440 88776', licenseNumber: 'TN09-2021-1234567', transportCompanyId: 'comp-greenroute', companyName: 'GreenRoute Logistics Pvt Ltd', assignedVehicleNumber: 'TN 09 CB 4512 (Demo)', rating: 4.8, status: 'Available', completedTripsCount: 30 }
];

const memory = {
  users: [],
  products: [],
  partners: [],
  fleet: [],
  drivers: [],
  orders: [],
  notifications: [],
  impact: { totalWasteRecycledKg: 48520, co2SavedKg: 72780, treesPreserved: 2426, plasticDivertedKg: 18400, paperRecoveredKg: 14200, eWasteRecycledKg: 8900 }
};

const cleanUser = user => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

const id = prefix => `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}`;

const seedMemory = () => {
  memory.users = demoUsers.map(user => ({ ...user, password: bcrypt.hashSync(user.password, 10) }));
  memory.products = [...demoProducts];
  memory.partners = [...demoPartners];
  memory.fleet = [...demoFleet];
  memory.drivers = [...demoDrivers];
};

const schemas = {
  User: new mongoose.Schema({ id: { type: String, unique: true }, name: String, email: { type: String, lowercase: true, index: true }, phone: String, password: String, role: String, transportId: String, driverId: String, transportCompanyId: String, companyName: String, state: String, city: String, pincode: String, address: String, licenseNumber: String, assignedVehicleNumber: String, avatar: String, rating: Number, tripsCompleted: Number, experienceYears: Number }, { strict: false, timestamps: true }),
  Product: new mongoose.Schema({ id: { type: String, unique: true }, title: String, category: String, categoryLabel: String, description: String, price: Number, weightKg: Number, sellerId: String, sellerName: String, state: String, city: String, lat: Number, lng: Number, images: [String] }, { strict: false, timestamps: true }),
  Partner: new mongoose.Schema({ id: { type: String, unique: true }, companyName: String, partnerStatus: String }, { strict: false, timestamps: true }),
  Fleet: new mongoose.Schema({ id: { type: String, unique: true }, vehicleNumber: String, transportCompanyId: String }, { strict: false, timestamps: true }),
  Driver: new mongoose.Schema({ id: { type: String, unique: true }, driverId: String, transportCompanyId: String }, { strict: false, timestamps: true }),
  Order: new mongoose.Schema({ id: { type: String, unique: true }, productId: String, buyerId: String, sellerId: String, status: String, transportRequestStatus: String, transportCompanyId: String, driverId: String, vehicleNumber: String }, { strict: false, timestamps: true }),
  Notification: new mongoose.Schema({ id: { type: String, unique: true }, title: String, message: String, recipientRole: String, transportCompanyId: String, orderId: String, status: String, timestamp: String }, { strict: false, timestamps: true }),
  FleetLog: new mongoose.Schema({ id: { type: String, unique: true }, orderId: String, vehicleNumber: String, driverId: String, driverName: String, transportCompanyId: String, category: String, statusLabel: String, productTitle: String, quantityKg: Number, sellerAddress: String, buyerAddress: String, timestamp: String }, { strict: false, timestamps: true })
};

let db = null;
const stores = {};
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ayishaparveen932_db_user:KGDagtAhfC5TZqRF@ecomart.k6qvvps.mongodb.net/ecomart?retryWrites=true&w=majority&appName=ECOMART';

async function connectDatabase() {
  if (!MONGODB_URI) {
    seedMemory();
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'ecomart' });
    for (const [name, schema] of Object.entries(schemas)) {
      stores[name.toLowerCase()] = mongoose.models[name] || mongoose.model(name, schema);
    }

    // Ensure preseeded demo accounts (Super Admin AYISHA PARVEEN A, Seller, Buyer, Managers, Drivers) exist in MongoDB Atlas
    for (const demoUser of demoUsers) {
      const existing = await stores.user.findOne({ email: demoUser.email.toLowerCase() });
      if (!existing) {
        const hashedPassword = bcrypt.hashSync(demoUser.password, 10);
        await stores.user.create({ ...demoUser, password: hashedPassword });
      } else if (demoUser.email.toLowerCase() === 'ayisha@gmail.com') {
        const hashedPassword = bcrypt.hashSync(demoUser.password, 10);
        await stores.user.updateOne(
          { email: demoUser.email.toLowerCase() },
          { $set: { name: demoUser.name, password: hashedPassword, role: 'ADMIN', securityKey: 'AYISHA' } }
        );
      }
    }

    // Automatically purge any legacy Admin documents from MongoDB Atlas except Super Admin ayisha@gmail.com
    await stores.user.deleteMany({
      role: 'ADMIN',
      email: { $ne: 'ayisha@gmail.com' }
    });

const demoOrders = [
  {
    id: "ORD-8421",
    productId: "PROD-101",
    productTitle: "Industrial PET Plastic Bottles (Clean Sorted)",
    category: "plastic",
    quantityKg: 2500,
    totalPrice: 95000,
    buyerId: "buyer-1",
    buyerName: "Anand Polymers India",
    buyerPhone: "+91 97909 11223",
    buyerAddress: "Plot 42, Ambattur Industrial Estate, Chennai, Tamil Nadu",
    sellerId: "seller-1",
    sellerName: "Green Earth Recyclers Pvt Ltd",
    sellerAddress: "Main Industrial Zone, Chennai, Tamil Nadu",
    status: "In Transit",
    transportRequestStatus: "DRIVER_ASSIGNED",
    transportCompanyId: "comp-greenroute",
    transportCompanyName: "GreenRoute Logistics Pvt Ltd",
    driverId: "DRV001",
    driverName: "Ramesh Kumar",
    vehicleNumber: "TN 01 AB 1234 (Demo)",
    pickupDate: new Date().toISOString().split('T')[0],
    deliveryEstimate: "Today Evening",
    paymentMethod: "UPI / Net Banking Secured",
    co2SavedKg: 3750,
    createdAt: new Date().toLocaleString()
  },
  {
    id: "ORD-8422",
    productId: "PROD-102",
    productTitle: "Heavy Corrugated Cardboard Bales",
    category: "paper",
    quantityKg: 5000,
    totalPrice: 70000,
    buyerId: "buyer-1",
    buyerName: "Anand Polymers India",
    buyerPhone: "+91 97909 11223",
    buyerAddress: "Plot 42, Ambattur Industrial Estate, Chennai, Tamil Nadu",
    sellerId: "seller-1",
    sellerName: "Green Earth Recyclers Pvt Ltd",
    sellerAddress: "Main Industrial Zone, Chennai, Tamil Nadu",
    status: "Assigned",
    transportRequestStatus: "PARTNER_ACCEPTED",
    transportCompanyId: "comp-greenroute",
    transportCompanyName: "GreenRoute Logistics Pvt Ltd",
    driverId: null,
    driverName: null,
    vehicleNumber: null,
    pickupDate: new Date().toISOString().split('T')[0],
    deliveryEstimate: "Tomorrow Morning",
    paymentMethod: "UPI / Net Banking Secured",
    co2SavedKg: 7500,
    createdAt: new Date().toLocaleString()
  }
];

    if (process.env.SEED_DEMO !== 'false') {
      if ((await stores.product.countDocuments()) === 0) await stores.product.insertMany(demoProducts);
      if ((await stores.partner.countDocuments()) === 0) await stores.partner.insertMany(demoPartners);
      if ((await stores.fleet.countDocuments()) === 0) await stores.fleet.insertMany(demoFleet);
      if ((await stores.driver.countDocuments()) === 0) await stores.driver.insertMany(demoDrivers);
      if ((await stores.order.countDocuments()) === 0) await stores.order.insertMany(demoOrders);
    }
    db = 'mongo';
    console.log('🍃 Successfully connected & seeded MongoDB Atlas Database: ecomart.k6qvvps.mongodb.net');
  } catch (err) {
    console.error('MongoDB Connection Failed, using in-memory store:', err.message);
    seedMemory();
  }
}

const collectionName = type => ({ user: 'users', product: 'products', partner: 'partners', fleet: 'fleet', driver: 'drivers', order: 'orders', notification: 'notifications', fleetlog: 'fleet_logs' })[type];
const all = async (type, filter = {}) => db ? (await stores[type].find(filter).lean()).map(({ _id, __v, ...item }) => item) : memory[collectionName(type)];
const one = async (type, filter) => db ? await stores[type].findOne(filter).lean() : memory[collectionName(type)].find(item => Object.entries(filter).every(([k, v]) => item[k] === v));
const insert = async (type, val) => {
  if (db) {
    const saved = await stores[type].create(val);
    const { _id, __v, ...item } = saved.toObject();
    return item;
  }
  memory[collectionName(type)].unshift(val);
  return val;
};
const update = async (type, filter, changes) => {
  if (db) {
    return await stores[type].findOneAndUpdate(filter, changes, { new: true }).lean();
  }
  const item = memory[collectionName(type)].find(v => Object.entries(filter).every(([k, val]) => v[k] === val));
  if (item) Object.assign(item, changes);
  return item;
};
const remove = async (type, filter) => {
  if (db) return stores[type].findOneAndDelete(filter);
  const collection = memory[collectionName(type)];
  const index = collection.findIndex(v => Object.entries(filter).every(([k, val]) => v[k] === val));
  if (index >= 0) collection.splice(index, 1);
};

const issueToken = user => jwt.sign({ id: user.id, role: user.role, transportCompanyId: user.transportCompanyId || null }, jwtSecret, { expiresIn: '7d' });
const roleMatches = (user, identifier) => [user.email, user.id, user.transportId, user.driverId, user.phone?.replace(/\D/g, '')].filter(Boolean).some(val => val.toLowerCase?.() === identifier.toLowerCase() || val === identifier.replace(/\D/g, ''));

/* Create API Router supporting both /api/* and /* aliases */
const apiRouter = express.Router();

/* API Root Route */
apiRouter.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'ECO MART REST API',
    version: '2.5.0',
    status: 'OPERATIONAL',
    database: db ? 'MongoDB Atlas (Connected)' : 'In-Memory DB',
    timestamp: new Date().toISOString()
  });
});

/* API Health Check */
apiRouter.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'ECO MART REST API',
    version: '2.5.0',
    database: db ? 'MongoDB Atlas (ecomart.k6qvvps.mongodb.net)' : 'In-Memory Store',
    swaggerDocs: 'http://localhost:5000/api-docs',
    timestamp: new Date().toISOString()
  });
});

/* Notifications & Live Driver Messages Endpoints */
apiRouter.get('/notifications', async (req, res, next) => {
  try {
    const list = await all('notification');
    res.json({ success: true, notifications: list });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/notifications', async (req, res, next) => {
  try {
    const item = await insert('notification', {
      id: id('NOTIF'),
      timestamp: new Date().toLocaleString(),
      ...req.body
    });
    res.status(201).json({ success: true, notification: item });
  } catch (err) {
    next(err);
  }
});

/* Fleet Trip Lifecycle & Status Analytics Endpoints */
apiRouter.get('/fleet/analytics', async (req, res, next) => {
  try {
    const logs = await all('fleetlog');
    res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/fleet/logs', async (req, res, next) => {
  try {
    const item = await insert('fleetlog', {
      id: id('FLEETLOG'),
      timestamp: new Date().toLocaleString(),
      ...req.body
    });
    res.status(201).json({ success: true, log: item });
  } catch (err) {
    next(err);
  }
});

/* ==================================================
   DYNAMIC DRIVER & FLEET MODULE API ENDPOINTS
   Supports ANY driver authenticated in the system dynamically.
   ================================================== */

// Helper to resolve currently authenticated driver context securely from token / headers
const getAuthenticatedDriver = async (req) => {
  const driverIdHeader = req.headers['x-driver-id'] || req.headers['x-user-id'] || req.query.driverId;
  const authUser = req.user;

  // Search User and Driver collections in MongoDB Atlas
  const users = await all('user');
  const drivers = await all('driver');

  let foundUser = null;

  if (authUser && authUser.id && (authUser.role === 'TRANSPORT_DRIVER' || authUser.role === 'DRIVER')) {
    foundUser = users.find(u => u.id === authUser.id || u.driverId === authUser.driverId || u.email === authUser.email);
  }

  if (!foundUser && driverIdHeader) {
    foundUser = users.find(u => 
      u.driverId === driverIdHeader || 
      u.id === driverIdHeader || 
      u.email?.toLowerCase() === driverIdHeader.toLowerCase()
    );
  }

  if (!foundUser && authUser) {
    foundUser = users.find(u => 
      u.id === authUser.id || 
      u.email === authUser.email || 
      (u.driverId && authUser.id && authUser.id.includes(u.driverId))
    );
  }

  // Fallback to first driver if guest/testing
  if (!foundUser) {
    foundUser = users.find(u => u.role === 'TRANSPORT_DRIVER' || u.driverId) || drivers[0] || {
      id: 'driver-drv001',
      driverId: 'DRV001',
      name: 'Ramesh Kumar',
      phone: '+91 98401 99887',
      licenseNumber: 'TN-01-2022-8765432',
      assignedVehicleNumber: 'TN 01 AB 1234 (Demo)',
      companyName: 'GreenRoute Logistics Pvt Ltd',
      rating: 4.9,
      tripsCompleted: 142
    };
  }

  // Look up assigned truck from fleet collection if available
  const fleet = await all('fleet');
  const assignedTruck = fleet.find(v => 
    v.driverId === foundUser.driverId || 
    v.driverName === foundUser.name || 
    (foundUser.assignedVehicleNumber && v.vehicleNumber === foundUser.assignedVehicleNumber)
  );

  return {
    ...foundUser,
    driverId: foundUser.driverId || foundUser.id || 'DRV001',
    assignedVehicleNumber: assignedTruck ? assignedTruck.vehicleNumber : (foundUser.assignedVehicleNumber || null),
    vehicleType: assignedTruck ? assignedTruck.vehicleType : (foundUser.assignedVehicleNumber ? 'Commercial Truck' : null)
  };
};

// 1. GET Current Logged-in Driver Profile
apiRouter.get('/driver/profile', async (req, res, next) => {
  try {
    const driver = await getAuthenticatedDriver(req);
    res.json({ success: true, driver });
  } catch (err) {
    next(err);
  }
});

// 2. GET Current Active Trip for Logged-in Driver
apiRouter.get('/driver/current-trip', async (req, res, next) => {
  try {
    const driver = await getAuthenticatedDriver(req);
    const orders = await all('order');

    const matchingActiveOrders = orders.filter(o => {
      const isMatch = (o.driverId && (o.driverId === driver.driverId || o.driverId === driver.id)) ||
        (o.vehicleNumber && driver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === driver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
      const isNotCompleted = !['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
      return isMatch && isNotCompleted;
    });

    // Pick the NEWEST non-completed active assignment
    const activeTrip = matchingActiveOrders.length > 0 ? matchingActiveOrders[matchingActiveOrders.length - 1] : null;

    res.json({ success: true, activeTrip: activeTrip || null });
  } catch (err) {
    next(err);
  }
});

// 3. GET Trip History for Logged-in Driver
apiRouter.get('/driver/trip-history', async (req, res, next) => {
  try {
    const driver = await getAuthenticatedDriver(req);
    const orders = await all('order');
    const { search = '', status = '' } = req.query;

    let trips = orders.filter(o => {
      const isMatch = (o.driverId && (o.driverId === driver.driverId || o.driverId === driver.id)) ||
        (o.vehicleNumber && driver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === driver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
      const isCompletedOrPast = ['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status);
      return isMatch && isCompletedOrPast;
    });

    if (search) {
      const q = search.toLowerCase();
      trips = trips.filter(t => 
        (t.id || '').toLowerCase().includes(q) ||
        (t.sellerName || '').toLowerCase().includes(q) ||
        (t.buyerName || '').toLowerCase().includes(q) ||
        (t.productTitle || '').toLowerCase().includes(q)
      );
    }

    if (status) {
      trips = trips.filter(t => (t.transportRequestStatus || t.status) === status);
    }

    res.json({ success: true, trips, totalCount: trips.length });
  } catch (err) {
    next(err);
  }
});

// 4. GET Dashboard Metrics for Logged-in Driver
apiRouter.get('/driver/metrics', async (req, res, next) => {
  try {
    const driver = await getAuthenticatedDriver(req);
    const orders = await all('order');

    const driverOrders = orders.filter(o => {
      return (o.driverId && (o.driverId === driver.driverId || o.driverId === driver.id)) ||
        (o.vehicleNumber && driver.assignedVehicleNumber && o.vehicleNumber.replace(/\s+/g, '').toLowerCase() === driver.assignedVehicleNumber.replace(/\s+/g, '').toLowerCase());
    });

    const activeTrips = driverOrders.filter(o => !['COMPLETED', 'DELIVERED', 'Completed', 'CANCELLED', 'REJECTED'].includes(o.transportRequestStatus || o.status));
    const completedTrips = driverOrders.filter(o => ['COMPLETED', 'DELIVERED', 'Completed'].includes(o.transportRequestStatus || o.status));
    const cancelledTrips = driverOrders.filter(o => ['CANCELLED', 'REJECTED', 'PARTNER_REJECTED'].includes(o.transportRequestStatus || o.status));

    const totalPayloadKg = completedTrips.reduce((acc, curr) => acc + Number(curr.quantityKg || 0), 0);
    const co2SavedKg = completedTrips.reduce((acc, curr) => acc + Number(curr.co2SavedKg || Math.round(Number(curr.quantityKg || 0) * 1.5)), 0);

    res.json({
      success: true,
      metrics: {
        totalTrips: driverOrders.length,
        activeTrips: activeTrips.length,
        completedTrips: completedTrips.length,
        cancelledTrips: cancelledTrips.length,
        totalPayloadKg,
        co2SavedKg
      }
    });
  } catch (err) {
    next(err);
  }
});

// 5. PUT Driver Trip Status Update
apiRouter.put('/driver/trip-status', async (req, res, next) => {
  try {
    const driver = await getAuthenticatedDriver(req);
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, error: 'orderId and status are required' });
    }

    const existingOrder = await one('order', { id: orderId });
    if (!existingOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Update order status in MongoDB Atlas
    const updatedOrder = await update('order', { id: orderId }, {
      status,
      transportRequestStatus: status,
      driverId: driver.driverId,
      driverName: driver.name
    });

    // If completed, free up lorry & driver in DB
    if (['COMPLETED', 'DELIVERED', 'Completed'].includes(status)) {
      if (driver.assignedVehicleNumber) {
        await update('fleet', { vehicleNumber: driver.assignedVehicleNumber }, { currentStatus: 'Available', assignedOrderId: null });
      }
    }

    // Post live notification to MongoDB Atlas
    await insert('notification', {
      id: id('NOTIF'),
      title: `Driver Status Alert: ${status}`,
      message: `Driver ${driver.name} updated Order ${orderId} status to '${status}'.`,
      recipientRole: 'TRANSPORT_MANAGER',
      transportCompanyId: existingOrder.transportCompanyId || driver.transportCompanyId || 'comp-greenroute',
      orderId: orderId,
      status: status,
      driverName: driver.name,
      timestamp: new Date().toLocaleString()
    });

    // Post fleet log to MongoDB Atlas
    await insert('fleetlog', {
      id: id('FLEETLOG'),
      orderId: orderId,
      vehicleNumber: existingOrder.vehicleNumber || driver.assignedVehicleNumber || '',
      driverId: driver.driverId,
      driverName: driver.name,
      transportCompanyId: existingOrder.transportCompanyId || driver.transportCompanyId || '',
      category: ['COMPLETED', 'DELIVERED'].includes(status) ? 'COMPLETED' :
                ['EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'PICKUP_COMPLETED'].includes(status) ? 'PICKUP' :
                ['IN_TRANSIT', 'ARRIVED_AT_DESTINATION'].includes(status) ? 'IN_TRANSIT' : 'ACCEPTED',
      statusLabel: status,
      productTitle: existingOrder.productTitle || '',
      quantityKg: existingOrder.quantityKg || 0,
      sellerAddress: existingOrder.sellerAddress || '',
      buyerAddress: existingOrder.buyerAddress || '',
      timestamp: new Date().toLocaleString()
    });

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    next(err);
  }
});

/* ECO AI Chat Endpoint (Google Gemini Multimodal + Database Integration) */
apiRouter.post('/ai/chat', async (req, res, next) => {
  try {
    const { message = '', history = [], image = null, imageMime = 'image/jpeg', productContext = null } = req.body;

    if (!message && !image) {
      return res.status(400).json({ success: false, error: 'Message or image required' });
    }

    // Retrieve real matching products from MongoDB Atlas database if message asks about products/pricing/scrap
    let dbProducts = [];
    try {
      const allProducts = await all('product');
      const textLower = (message || '').toLowerCase();
      
      const numbers = textLower.match(/\d+/g);
      const priceLimit = numbers ? Math.max(...numbers.map(Number)) : null;

      dbProducts = (allProducts || []).filter(p => {
        const titleMatch = p.title?.toLowerCase().includes(textLower) || textLower.includes(p.category?.toLowerCase() || '');
        const descMatch = p.description?.toLowerCase().includes(textLower);
        const priceMatch = priceLimit && priceLimit > 50 ? Number(p.price || 0) <= priceLimit : true;
        return (titleMatch || descMatch) && priceMatch;
      });

      // If specific search returns empty, provide top 5 featured real products as database context
      if (dbProducts.length === 0) {
        dbProducts = (allProducts || []).slice(0, 5);
      } else {
        dbProducts = dbProducts.slice(0, 5);
      }
    } catch (err) {
      console.warn("Database lookup for AI context warning:", err.message);
    }

    // Call Google Gemini Multimodal AI Service
    const aiResult = await generateEcoAiResponse({
      message,
      history,
      image,
      imageMime,
      productContext,
      dbProducts
    });

    res.json({
      success: true,
      answer: aiResult.answer,
      modelUsed: aiResult.modelUsed || 'Google Gemini AI'
    });
  } catch (err) {
    console.error("ECO AI Router Error:", err.message);
    res.json({
      success: false,
      answer: "Sorry, ECO AI is temporarily unavailable. Please try again."
    });
  }
});

/* Auth Endpoints */
apiRouter.post('/auth/register', validateRegistration, async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'BUYER', ...profile } = req.body;
    const normalized = role.toUpperCase();
    if (!['SELLER', 'BUYER'].includes(normalized)) {
      return res.status(400).json({ success: false, error: 'Public registration is restricted to SELLER and BUYER roles' });
    }
    const existing = await one('user', { email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, error: 'User account with this email already exists' });
    }
    const user = await insert('user', {
      id: id('user'),
      name,
      email: email.toLowerCase(),
      phone,
      password: await bcrypt.hash(password, 10),
      role: normalized,
      ...profile
    });
    res.status(201).json({ success: true, user: cleanUser(user), token: issueToken(user) });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/auth/admin/register', async (req, res) => {
  return res.status(403).json({
    success: false,
    error: 'Public admin registration is strictly disabled. Only Super Admin AYISHA PARVEEN A can access the admin portal.'
  });
});

apiRouter.post('/auth/login', validateLogin, async (req, res, next) => {
  try {
    const identifier = String(req.body.identifier || req.body.email || '').trim();
    const lowerIdentifier = identifier.toLowerCase();
    const phoneClean = identifier.replace(/\D/g, '');

    // Guaranteed Super Admin Instant Authenticator for ayisha@gmail.com
    if (lowerIdentifier === 'ayisha@gmail.com' && String(req.body.password || '').trim() === 'ayisha123') {
      const adminUser = {
        id: 'user-admin-ayisha',
        name: 'AYISHA PARVEEN A',
        email: 'ayisha@gmail.com',
        phone: '+91 98765 36200',
        role: 'ADMIN',
        securityKey: 'AYISHA'
      };
      return res.json({ success: true, user: adminUser, token: issueToken(adminUser) });
    }

    // Fast Direct Indexed MongoDB Lookup (10ms)
    let user = await one('user', { email: lowerIdentifier });
    if (!user) user = await one('user', { id: identifier });
    if (!user && phoneClean.length >= 10) user = await one('user', { phone: identifier });
    if (!user) {
      const candidates = await all('user');
      user = candidates.find(v => roleMatches(v, identifier));
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid user credentials or account not found.' });
    }

    // Password Verification: bcrypt or plain-text fallback
    const inputPassword = String(req.body.password || '').trim();
    let pwdValid = false;

    if (user.password) {
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        pwdValid = await bcrypt.compare(inputPassword, user.password);
      } else {
        pwdValid = (user.password === inputPassword);
      }
    }

    if (!pwdValid) {
      return res.status(401).json({ success: false, error: 'Invalid password. Please check your login credentials.' });
    }

    const expected = req.body.expectedRole?.toUpperCase();
    if (expected && user.role !== expected) {
      return res.status(403).json({
        success: false,
        error: `Role mismatch: This account is registered as ${user.role}. Please login via the correct portal.`
      });
    }

    // Strict Admin Access Control: Only Super Admin AYISHA PARVEEN A can log in to Admin Portal
    if ((user.role === 'ADMIN' || expected === 'ADMIN') && user.email.toLowerCase() !== 'ayishaparveena36@gmail.com') {
      return res.status(403).json({
        success: false,
        error: 'Admin Portal access is strictly restricted to Super Admin AYISHA PARVEEN A.'
      });
    }

    res.json({ success: true, user: cleanUser(user), token: issueToken(user) });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/auth/me', verifyToken, async (req, res, next) => {
  try {
    const user = await one('user', { id: req.user.id });
    res.json({ success: true, user: cleanUser(user) });
  } catch (err) {
    next(err);
  }
});

apiRouter.patch('/auth/profile', verifyToken, async (req, res, next) => {
  try {
    const user = await update('user', { id: req.user.id }, req.body);
    res.json({ success: true, user: cleanUser(user) });
  } catch (err) {
    next(err);
  }
});

/* User Management */
apiRouter.get('/users', async (req, res, next) => {
  try {
    const users = await all('user');
    res.json({ success: true, users: users.map(cleanUser) });
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/users/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const existing = await one('user', { id: userId }) || (await all('user')).find(u => u.id === userId || u.email?.toLowerCase() === userId.toLowerCase());
    if (!existing) {
      return res.status(404).json({ success: false, error: 'User account not found' });
    }
    
    if ((existing.email?.toLowerCase() === 'ayisha@gmail.com' || existing.email?.toLowerCase() === 'ayishaparveena36@gmail.com') && req.body.role && req.body.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Super Admin AYISHA PARVEEN A role cannot be modified.' });
    }

    const updated = await update('user', { id: existing.id }, req.body);
    res.json({ success: true, user: cleanUser(updated) });
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/users/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const existing = await one('user', { id: userId }) || (await all('user')).find(u => u.id === userId || u.email?.toLowerCase() === userId.toLowerCase());
    if (!existing) {
      // Delete directly by email or id if not matched by one()
      await remove('user', { email: userId.toLowerCase() });
      await remove('user', { id: userId });
      return res.json({ success: true, message: 'User account deleted successfully' });
    }

    if (existing.email?.toLowerCase() === 'ayisha@gmail.com' || existing.email?.toLowerCase() === 'ayishaparveena36@gmail.com') {
      return res.status(403).json({ success: false, error: 'Super Admin account cannot be deleted.' });
    }

    await remove('user', { id: existing.id });
    await remove('user', { email: existing.email });
    res.json({ success: true, message: 'User account deleted successfully from MongoDB Atlas' });
  } catch (err) {
    next(err);
  }
});

/* Product Marketplace Endpoints */
apiRouter.get('/products', async (req, res, next) => {
  try {
    let products = await all('product');
    if (req.query.category) products = products.filter(p => p.category === req.query.category);
    if (req.query.sellerId) products = products.filter(p => p.sellerId === req.query.sellerId);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/products', verifyToken, authorizeRoles('SELLER', 'ADMIN'), validateProduct, async (req, res, next) => {
  try {
    const product = await insert('product', {
      id: id('PROD'),
      status: 'PENDING_APPROVAL',
      approvalStatus: 'PENDING_APPROVAL',
      ...req.body,
      sellerId: req.body.sellerId || req.user.id,
      createdAt: new Date().toISOString().slice(0, 10)
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/products/:id', verifyToken, authorizeRoles('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const updated = await update('product', { id: req.params.id }, req.body);
    res.json({ success: true, product: updated });
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/products/:id', verifyToken, authorizeRoles('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    await remove('product', { id: req.params.id });
    res.status(200).json({ success: true, message: 'Product listing deleted' });
  } catch (err) {
    next(err);
  }
});

/* Transport Partner Directory & Logistics */
apiRouter.get('/partners', verifyToken, async (req, res, next) => {
  try {
    res.json({ success: true, partners: await all('partner') });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/partners', verifyToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const partner = await insert('partner', {
      id: id('comp'),
      invitationCode: `INV-${Date.now().toString().slice(-6)}`,
      agreementStatus: 'Verified Partnership',
      partnerStatus: 'PENDING_ACCEPTANCE',
      ...req.body
    });
    res.status(201).json({ success: true, partner });
  } catch (err) {
    next(err);
  }
});

apiRouter.patch('/partners/:id/status', verifyToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const partner = await update('partner', { id: req.params.id }, { partnerStatus: req.body.status });
    res.json({ success: true, partner });
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/partners/:id', verifyToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    await remove('partner', { id: req.params.id });
    res.json({ success: true, message: 'Transport partner deleted successfully' });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/fleet', verifyToken, async (req, res, next) => {
  try {
    const fleet = await all('fleet');
    const filtered = req.user.role === 'TRANSPORT_MANAGER' ? fleet.filter(f => f.transportCompanyId === req.user.transportCompanyId) : fleet;
    res.json({ success: true, fleet: filtered });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/fleet', verifyToken, authorizeRoles('TRANSPORT_MANAGER', 'ADMIN'), async (req, res, next) => {
  try {
    const fleetItem = await insert('fleet', {
      id: id('veh'),
      transportCompanyId: req.body.transportCompanyId || req.user.transportCompanyId,
      companyName: req.body.companyName,
      currentStatus: 'Available',
      lat: 13.0827,
      lng: 80.2707,
      ...req.body
    });
    res.status(201).json({ success: true, fleetItem });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/drivers', verifyToken, async (req, res, next) => {
  try {
    const drivers = await all('driver');
    const filtered = req.user.role === 'TRANSPORT_MANAGER' ? drivers.filter(d => d.transportCompanyId === req.user.transportCompanyId) : drivers;
    res.json({ success: true, drivers: filtered });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/drivers', verifyToken, authorizeRoles('TRANSPORT_MANAGER', 'ADMIN'), async (req, res, next) => {
  try {
    const driverId = req.body.driverId || id('DRV');
    const driver = await insert('driver', {
      id: driverId,
      driverId,
      transportCompanyId: req.body.transportCompanyId || req.user.transportCompanyId,
      companyName: req.body.companyName || req.user.companyName,
      status: 'Available',
      completedTripsCount: 0,
      ...req.body
    });
    await insert('user', {
      ...driver,
      email: req.body.email || `${driverId.toLowerCase()}@driver.waste2worth.in`,
      password: await bcrypt.hash(req.body.password || 'Driver@123', 10),
      role: 'TRANSPORT_DRIVER'
    });
    res.status(201).json({ success: true, driver });
  } catch (err) {
    next(err);
  }
});

/* Order Management Endpoints */
apiRouter.get('/orders', async (req, res, next) => {
  try {
    const orders = await all('order');
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/orders', verifyToken, async (req, res, next) => {
  try {
    const orderData = req.body;
    const orderId = orderData.id || id('ORD');
    const newOrder = {
      id: orderId,
      productId: orderData.productId || 'PROD-101',
      productTitle: orderData.productTitle || 'Recyclable Scrap Material',
      category: orderData.category || 'plastic',
      quantityKg: Number(orderData.quantityKg || 1000),
      totalPrice: Number(orderData.totalPrice || 50000),
      buyerId: orderData.buyerId || req.user.id || 'buyer-1',
      buyerName: orderData.buyerName || 'Eco Buyer',
      buyerPhone: orderData.buyerPhone || '+91 97909 11223',
      buyerAddress: orderData.buyerAddress || 'Chennai, Tamil Nadu',
      sellerId: orderData.sellerId || 'seller-1',
      sellerName: orderData.sellerName || 'Green Earth Recyclers',
      sellerAddress: orderData.sellerAddress || 'Chennai, Tamil Nadu',
      status: orderData.status || 'Pending',
      transportRequestStatus: orderData.transportRequestStatus || 'ORDER_CONFIRMED',
      transportCompanyId: orderData.transportCompanyId || null,
      transportCompanyName: orderData.transportCompanyName || null,
      driverId: orderData.driverId || null,
      driverName: orderData.driverName || null,
      vehicleNumber: orderData.vehicleNumber || null,
      pickupDate: orderData.pickupDate || new Date().toISOString().split('T')[0],
      deliveryEstimate: orderData.deliveryEstimate || '2 Days',
      pickupCoordinates: orderData.pickupCoordinates || [13.0827, 80.2707],
      deliveryCoordinates: orderData.deliveryCoordinates || [13.1327, 80.3207],
      currentTransportCoordinates: orderData.currentTransportCoordinates || [13.0827, 80.2707],
      paymentMethod: orderData.paymentMethod || 'UPI / Net Banking Secured',
      co2SavedKg: Number(orderData.co2SavedKg || 1500),
      createdAt: orderData.createdAt || new Date().toLocaleString()
    };

    const saved = await insert('order', newOrder);
    res.status(201).json({ success: true, order: saved });
  } catch (err) {
    next(err);
  }
});

apiRouter.patch('/orders/:id/status', verifyToken, async (req, res, next) => {
  try {
    const changes = { status: req.body.status, transportRequestStatus: req.body.transportRequestStatus || req.body.status, ...req.body };
    const order = await update('order', { id: req.params.id }, changes);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    if (['COMPLETED', 'Completed', 'DELIVERED'].includes(changes.status)) {
      memory.impact.totalWasteRecycledKg += Number(order.quantityKg || 0);
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

apiRouter.patch('/orders/:id/assign-partner', verifyToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const partner = await one('partner', { id: req.body.transportCompanyId });
    if (!partner) return res.status(404).json({ success: false, error: 'Transportation Partner not found' });

    const order = await update('order', { id: req.params.id }, {
      status: 'TRANSPORT_REQUEST_SENT',
      transportRequestStatus: 'TRANSPORT_REQUEST_SENT',
      transportCompanyId: partner.id,
      transportCompanyName: partner.companyName
    });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

/* Dashboard & Analytics */
apiRouter.get('/impact', verifyToken, async (req, res, next) => {
  try {
    res.json({ success: true, impact: memory.impact });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/dashboard', verifyToken, async (req, res, next) => {
  try {
    const [users, products, orders, partners, fleet] = await Promise.all([
      all('user'),
      all('product'),
      all('order'),
      all('partner'),
      all('fleet')
    ]);
    res.json({
      success: true,
      metrics: {
        users: users.length,
        products: products.length,
        orders: orders.length,
        partners: partners.length,
        fleetVehicles: fleet.length,
        environmentalImpact: memory.impact
      }
    });
  } catch (err) {
    next(err);
  }
});

/* Mount API Router under both /api and / prefixes */
app.use('/api', apiRouter);
app.use('/', apiRouter);

/* Serve Static Frontend App for Single-Server Fullstack Deployment */
app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/api-docs')) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

/* 404 & Centralized Error Middleware */
app.use(notFoundHandler);
app.use(errorHandler);

/* Start Server with Live MongoDB Atlas Connection */
connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 ECO MART REST API running on http://localhost:${port}/api`);
    console.log(`📚 Swagger OpenAPI Documentation available at http://localhost:${port}/api-docs`);
  });
}).catch(err => {
  console.error('Database connection failed:', err.message);
  process.exit(1);
});
