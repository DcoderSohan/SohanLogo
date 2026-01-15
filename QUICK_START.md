# 🚀 Quick Start - Railway Deployment

## Prerequisites Checklist

- [ ] Railway account created
- [ ] GitHub repository with your code
- [ ] MongoDB Atlas account (or use Railway MongoDB)
- [ ] Cloudinary account

## Deployment Steps (5 minutes)

### 1. Deploy Backend (2 min)

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Select your repo
3. **⚠️ CRITICAL**: Click service → **Settings** → **Root Directory**: Set to `backend` (this is required!)
4. **Variables** → Add:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=generate_random_32_char_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Copy backend URL (e.g., `https://backend-xxx.up.railway.app`)

### 2. Deploy Frontend (1 min)

1. Same project → **+ New** → **GitHub Repo** → Same repo
2. **⚠️ CRITICAL**: Click service → **Settings** → **Root Directory**: Set to `frontend` (this is required!)
3. Build and start commands are auto-detected from `nixpacks.toml`
4. **Variables** → Add:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   ```
5. Copy frontend URL

### 3. Deploy Admin (1 min)

1. Same project → **+ New** → **GitHub Repo** → Same repo
2. **⚠️ CRITICAL**: Click service → **Settings** → **Root Directory**: Set to `admin` (this is required!)
3. Build and start commands are auto-detected from `nixpacks.toml`
4. **Variables** → Add:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   ```
5. Copy admin URL

### 4. Update Backend CORS (1 min)

1. Backend service → **Variables**
2. Add:
   ```
   ALLOWED_ORIGINS=https://your-frontend-url.up.railway.app,https://your-admin-url.up.railway.app
   ```
3. Backend will auto-redeploy

## ✅ Done!

Your services are now live:
- Frontend: `https://your-frontend.up.railway.app`
- Admin: `https://your-admin.up.railway.app`
- Backend API: `https://your-backend.up.railway.app/api`

## 🔗 Next Steps

- Set up custom domains (optional)
- Test all functionality
- Monitor logs in Railway dashboard

For detailed instructions, see `RAILWAY_DEPLOYMENT.md`

