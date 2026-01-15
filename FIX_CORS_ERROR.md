# 🔧 Fix CORS Error: "No 'Access-Control-Allow-Origin' header"

## Problem
Your frontend at `https://sohan-sarang.onrender.com` is being blocked by CORS when trying to access the backend at `https://sohanlogo.onrender.com`.

## ✅ Solution: Set ALLOWED_ORIGINS on Render

### Step 1: Go to Render Dashboard
1. Go to [render.com](https://render.com)
2. Sign in to your account
3. Find your **backend service** (`sohanlogo`)

### Step 2: Add Environment Variable
1. Click on your **backend service**
2. Go to **Environment** tab (or **Environment Variables**)
3. Click **Add Environment Variable**
4. Add:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://sohan-sarang.onrender.com,https://your-admin-url.onrender.com`
   - Replace `your-admin-url.onrender.com` with your actual admin URL if you have one

### Step 3: Save and Redeploy
1. Click **Save Changes**
2. Render will automatically redeploy your backend
3. Wait for deployment to complete

### Step 4: Verify
1. Go back to your frontend
2. Refresh the page
3. CORS errors should be gone!

## 📝 Example Environment Variable

```
ALLOWED_ORIGINS=https://sohan-sarang.onrender.com,https://your-admin.onrender.com
```

**Important**: 
- Use **comma-separated** URLs (no spaces after commas)
- Include **https://** protocol
- **No trailing slashes** (e.g., `https://sohan-sarang.onrender.com` not `https://sohan-sarang.onrender.com/`)

## 🔍 If You Have Multiple Frontends

If you have multiple frontend URLs (frontend + admin), separate them with commas:

```
ALLOWED_ORIGINS=https://sohan-sarang.onrender.com,https://admin-sohan-sarang.onrender.com
```

## 🎯 Quick Checklist

- [ ] Logged into Render dashboard
- [ ] Found backend service (`sohanlogo`)
- [ ] Added `ALLOWED_ORIGINS` environment variable
- [ ] Value includes `https://sohan-sarang.onrender.com`
- [ ] Saved changes
- [ ] Waited for redeploy
- [ ] Tested frontend - CORS errors gone!

## ⚠️ Common Mistakes

1. **Missing https://** - Must include protocol
2. **Trailing slash** - Don't add `/` at the end
3. **Spaces after commas** - Use `,` not `, `
4. **Wrong service** - Make sure you're editing the BACKEND service, not frontend

## 🆘 Still Not Working?

1. **Check the variable name**: Must be exactly `ALLOWED_ORIGINS` (case-sensitive)
2. **Verify the URL**: Make sure it matches your frontend URL exactly
3. **Check deployment logs**: Backend should show "Connected to MongoDB" and "Server is running"
4. **Clear browser cache**: Sometimes cached CORS errors persist
5. **Check Render logs**: Look for any errors in the backend service logs

## 📚 What This Does

The `ALLOWED_ORIGINS` environment variable tells your backend which frontend URLs are allowed to make API requests. Without it, the browser blocks cross-origin requests for security.

After setting this, your backend will accept requests from `https://sohan-sarang.onrender.com` and your frontend will work correctly!

