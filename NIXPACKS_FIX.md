# 🔧 Fix "cd: backend: No such file or directory" Error

## Problem
The `nixpacks.toml` files had `cd backend` commands, but when Railway uses these files, it's already building from the root directory, so `cd backend` fails.

## ✅ Solution: Set Root Directory in Railway

The `nixpacks.toml` files are designed to work **when Root Directory is set**. Here's how to fix it:

### Step 1: Set Root Directory for Each Service

**For Backend Service:**
1. Go to your **Backend service** in Railway
2. Click **Settings** tab
3. Look in **Source** section (at the top)
4. Find **"Add Root Directory"** or **"Root Directory"** field
5. Set it to: `backend`
6. **Save**

**For Frontend Service:**
1. Go to your **Frontend service** in Railway
2. **Settings** → **Source** section
3. Set **Root Directory** to: `frontend`
4. **Save**

**For Admin Service:**
1. Go to your **Admin service** in Railway
2. **Settings** → **Source** section
3. Set **Root Directory** to: `admin`
4. **Save**

### Step 2: Switch Builder to Nixpacks

1. **Settings** → **Build** section
2. **Builder** dropdown → Select **"Nixpacks"**
3. **Save**

### How It Works

- When Root Directory is set to `backend`, Railway builds from that directory
- Nixpacks reads `backend/nixpacks.toml`
- Commands run from within `backend/` directory
- No `cd` commands needed - we're already there!

## ✅ Alternative: Use Custom Build Commands

If you can't find Root Directory setting, use Custom Build/Start Commands:

**Backend:**
- **Custom Build Command**: `cd backend && npm install`
- **Custom Start Command**: `cd backend && npm start`

**Frontend:**
- **Custom Build Command**: `cd frontend && npm install && npm run build`
- **Custom Start Command**: `cd frontend && npm run preview -- --host 0.0.0.0 --port $PORT`

**Admin:**
- **Custom Build Command**: `cd admin && npm install && npm run build`
- **Custom Start Command**: `cd admin && npm run preview -- --host 0.0.0.0 --port $PORT`

## What I Fixed

I removed the `cd` commands from `nixpacks.toml` files because:
- When Root Directory is set, Nixpacks already runs from that directory
- The `cd` commands were causing the error
- Now the files work correctly with Root Directory setting

## After Setting Root Directory

1. Railway will build from the correct directory
2. Nixpacks will find `package.json` in that directory
3. Build will succeed
4. Service will deploy

## Still Can't Find Root Directory?

Use the **Custom Build Command** approach - it's more reliable and always works!

