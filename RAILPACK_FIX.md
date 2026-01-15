# 🔧 Fix Railpack Build Error

## Problem
Railway is using **Railpack** (new default builder) which can't detect your Node.js apps because they're in subdirectories.

## ✅ Solution 1: Switch to Nixpacks (Recommended)

1. Go to your service **Settings**
2. Scroll to **Build** section
3. Find **"Builder"** dropdown
4. Change from **"Railpack"** to **"Nixpacks"**
5. Save (Railway will redeploy)

Nixpacks will use the `nixpacks.toml` files I created in each service directory.

## ✅ Solution 2: Use Custom Build Commands (Works with Railpack)

If you want to keep using Railpack, use Custom Build/Start Commands:

### Backend Service:
- **Custom Build Command**: `cd backend && npm install`
- **Custom Start Command**: `cd backend && npm start`

### Frontend Service:
- **Custom Build Command**: `cd frontend && npm install && npm run build`
- **Custom Start Command**: `cd frontend && npm run preview -- --host 0.0.0.0 --port $PORT`

### Admin Service:
- **Custom Build Command**: `cd admin && npm install && npm run build`
- **Custom Start Command**: `cd admin && npm run preview -- --host 0.0.0.0 --port $PORT`

## ✅ Solution 3: Set Root Directory (If Available)

1. In **Settings** → **Source** section
2. Look for **"Root Directory"** or **"Add Root Directory"**
3. Set it to:
   - `backend` for backend service
   - `frontend` for frontend service
   - `admin` for admin service

## 🎯 Recommended: Use Solution 1 (Switch to Nixpacks)

This is the easiest because:
- Nixpacks will auto-detect the `nixpacks.toml` files
- No need to set custom commands
- Works better with monorepos

## Steps to Fix Right Now:

1. **Go to your failing service** in Railway
2. **Settings** → **Build** section
3. **Builder** dropdown → Select **"Nixpacks"**
4. **Save** → Wait for redeploy
5. If it still fails, add **Custom Build Command**: `cd backend && npm install` (or `cd frontend` or `cd admin`)

