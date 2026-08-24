import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET || 'waste2worth-development-secret';
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(helmet());
app.use(cors({ origin: allowedOrigin.split(',').map(value => value.trim()), credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

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

const memory = { users: [], products: [], partners: [], fleet: [], drivers: [], orders: [], notifications: [], impact: { totalWasteRecycledKg: 48520, co2SavedKg: 72780, treesPreserved: 2426, plasticDivertedKg: 18400, paperRecoveredKg: 14200, eWasteRecycledKg: 8900 } };
const cleanUser = user => { const { password, ...safe } = user; return safe; };
const id = prefix => `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}`;
const findById = (collection, value) => collection.find(item => item.id === value);
const seedMemory = () => { memory.users = demoUsers.map(user => ({ ...user, password: bcrypt.hashSync(user.password, 10) })); memory.products = [...demoProducts]; memory.partners = [...demoPartners]; memory.fleet = [...demoFleet]; memory.drivers = [...demoDrivers]; };

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
async function connectDatabase() {
  if (!process.env.MONGODB_URI) { seedMemory(); return; }
  await mongoose.connect(process.env.MONGODB_URI);
  for (const [name, schema] of Object.entries(schemas)) stores[name.toLowerCase()] = mongoose.models[name] || mongoose.model(name, schema);
  if (process.env.SEED_DEMO !== 'false' && await stores.user.countDocuments() === 0) {
    await stores.user.insertMany(demoUsers.map(user => ({ ...user, password: bcrypt.hashSync(user.password, 10) })));
    await stores.product.insertMany(demoProducts); await stores.partner.insertMany(demoPartners); await stores.fleet.insertMany(demoFleet); await stores.driver.insertMany(demoDrivers);
  }
  db = 'mongo';
}
const collectionName = type => ({ user: 'users', product: 'products', partner: 'partners', fleet: 'fleet', driver: 'drivers', order: 'orders' })[type];
const all = async (type, filter = {}) => db ? (await stores[type].find(filter).lean()).map(({ _id, __v, ...item }) => item) : memory[collectionName(type)];
const one = async (type, filter) => db ? await stores[type].findOne(filter).lean() : memory[collectionName(type)].find(item => Object.entries(filter).every(([key, value]) => item[key] === value));
const insert = async (type, value) => { if (db) { const saved = await stores[type].create(value); const { _id, __v, ...item } = saved.toObject(); return item; } memory[collectionName(type)].unshift(value); return value; };
const update = async (type, filter, changes) => { if (db) { const saved = await stores[type].findOneAndUpdate(filter, changes, { new: true }).lean(); return saved; } const collection = memory[collectionName(type)]; const item = collection.find(value => Object.entries(filter).every(([key, val]) => value[key] === val)); if (item) Object.assign(item, changes); return item; };
const remove = async (type, filter) => { if (db) return stores[type].findOneAndDelete(filter); const collection = memory[collectionName(type)]; const index = collection.findIndex(value => Object.entries(filter).every(([key, val]) => value[key] === val)); if (index >= 0) collection.splice(index, 1); };

const auth = (req, res, next) => { try { const token = req.headers.authorization?.replace('Bearer ', ''); if (!token) return res.status(401).json({ error: 'Authentication required' }); req.user = jwt.verify(token, jwtSecret); next(); } catch { res.status(401).json({ error: 'Invalid or expired token' }); } };
const roles = (...allowed) => (req, res, next) => allowed.includes(req.user.role) ? next() : res.status(403).json({ error: 'Insufficient permissions' });
const issueToken = user => jwt.sign({ id: user.id, role: user.role, transportCompanyId: user.transportCompanyId || null }, jwtSecret, { expiresIn: '7d' });
const roleMatches = (user, identifier) => [user.email, user.id, user.transportId, user.driverId, user.phone?.replace(/\D/g, '')].filter(Boolean).some(value => value.toLowerCase?.() === identifier.toLowerCase() || value === identifier.replace(/\D/g, ''));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'waste2worth-api', database: db ? 'mongodb' : 'memory', time: new Date().toISOString() }));
app.post('/api/auth/register', async (req, res, next) => { try { const { name, email, phone, password, role = 'BUYER', ...profile } = req.body; const normalized = role.toUpperCase(); if (!['SELLER', 'BUYER'].includes(normalized)) return res.status(400).json({ error: 'Public registration is limited to sellers and buyers' }); if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' }); if (await one('user', { email: email.toLowerCase() })) return res.status(409).json({ error: 'Account already exists' }); const user = await insert('user', { id: id('user'), name, email: email.toLowerCase(), phone, password: await bcrypt.hash(password, 10), role: normalized, ...profile }); res.status(201).json({ user: cleanUser(user), token: issueToken(user) }); } catch (error) { next(error); } });
app.post('/api/auth/admin/register', async (req, res, next) => { try { const { name, email, phone, password, ...profile } = req.body; if (await one('user', { email: email.toLowerCase() })) return res.status(409).json({ error: 'Email already registered' }); const user = await insert('user', { id: id('user-admin'), name, email: email.toLowerCase(), phone, password: await bcrypt.hash(password, 10), role: 'ADMIN', ...profile }); res.status(201).json({ user: cleanUser(user), token: issueToken(user) }); } catch (error) { next(error); } });
app.post('/api/auth/login', async (req, res, next) => { try { const identifier = String(req.body.identifier || req.body.email || '').trim(); const candidates = await all('user'); const user = candidates.find(value => roleMatches(value, identifier)); if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.password))) return res.status(401).json({ error: 'Invalid credentials' }); const expected = req.body.expectedRole?.toUpperCase(); if (expected && user.role !== expected) return res.status(403).json({ error: `This account is registered as ${user.role}` }); res.json({ user: cleanUser(user), token: issueToken(user) }); } catch (error) { next(error); } });
app.get('/api/auth/me', auth, async (req, res, next) => { try { const user = await one('user', { id: req.user.id }); res.json({ user: cleanUser(user) }); } catch (error) { next(error); } });
app.patch('/api/auth/profile', auth, async (req, res, next) => { try { const user = await update('user', { id: req.user.id }, req.body); res.json({ user: cleanUser(user) }); } catch (error) { next(error); } });

app.get('/api/users', auth, roles('ADMIN'), async (req, res, next) => { try { res.json(await all('user')); } catch (error) { next(error); } });
app.get('/api/products', async (req, res, next) => { try { let products = await all('product'); if (req.query.category) products = products.filter(item => item.category === req.query.category); if (req.query.sellerId) products = products.filter(item => item.sellerId === req.query.sellerId); res.json(products); } catch (error) { next(error); } });
app.post('/api/products', auth, roles('SELLER', 'ADMIN'), async (req, res, next) => { try { const product = await insert('product', { id: id('PROD'), ...req.body, sellerId: req.body.sellerId || req.user.id, createdAt: new Date().toISOString().slice(0, 10) }); res.status(201).json(product); } catch (error) { next(error); } });
app.delete('/api/products/:id', auth, roles('SELLER', 'ADMIN'), async (req, res, next) => { try { await remove('product', { id: req.params.id }); res.status(204).end(); } catch (error) { next(error); } });

app.get('/api/partners', auth, async (req, res, next) => { try { res.json(await all('partner')); } catch (error) { next(error); } });
app.post('/api/partners', auth, roles('ADMIN'), async (req, res, next) => { try { res.status(201).json(await insert('partner', { id: id('comp'), invitationCode: `INV-${Date.now().toString().slice(-6)}`, agreementStatus: 'Verified Partnership', partnerStatus: 'PENDING_ACCEPTANCE', ...req.body })); } catch (error) { next(error); } });
app.patch('/api/partners/:id/status', auth, roles('ADMIN'), async (req, res, next) => { try { res.json(await update('partner', { id: req.params.id }, { partnerStatus: req.body.status })); } catch (error) { next(error); } });
app.get('/api/fleet', auth, async (req, res, next) => { try { const data = await all('fleet'); res.json(req.user.role === 'TRANSPORT_MANAGER' ? data.filter(item => item.transportCompanyId === req.user.transportCompanyId) : data); } catch (error) { next(error); } });
app.post('/api/fleet', auth, roles('TRANSPORT_MANAGER', 'ADMIN'), async (req, res, next) => { try { res.status(201).json(await insert('fleet', { id: id('veh'), transportCompanyId: req.body.transportCompanyId || req.user.transportCompanyId, companyName: req.body.companyName, currentStatus: 'Available', lat: 13.0827, lng: 80.2707, ...req.body })); } catch (error) { next(error); } });
app.get('/api/drivers', auth, async (req, res, next) => { try { const data = await all('driver'); res.json(req.user.role === 'TRANSPORT_MANAGER' ? data.filter(item => item.transportCompanyId === req.user.transportCompanyId) : data); } catch (error) { next(error); } });
app.post('/api/drivers', auth, roles('TRANSPORT_MANAGER', 'ADMIN'), async (req, res, next) => { try { const driverId = req.body.driverId || id('DRV'); const driver = await insert('driver', { id: driverId, driverId, transportCompanyId: req.body.transportCompanyId || req.user.transportCompanyId, companyName: req.body.companyName || req.user.companyName, status: 'Available', completedTripsCount: 0, ...req.body }); await insert('user', { ...driver, email: req.body.email || `${driverId.toLowerCase()}@driver.waste2worth.in`, password: await bcrypt.hash(req.body.password || 'Driver@123', 10), role: 'TRANSPORT_DRIVER' }); res.status(201).json(driver); } catch (error) { next(error); } });

app.get('/api/orders', auth, async (req, res, next) => { try { let orders = await all('order'); if (req.user.role === 'BUYER') orders = orders.filter(item => item.buyerId === req.user.id); if (req.user.role === 'SELLER') orders = orders.filter(item => item.sellerId === req.user.id); if (req.user.role === 'TRANSPORT_MANAGER') orders = orders.filter(item => item.transportCompanyId === req.user.transportCompanyId); if (req.user.role === 'TRANSPORT_DRIVER') orders = orders.filter(item => item.driverId === req.user.driverId); res.json(orders); } catch (error) { next(error); } });
app.post('/api/orders', auth, roles('BUYER'), async (req, res, next) => { try { const product = await one('product', { id: req.body.productId }); if (!product) return res.status(404).json({ error: 'Product not found' }); const quantityKg = Number(req.body.quantityKg || product.weightKg); const order = await insert('order', { id: id('ORD'), productId: product.id, productTitle: product.title, category: product.category, quantityKg, totalPrice: Math.round(product.price / product.weightKg * quantityKg), buyerId: req.user.id, buyerName: req.body.buyerName, sellerId: product.sellerId, sellerName: product.sellerName, sellerAddress: `${product.address || ''}, ${product.city || ''}, ${product.state || ''}`, buyerAddress: req.body.buyerAddress, status: 'Pending', transportRequestStatus: 'ORDER_CONFIRMED', transportCompanyId: null, driverId: null, vehicleNumber: null, pickupCoordinates: [product.lat || 13.0827, product.lng || 80.2707], deliveryCoordinates: req.body.deliveryCoordinates || [13.1327, 80.3207], currentTransportCoordinates: [product.lat || 13.0827, product.lng || 80.2707], createdAt: new Date().toISOString() }); res.status(201).json(order); } catch (error) { next(error); } });
app.patch('/api/orders/:id/status', auth, async (req, res, next) => { try { const changes = { status: req.body.status, transportRequestStatus: req.body.transportRequestStatus || req.body.status, ...req.body }; const order = await update('order', { id: req.params.id }, changes); if (!order) return res.status(404).json({ error: 'Order not found' }); if (changes.status === 'COMPLETED' || changes.status === 'Completed' || changes.status === 'DELIVERED') memory.impact.totalWasteRecycledKg += Number(order.quantityKg || 0); res.json(order); } catch (error) { next(error); } });
app.patch('/api/orders/:id/assign-partner', auth, roles('ADMIN'), async (req, res, next) => { try { const partner = await one('partner', { id: req.body.transportCompanyId }); if (!partner) return res.status(404).json({ error: 'Partner not found' }); res.json(await update('order', { id: req.params.id }, { status: 'TRANSPORT_REQUEST_SENT', transportRequestStatus: 'TRANSPORT_REQUEST_SENT', transportCompanyId: partner.id, transportCompanyName: partner.companyName })); } catch (error) { next(error); } });
app.patch('/api/orders/:id/partner-response', auth, roles('TRANSPORT_MANAGER'), async (req, res, next) => { try { const accepted = req.body.accepted !== false; res.json(await update('order', { id: req.params.id, transportCompanyId: req.user.transportCompanyId }, { status: accepted ? 'PARTNER_ACCEPTED' : 'PARTNER_REJECTED', transportRequestStatus: accepted ? 'PARTNER_ACCEPTED' : 'PARTNER_REJECTED', ...(accepted ? {} : { transportCompanyId: null, transportCompanyName: null }) })); } catch (error) { next(error); } });
app.patch('/api/orders/:id/dispatch', auth, roles('TRANSPORT_MANAGER'), async (req, res, next) => { try { const driver = await one('driver', { driverId: req.body.driverId, transportCompanyId: req.user.transportCompanyId }); const order = await update('order', { id: req.params.id, transportCompanyId: req.user.transportCompanyId }, { status: 'DRIVER_ASSIGNED', transportRequestStatus: 'DRIVER_ASSIGNED', driverId: req.body.driverId, driverName: driver?.name || 'Assigned Driver', driverPhone: driver?.phone, vehicleNumber: req.body.vehicleNumber }); await update('fleet', { vehicleNumber: req.body.vehicleNumber, transportCompanyId: req.user.transportCompanyId }, { currentStatus: 'On Pickup', assignedOrderId: req.params.id }); res.json(order); } catch (error) { next(error); } });
app.get('/api/notifications', auth, async (req, res, next) => { try { res.json(memory.notifications.filter(item => item.targetRole === 'ALL' || item.targetRole === req.user.role || (item.companyId && item.companyId === req.user.transportCompanyId))); } catch (error) { next(error); } });
app.get('/api/impact', auth, async (req, res, next) => { try { res.json(memory.impact); } catch (error) { next(error); } });
app.get('/api/dashboard', auth, async (req, res, next) => { try { const [users, products, orders, partners, fleet] = await Promise.all([all('user'), all('product'), all('order'), all('partner'), all('fleet')]); res.json({ users: users.length, products: products.length, orders: orders.length, partners: partners.length, fleetVehicles: fleet.length, environmentalImpact: memory.impact }); } catch (error) { next(error); } });
app.use((error, req, res, next) => { console.error(error); res.status(500).json({ error: 'Internal server error' }); });

connectDatabase().then(() => app.listen(port, () => console.log(`Waste2Worth API listening on http://localhost:${port}/api`))).catch(error => { console.error('Database startup failed:', error.message); process.exit(1); });
