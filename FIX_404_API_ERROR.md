# 🔧 Fix 404 Error: "Cannot GET /about", "Cannot GET /home", etc.

## Problem
Your frontend is getting 404 errors because API requests are missing the `/api` prefix:
- ❌ `sohanlogo.onrender.com/about` (wrong - missing `/api`)
- ✅ `sohanlogo.onrender.com/api/about` (correct)

## ✅ Solution: Fix VITE_API_URL on Render

The `VITE_API_URL` environment variable on your **frontend service** must include `/api` at the end.

### Step 1: Go to Render Dashboard
1. Go to [render.com](https://render.com)
2. Sign in
3. Find your **frontend service** (`sohan-sarang`)

### Step 2: Check/Update Environment Variable
1. Click on your **frontend service**
2. Go to **Environment** tab
3. Find `VITE_API_URL` environment variable
4. **It should be**: `https://sohanlogo.onrender.com/api`
5. **NOT**: `https://sohanlogo.onrender.com` (missing `/api`)

### Step 3: Update if Wrong
If `VITE_API_URL` is set to `https://sohanlogo.onrender.com` (without `/api`):

1. Click **Edit** on the `VITE_API_URL` variable
2. Change it to: `https://sohanlogo.onrender.com/api`
3. **Important**: Make sure `/api` is at the end!
4. Click **Save Changes**

### Step 4: Redeploy
1. Render will automatically redeploy
2. Wait for deployment to complete
3. Test your frontend - 404 errors should be gone!

## 📝 Correct Environment Variable

```
VITE_API_URL=https://sohanlogo.onrender.com/api
```

**Key Points:**
- ✅ Must include `/api` at the end
- ✅ Use `https://` (not `http://`)
- ✅ No trailing slash after `/api`

## 🔍 How to Verify

After updating, check the browser console:
- ✅ Should see requests to: `sohanlogo.onrender.com/api/about`
- ❌ Should NOT see: `sohanlogo.onrender.com/about`

## 🎯 Quick Checklist

- [ ] Logged into Render dashboard
- [ ] Found frontend service
- [ ] Checked `VITE_API_URL` environment variable
- [ ] Value is `https://sohanlogo.onrender.com/api` (with `/api`)
- [ ] Saved changes
- [ ] Waited for redeploy
- [ ] Tested frontend - 404 errors fixed!

## ⚠️ Common Mistakes

1. **Missing `/api`**: `https://sohanlogo.onrender.com` ❌
   - Should be: `https://sohanlogo.onrender.com/api` ✅

2. **Extra slash**: `https://sohanlogo.onrender.com/api/` ❌
   - Should be: `https://sohanlogo.onrender.com/api` ✅

3. **Wrong protocol**: `http://sohanlogo.onrender.com/api` ❌
   - Should be: `https://sohanlogo.onrender.com/api` ✅

## 🆘 Still Not Working?

1. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check deployment logs**: Make sure frontend rebuilt successfully
3. **Verify backend is running**: Check backend service status on Render
4. **Check browser console**: Look for the actual request URLs being made

## 📚 Why This Happens

Your backend routes are all prefixed with `/api`:
- `/api/about`
- `/api/home`
- `/api/projects`
- `/api/contact-page`

So the frontend's `baseURL` must end with `/api` so that when you call `api.get('/about')`, it becomes `/api/about`.

