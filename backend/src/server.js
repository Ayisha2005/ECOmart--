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
  { id: 'user-admin-1', name: 'Platform Administrator', email: 'admin@ecomart.in', phone: '+91 98765 00000', password: 'Admin@123', role: 'ADMIN' },
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
  Order: new mongoose.Schema({ id: { type: String, unique: true }, productId: String, buyerId: String, sellerId: String, status: String, transportRequestStatus: String, transportCompanyId: String, driverId: String, vehicleNumber: String }, { strict: false, timestamps: true })
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
    await mongoose.connect(MONGODB_URI);
    for (const [name, schema] of Object.entries(schemas)) {
      stores[name.toLowerCase()] = mongoose.models[name] || mongoose.model(name, schema);
    }

    // Ensure preseeded demo accounts (Admin, Seller, Buyer, Managers, Drivers) exist in MongoDB Atlas
    for (const demoUser of demoUsers) {
      const existing = await stores.user.findOne({ email: demoUser.email.toLowerCase() });
      if (!existing) {
        const hashedPassword = bcrypt.hashSync(demoUser.password, 10);
        await stores.user.create({ ...demoUser, password: hashedPassword });
      }
    }

    if (process.env.SEED_DEMO !== 'false' && (await stores.product.countDocuments()) === 0) {
      await stores.product.insertMany(demoProducts);
      await stores.partner.insertMany(demoPartners);
      await stores.fleet.insertMany(demoFleet);
      await stores.driver.insertMany(demoDrivers);
    }
    db = 'mongo';
    console.log('🍃 Successfully connected & seeded MongoDB Atlas Database: ecomart.k6qvvps.mongodb.net');
  } catch (err) {
    console.error('MongoDB Connection Failed, using in-memory store:', err.message);
    seedMemory();
  }
}

const collectionName = type => ({ user: 'users', product: 'products', partner: 'partners', fleet: 'fleet', driver: 'drivers', order: 'orders' })[type];
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

/* API Health Check */
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'ECO MART REST API',
    version: '2.5.0',
    database: db ? 'MongoDB Atlas (ecomart.k6qvvps.mongodb.net)' : 'In-Memory Store',
    swaggerDocs: 'http://localhost:5000/api-docs',
    timestamp: new Date().toISOString()
  });
});

/* Auth Endpoints */
app.post('/api/auth/register', validateRegistration, async (req, res, next) => {
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

app.post('/api/auth/admin/register', requireAdminSecurityKey, validateRegistration, async (req, res, next) => {
  try {
    const { name, email, phone, password, ...profile } = req.body;
    const existing = await one('user', { email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Admin account with this email already exists' });
    }
    const user = await insert('user', {
      id: id('user-admin'),
      name,
      email: email.toLowerCase(),
      phone,
      password: await bcrypt.hash(password, 10),
      role: 'ADMIN',
      ...profile
    });
    res.status(201).json({ success: true, user: cleanUser(user), token: issueToken(user) });
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/login', validateLogin, async (req, res, next) => {
  try {
    const identifier = String(req.body.identifier || req.body.email || '').trim();
    const candidates = await all('user');
    const user = candidates.find(v => roleMatches(v, identifier));

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

    res.json({ success: true, user: cleanUser(user), token: issueToken(user) });
  } catch (err) {
    next(err);
  }
});

app.get('/api/auth/me', verifyToken, async (req, res, next) => {
  try {
    const user = await one('user', { id: req.user.id });
    res.json({ success: true, user: cleanUser(user) });
  } catch (err) {
    next(err);
  }
});

app.patch('/api/auth/profile', verifyToken, async (req, res, next) => {
  try {
    const user = await update('user', { id: req.user.id }, req.body);
    res.json({ success: true, user: cleanUser(user) });
  } catch (err) {
    next(err);
  }
});

/* User Management */
app.get('/api/users', verifyToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const users = await all('user');
    res.json({ success: true, users: users.map(cleanUser) });
  } catch (err) {
    next(err);
  }
});

/* Product Marketplace Endpoints */
app.get('/api/products', async (req, res, next) => {
  try {
    let products = await all('product');
    if (req.query.category) products = products.filter(p => p.category === req.query.category);
    if (req.query.sellerId) products = products.filter(p => p.sellerId === req.query.sellerId);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
});

app.post('/api/products', verifyToken, authorizeRoles('SELLER', 'ADMIN'), validateProduct, async (req, res, next) => {
  try {
    const product = await insert('product', {
      id: id('PROD'),
      ...req.body,
      sellerId: req.body.sellerId || req.user.id,
      createdAt: new Date().toISOString().slice(0, 10)
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/products/:id', verifyToken, authorizeRoles('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    await remove('product', { id: req.params.id });
    res.status(200).json({ success: true, message: 'Product listing deleted' });
  } catch (err) {
    next(err);
  }
});

/* Transport Partner Directory & Logistics */
app.get('/api/partners', verifyToken, async (req, res, next) => {
  try {
    res.json({ success: true, partners: await all('partner') });
  } catch (err) {
    next(err);
  }
});

app.post('/api/partners', verifyToken, authorizeRoles('ADMIN'), async (req, res, next) => {
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

app.patch('/api/partners/:id/status', verifyToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const partner = await update('partner', { id: req.params.id }, { partnerStatus: req.body.status });
    res.json({ success: true, partner });
  } catch (err) {
    next(err);
  }
});

app.get('/api/fleet', verifyToken, async (req, res, next) => {
  try {
    const fleet = await all('fleet');
    const filtered = req.user.role === 'TRANSPORT_MANAGER' ? fleet.filter(f => f.transportCompanyId === req.user.transportCompanyId) : fleet;
    res.json({ success: true, fleet: filtered });
  } catch (err) {
    next(err);
  }
});

app.post('/api/fleet', verifyToken, authorizeRoles('TRANSPORT_MANAGER', 'ADMIN'), async (req, res, next) => {
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

app.get('/api/drivers', verifyToken, async (req, res, next) => {
  try {
    const drivers = await all('driver');
    const filtered = req.user.role === 'TRANSPORT_MANAGER' ? drivers.filter(d => d.transportCompanyId === req.user.transportCompanyId) : drivers;
    res.json({ success: true, drivers: filtered });
  } catch (err) {
    next(err);
  }
});

app.post('/api/drivers', verifyToken, authorizeRoles('TRANSPORT_MANAGER', 'ADMIN'), async (req, res, next) => {
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
app.get('/api/orders', verifyToken, async (req, res, next) => {
  try {
    let orders = await all('order');
    if (req.user.role === 'BUYER') orders = orders.filter(o => o.buyerId === req.user.id);
    if (req.user.role === 'SELLER') orders = orders.filter(o => o.sellerId === req.user.id);
    if (req.user.role === 'TRANSPORT_MANAGER') orders = orders.filter(o => o.transportCompanyId === req.user.transportCompanyId);
    if (req.user.role === 'TRANSPORT_DRIVER') orders = orders.filter(o => o.driverId === req.user.driverId);
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

app.post('/api/orders', verifyToken, authorizeRoles('BUYER'), async (req, res, next) => {
  try {
    const product = await one('product', { id: req.body.productId });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    const quantityKg = Number(req.body.quantityKg || product.weightKg);
    const order = await insert('order', {
      id: id('ORD'),
      productId: product.id,
      productTitle: product.title,
      category: product.category,
      quantityKg,
      totalPrice: Math.round((product.price / product.weightKg) * quantityKg),
      buyerId: req.user.id,
      buyerName: req.body.buyerName,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      sellerAddress: `${product.address || ''}, ${product.city || ''}, ${product.state || ''}`,
      buyerAddress: req.body.buyerAddress,
      status: 'Pending',
      transportRequestStatus: 'ORDER_CONFIRMED',
      transportCompanyId: null,
      driverId: null,
      vehicleNumber: null,
      pickupCoordinates: [product.lat || 13.0827, product.lng || 80.2707],
      deliveryCoordinates: req.body.deliveryCoordinates || [13.1327, 80.3207],
      currentTransportCoordinates: [product.lat || 13.0827, product.lng || 80.2707],
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

app.patch('/api/orders/:id/status', verifyToken, async (req, res, next) => {
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

app.patch('/api/orders/:id/assign-partner', verifyToken, authorizeRoles('ADMIN'), async (req, res, next) => {
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
app.get('/api/impact', verifyToken, async (req, res, next) => {
  try {
    res.json({ success: true, impact: memory.impact });
  } catch (err) {
    next(err);
  }
});

app.get('/api/dashboard', verifyToken, async (req, res, next) => {
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
