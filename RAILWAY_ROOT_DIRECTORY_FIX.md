# 🎯 Railway Root Directory - Quick Fix

## The Problem
Railway is building from the root, but your services are in `backend/`, `frontend/`, and `admin/` directories.

## ✅ Solution 1: Use Custom Build Commands (EASIEST)

Since you can't find the Root Directory setting, use **Custom Build Command** and **Custom Start Command**:

### For Backend Service:
1. Go to **Settings** → **Build** section
2. **Custom Build Command**: `cd backend && npm install`
3. Go to **Deploy** section  
4. **Custom Start Command**: `cd backend && npm start`
5. Save

### For Frontend Service:
1. Go to **Settings** → **Build** section
2. **Custom Build Command**: `cd frontend && npm install && npm run build`
3. Go to **Deploy** section
4. **Custom Start Command**: `cd frontend && npm run preview -- --host 0.0.0.0 --port $PORT`
5. Save

### For Admin Service:
1. Go to **Settings** → **Build** section
2. **Custom Build Command**: `cd admin && npm install && npm run build`
3. Go to **Deploy** section
4. **Custom Start Command**: `cd admin && npm run preview -- --host 0.0.0.0 --port $PORT`
5. Save

## ✅ Solution 2: Use Config-as-Code

1. In **Settings**, scroll to **"Config-as-code"** section
2. Click **"Add File Path"**
3. Enter the path to the railway.json file:
   - Backend: `backend/railway.json`
   - Frontend: `frontend/railway.json`
   - Admin: `admin/railway.json`
4. Save

The railway.json files I've updated will handle the `cd` commands automatically.

## ✅ Solution 3: Find Root Directory in Source Section

1. Click on your service
2. Go to **Settings** tab
3. Look at the very top in the **"Source"** section
4. You should see **"Add Root Directory"** button or field
5. Click it and enter:
   - `backend` for backend service
   - `frontend` for frontend service
   - `admin` for admin service

## 🚀 Recommended: Use Solution 1 (Custom Commands)

This is the most reliable method and doesn't require finding hidden settings. Just use the Custom Build Command and Custom Start Command fields that are clearly visible in your Settings.

## After Setting Up

1. Railway will automatically redeploy
2. Check the logs to verify it's working
3. The build should now succeed!

