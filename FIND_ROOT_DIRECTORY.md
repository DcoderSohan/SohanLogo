# 🔍 How to Find Root Directory in Railway

## Where to Find Root Directory Setting

The Root Directory setting location can vary in Railway's UI. Here's where to look:

### Option 1: In the Source Section
1. Click on your service
2. Go to **Settings** tab
3. Look in the **"Source"** section (at the top)
4. You should see **"Root Directory"** or **"Working Directory"** field
5. If you see "Add Root Directory" - click it and enter: `backend`, `frontend`, or `admin`

### Option 2: In the Service Settings
1. Click on your service
2. Go to **Settings** tab
3. Scroll down to find **"Service"** section
4. Look for **"Root Directory"** field

### Option 3: If You Don't See It

If the Root Directory field is not visible, try this alternative approach:

**Use Config-as-Code (Railway Config File)**

1. In Settings, scroll to **"Config-as-code"** section
2. Click **"Add File Path"**
3. For each service, create a `railway.json` in the service directory with:

**For Backend** (`backend/railway.json`):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install",
    "watchPatterns": ["backend/**"]
  },
  "deploy": {
    "startCommand": "cd backend && npm start"
  }
}
```

**For Frontend** (`frontend/railway.json`):
```json
{
  "$schema": "https://railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd frontend && npm install && npm run build",
    "watchPatterns": ["frontend/**"]
  },
  "deploy": {
    "startCommand": "cd frontend && npm run preview -- --host 0.0.0.0 --port $PORT"
  }
}
```

**For Admin** (`admin/railway.json`):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd admin && npm install && npm run build",
    "watchPatterns": ["admin/**"]
  },
  "deploy": {
    "startCommand": "cd admin && npm run preview -- --host 0.0.0.0 --port $PORT"
  }
}
```

## Alternative: Deploy Each Service Separately

If you can't find the Root Directory setting, you can:

1. **Create separate Railway projects** for each service
2. **Or use Railway's monorepo feature** by connecting the same repo 3 times, each time specifying the directory in the connection settings

## Quick Visual Guide

Look for these in Settings:
- ✅ **"Root Directory"** field
- ✅ **"Working Directory"** field  
- ✅ **"Add Root Directory"** button (in Source section)
- ✅ **"Service Root"** field

## Still Can't Find It?

1. **Check Railway's latest docs**: The UI might have changed
2. **Try the Build Command approach**: Set custom build command as `cd backend && npm install && npm start`
3. **Contact Railway support**: They can guide you to the exact location

## Recommended: Use the Config File Approach

The easiest solution is to use the `railway.json` files I've created. Railway should auto-detect them, but if not, you can specify the path in the "Config-as-code" section.

