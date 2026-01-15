# Railway Deployment Guide

This guide will help you deploy your portfolio website (Backend, Frontend, and Admin) to Railway.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **MongoDB Atlas**: Free MongoDB database (or Railway MongoDB plugin)
4. **Cloudinary Account**: For image uploads

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. Make sure all your code is committed and pushed to GitHub
2. Ensure you have the following files in your repository:
   - `backend/nixpacks.toml` (Nixpacks build configuration)
   - `frontend/nixpacks.toml` (Nixpacks build configuration)
   - `admin/nixpacks.toml` (Nixpacks build configuration)
   - Updated `backend/server.js` with production CORS

**⚠️ IMPORTANT**: When deploying each service in Railway, you MUST set the **Root Directory** in Settings:
- Backend: `backend`
- Frontend: `frontend`
- Admin: `admin`

Without setting the Root Directory, Railway will try to build from the repository root and fail!

### Step 2: Deploy Backend Service

1. **Go to Railway Dashboard**: [railway.app](https://railway.app)
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**
5. **IMPORTANT - Configure the service**:
   - Click on the service → **Settings** tab
   - **Root Directory**: ⚠️ **CRITICAL** - Set to `backend` (this tells Railway where to find package.json)
   - **Build Command**: Leave empty (Nixpacks will auto-detect from `backend/nixpacks.toml`)
   - **Start Command**: `npm start` (or leave empty, it's in nixpacks.toml)
   - **Watch Paths**: `backend/**` (optional, for auto-deploy on changes)

6. **Add Environment Variables**:
   Click on your backend service → Variables tab → Add the following:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_random_secret_key_here
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=production
   ```

7. **Get Backend URL**: 
   - After deployment, Railway will provide a URL like: `https://your-backend.up.railway.app`
   - Copy this URL - you'll need it for frontend configuration

### Step 3: Deploy Frontend Service

1. **In the same Railway project**, click **"+ New"** → **"GitHub Repo"**
2. **Select the same repository**
3. **IMPORTANT - Configure the service**:
   - Click on the service → **Settings** tab
   - **Root Directory**: ⚠️ **CRITICAL** - Set to `frontend` (this tells Railway where to find package.json)
   - **Build Command**: Leave empty (Nixpacks will auto-detect from `frontend/nixpacks.toml`)
   - **Start Command**: Leave empty (it's in nixpacks.toml)
   - **Watch Paths**: `frontend/**` (optional, for auto-deploy on changes)

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   PORT=3000
   ```

5. **Get Frontend URL**: Copy the Railway-provided URL

### Step 4: Deploy Admin Service

1. **In the same Railway project**, click **"+ New"** → **"GitHub Repo"**
2. **Select the same repository**
3. **IMPORTANT - Configure the service**:
   - Click on the service → **Settings** tab
   - **Root Directory**: ⚠️ **CRITICAL** - Set to `admin` (this tells Railway where to find package.json)
   - **Build Command**: Leave empty (Nixpacks will auto-detect from `admin/nixpacks.toml`)
   - **Start Command**: Leave empty (it's in nixpacks.toml)
   - **Watch Paths**: `admin/**` (optional, for auto-deploy on changes)

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   PORT=3001
   ```

5. **Get Admin URL**: Copy the Railway-provided URL

### Step 5: Update Backend CORS

1. **Go back to your Backend service** → **Variables**
2. **Add/Update** the `ALLOWED_ORIGINS` variable:
   ```
   ALLOWED_ORIGINS=https://your-frontend.up.railway.app,https://your-admin.up.railway.app
   ```
   Replace with your actual Railway URLs

3. **Redeploy** the backend service (Railway will auto-redeploy when you save variables)

### Step 6: Set Up MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it to Railway backend environment variables as `MONGODB_URI`

**Option B: Railway MongoDB Plugin**
1. In Railway project, click **"+ New"** → **"Database"** → **"MongoDB"**
2. Railway will automatically create `MONGO_URL` variable
3. Update your backend to use `MONGO_URL` instead of `MONGODB_URI` (or rename the variable)

### Step 7: Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com) and sign up
2. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Add them to Railway backend environment variables

### Step 8: Custom Domains (Optional)

1. **For each service** (Frontend, Admin, Backend):
   - Click on the service → **Settings** → **Domains**
   - Click **"Generate Domain"** or **"Custom Domain"**
   - Follow Railway's instructions to configure DNS

2. **Update Environment Variables**:
   - Update `ALLOWED_ORIGINS` in backend with your custom domains
   - Update `VITE_API_URL` in frontend/admin with your backend custom domain

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- **Solution**: Check logs in Railway dashboard. Common issues:
  - Missing environment variables
  - MongoDB connection string incorrect
  - Port configuration (Railway sets PORT automatically)

**Problem**: CORS errors
- **Solution**: Make sure `ALLOWED_ORIGINS` includes your frontend/admin URLs (without trailing slash)

### Frontend/Admin Issues

**Problem**: Can't connect to API
- **Solution**: 
  - Verify `VITE_API_URL` is correct
  - Check backend is running and accessible
  - Ensure backend CORS allows your frontend URL

**Problem**: Build fails
- **Solution**: Check build logs. Common issues:
  - Missing dependencies
  - Environment variables not set
  - Build command incorrect

### Database Issues

**Problem**: MongoDB connection fails
- **Solution**:
  - Verify connection string format
  - Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Railway)
  - Ensure database user has correct permissions

## 📝 Environment Variables Summary

### Backend (`backend/`)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ALLOWED_ORIGINS=https://frontend-url.up.railway.app,https://admin-url.up.railway.app
NODE_ENV=production
```

### Frontend (`frontend/`)
```
VITE_API_URL=https://backend-url.up.railway.app/api
PORT=3000
```

### Admin (`admin/`)
```
VITE_API_URL=https://backend-url.up.railway.app/api
PORT=3001
```

## 🎯 Quick Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Admin deployed and running
- [ ] MongoDB connected
- [ ] Cloudinary configured
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] All services accessible via Railway URLs
- [ ] Test API endpoints
- [ ] Test frontend/admin login
- [ ] Test image uploads

## 🔐 Security Notes

1. **Never commit `.env` files** - Use Railway environment variables
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **Restrict MongoDB access** - Use IP whitelist in MongoDB Atlas
4. **Use HTTPS** - Railway provides SSL certificates automatically
5. **Keep dependencies updated** - Regularly update npm packages

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🆘 Need Help?

If you encounter issues:
1. Check Railway logs: Service → Deployments → View Logs
2. Check build logs for errors
3. Verify all environment variables are set correctly
4. Test API endpoints with Postman/curl

---

**Happy Deploying! 🚀**

