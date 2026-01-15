# 🔧 Fix "DNS_PROBE_FINISHED_NXDOMAIN" Error

## Problem
Your Railway service is deployed but not accessible because:
1. Service is not exposed/public
2. Domain not generated/configured
3. Service might not be running

## ✅ Step-by-Step Fix

### Step 1: Check Service Status

1. Go to your **Railway dashboard**
2. Click on your service (Backend, Frontend, or Admin)
3. Check the deployment status:
   - ✅ Should show "Active" or "Deployed"
   - ❌ If it shows "Failed", check the logs

### Step 2: Enable Public Networking

1. Go to your service → **Settings** tab
2. Scroll to **Networking** section
3. Make sure **"Public Networking"** is **ENABLED**
4. If it's disabled, toggle it **ON**
5. **Save**

### Step 3: Generate Domain

1. Still in **Settings** → **Networking** section
2. Find **"Generate Domain"** button
3. Click **"Generate Domain"**
4. Railway will create a domain like: `your-service.up.railway.app`
5. Copy this domain

### Step 4: Wait for DNS Propagation

1. After generating domain, wait **1-2 minutes**
2. DNS needs time to propagate
3. Try accessing the domain again

### Step 5: Check Service is Running

1. Go to your service → **Deployments** tab
2. Click on the latest deployment
3. Check if it shows **"Deployed"** status
4. If it shows **"Failed"**, click **"View logs"** to see errors

## 🎯 Quick Checklist

- [ ] Service deployment is successful (not failed)
- [ ] Public Networking is ENABLED
- [ ] Domain is generated
- [ ] Waited 1-2 minutes for DNS
- [ ] Service is showing "Active" status

## Common Issues

### Issue 1: Service Shows "Unexposed"
**Fix**: Enable Public Networking in Settings → Networking

### Issue 2: No Domain Generated
**Fix**: Click "Generate Domain" in Settings → Networking

### Issue 3: Service Failed to Deploy
**Fix**: 
1. Check deployment logs
2. Verify build succeeded
3. Check environment variables are set
4. Verify Root Directory is set correctly

### Issue 4: Domain Shows but Service Not Responding
**Fix**:
1. Check if service is actually running
2. Verify the start command is correct
3. Check service logs for errors
4. Verify PORT environment variable is set

## For Each Service (Backend, Frontend, Admin)

You need to:
1. **Enable Public Networking** for each service
2. **Generate Domain** for each service
3. **Verify deployment** is successful

## After Fixing

1. Your service should be accessible at: `your-service.up.railway.app`
2. Frontend should be accessible
3. Backend API should be at: `your-backend.up.railway.app/api`
4. Admin should be accessible

## Still Not Working?

1. **Check Railway logs**: Service → Deployments → View logs
2. **Verify build succeeded**: Should show "Deployed" not "Failed"
3. **Check environment variables**: Make sure all required vars are set
4. **Try regenerating domain**: Delete and regenerate the domain
5. **Check service health**: Service → Metrics to see if it's running

## Important Notes

- **Backend service**: Make sure it's running and accessible
- **Frontend service**: Needs `VITE_API_URL` pointing to backend URL
- **Admin service**: Needs `VITE_API_URL` pointing to backend URL
- **CORS**: Backend needs `ALLOWED_ORIGINS` with frontend/admin URLs

