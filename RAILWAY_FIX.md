# 🔧 Railway Build Error Fix

## Problem
```
Nixpacks build failed
Nixpacks was unable to generate a build plan for this app.
```

## Solution

Railway is trying to build from the root directory, but your services are in subdirectories (`backend/`, `frontend/`, `admin/`).

### ✅ Fix: Set Root Directory in Railway Settings

For **EACH service** you deploy:

1. **Click on the service** in Railway dashboard
2. Go to **Settings** tab
3. Find **"Root Directory"** field
4. **Set it to the service directory**:
   - Backend service → `backend`
   - Frontend service → `frontend`
   - Admin service → `admin`
5. **Save** (Railway will automatically redeploy)

### Why This Happens

Railway/Nixpacks looks for `package.json` in the root directory by default. Since your project is a monorepo with services in subdirectories, you need to tell Railway where to find each service's `package.json`.

### Files Added

I've added `nixpacks.toml` files in each service directory to help Railway detect the build configuration:
- `backend/nixpacks.toml`
- `frontend/nixpacks.toml`
- `admin/nixpacks.toml`

These files tell Nixpacks how to build each service.

### Quick Steps

1. **Backend Service**:
   - Settings → Root Directory: `backend`
   - Save → Wait for redeploy

2. **Frontend Service**:
   - Settings → Root Directory: `frontend`
   - Save → Wait for redeploy

3. **Admin Service**:
   - Settings → Root Directory: `admin`
   - Save → Wait for redeploy

After setting the root directory, Railway will find the `package.json` and `nixpacks.toml` files in each directory and build successfully.

### Still Having Issues?

1. Check that the Root Directory is set correctly (no trailing slash)
2. Verify `package.json` exists in each service directory
3. Check Railway logs for specific error messages
4. Make sure you've pushed the latest code with `nixpacks.toml` files

