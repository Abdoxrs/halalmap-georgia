# HalalMap Georgia - Complete Setup Guide

🕌 Find halal restaurants and mosques across Georgia with an interactive map interface.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)

---

## ✨ Features

### Public Features
- 🗺️ Interactive OpenStreetMap with custom markers
- 📍 "Use My Location" button with geolocation
- 🔍 Filter by type (restaurants/mosques) and distance
- ✅ Verified halal certification indicators
- 🧭 Direct OpenStreetMap navigation links
- 📱 Fully responsive design

### Admin Features
- 🔐 JWT authentication
- ➕ Create/Edit/Delete places
- ✅ Toggle verification status
- 📊 Dashboard with statistics
- 🏢 Manage multiple cities

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Leaflet** + **OpenStreetMap** for mapping
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **PostgreSQL** with PostGIS extension
- **JWT** for authentication
- **Bcrypt** for password hashing
- **TypeScript**

### Database
- **Supabase** (Hosted PostgreSQL)
- **PostGIS** for geographic queries

---

## 📦 Prerequisites

Before starting, ensure you have:

- **Node.js** 18+ and npm
- **PostgreSQL** (or Supabase account)
- **Git**

Note: OpenStreetMap doesn't require API keys!

---

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/halalmap-georgia.git
cd halalmap-georgia
```

### 2. Set Up Supabase Database

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Note your database credentials:
   - Host
   - Port
   - Database name
   - Password

---

## 💾 Database Setup

### Step 1: Create Database Schema

Connect to your Supabase database using SQL Editor:

```bash
# Copy schema to Supabase SQL Editor
# Run the contents of database/schema.sql
```

Or use `psql`:

```bash
psql -h db.xxx.supabase.co -p 5432 -U postgres -d postgres -f database/schema.sql
```

### Step 2: Enable PostGIS Extension

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Step 3: Seed Initial Data

```bash
psql -h db.xxx.supabase.co -p 5432 -U postgres -d postgres -f database/seed.sql
```

### Step 4: Create Admin User

```sql
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$rq5vN5YZwKu5uV0qH8qfLOxKQ6tX0h4B7w3jZ8qX9yF5Q3H7W9jZe', 'admin@halalmap.ge');
```

**Default credentials:**
- Username: `admin`
- Password: `Admin@123`

⚠️ **CHANGE THESE IN PRODUCTION!**

---

## 🔐 Environment Variables

### Backend Configuration

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Supabase (optional)
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

### Frontend Configuration

Create `frontend/.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Default Location (Tbilisi)
NEXT_PUBLIC_DEFAULT_LAT=41.7151
NEXT_PUBLIC_DEFAULT_LNG=44.8271

# Note: OpenStreetMap requires no API key
```

---

## 🏃 Running Locally

### Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Access the Application

- **Public Map**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **API Health**: http://localhost:5000/health

---

## 🌐 Deployment

### Deploy Backend to Vercel

1. **Create `vercel.json` in backend folder:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

2. **Build TypeScript:**

```bash
cd backend
npm run build
```

3. **Deploy to Vercel:**

```bash
vercel --prod
```

4. **Set environment variables** in Vercel dashboard

### Deploy Frontend to Vercel

1. **Connect repository** to Vercel
2. **Set framework preset** to Next.js
3. **Add environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` (your backend URL)

4. **Deploy:**

```bash
cd frontend
vercel --prod
```

### Update CORS

Update backend `CORS_ORIGIN` to include your frontend domain:

```env
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

---

## 📚 API Documentation

### Public Endpoints

#### Get Nearby Places
```
GET /api/places/nearby?lat=41.7151&lng=44.8271&distance=5000&type=restaurant
```

#### Get All Places
```
GET /api/places?type=restaurant&verified=true&city=Tbilisi
```

#### Get Place by ID
```
GET /api/places/:id
```

#### Get Statistics
```
GET /api/places/statistics
```

### Admin Endpoints (Requires JWT)

#### Login
```
POST /api/admin/login
Body: { "username": "admin", "password": "Admin@123" }
```

#### Create Place
```
POST /api/admin/places
Headers: Authorization: Bearer <token>
Body: {
  "name": "Restaurant Name",
  "type": "restaurant",
  "latitude": 41.7151,
  "longitude": 44.8271,
  "city": "Tbilisi"
}
```

#### Update Place
```
PUT /api/admin/places/:id
Headers: Authorization: Bearer <token>
Body: { "verified": true }
```

#### Delete Place
```
DELETE /api/admin/places/:id
Headers: Authorization: Bearer <token>
```

#### Toggle Verification
```
PATCH /api/admin/places/:id/verify
Headers: Authorization: Bearer <token>
```

---

## 🐛 Troubleshooting

### Database Connection Issues
- Check Supabase credentials
- Verify PostGIS extension is enabled
- Check firewall/network settings

### Map Not Loading
- Check internet connection (OpenStreetMap tiles require internet)
- Verify NEXT_PUBLIC_API_URL points to correct backend
- Check browser console for errors

### CORS Errors
- Update CORS_ORIGIN in backend
- Check frontend API_URL is correct

---

## 📝 License

MIT License

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

## 📧 Support

For issues, please contact: support@halalmap.ge

---

**Built with ❤️ for the Muslim community in Georgia**
