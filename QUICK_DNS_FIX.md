# ⚡ Quick Fix: Site Not Showing

## 3 Steps to Fix

### 1. Enable Public Networking
- Service → **Settings** → **Networking**
- Toggle **"Public Networking"** to **ON**
- **Save**

### 2. Generate Domain
- Same **Networking** section
- Click **"Generate Domain"** button
- Copy the domain (e.g., `your-service.up.railway.app`)

### 3. Wait & Check
- Wait **1-2 minutes** for DNS
- Check deployment status is **"Deployed"** (not "Failed")
- Try accessing the domain

## If Still Not Working

1. **Check deployment logs**: Service → Deployments → View logs
2. **Verify build succeeded**: Should show green "Deployed"
3. **Check service is running**: Service → Metrics

## Common Problem

**"Unexposed service"** badge = Public Networking is OFF
**Fix**: Enable it in Settings → Networking

