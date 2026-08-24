# Waste2Worth backend

Express REST API for the existing Waste2Worth frontend. It uses MongoDB when `MONGODB_URI` is configured and falls back to an in-memory store for local development. The frontend currently stores data in localStorage and does not call this API, so no frontend files were changed.

## Run

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Set `MONGODB_URI` in `.env` to your MongoDB Atlas connection string. `SEED_DEMO=true` creates the demo accounts and starter marketplace data on an empty database.

API root: `http://localhost:5000/api`

Demo accounts: `admin@ecomart.in / Admin@123`, `seller@ecomart.in / Seller@123`, `buyer@ecomart.in / Buyer@123`, `TRM001 / Manager@123`, `DRV001 / Driver@123`.

Authentication uses `Authorization: Bearer <token>`. Role names are `ADMIN`, `SELLER`, `BUYER`, `TRANSPORT_MANAGER`, and `TRANSPORT_DRIVER`.
