# 🔌 Port Configuration Explanation

## Important: You DON'T Need to Set PORT!

### Why?

**Railway automatically sets the `PORT` environment variable** for each service. You don't need to (and shouldn't) set it manually.

### How It Works

1. **Railway assigns a port** automatically when your service starts
2. **Railway sets `PORT` environment variable** with that port number
3. **Your app uses `$PORT`** in the start command:
   ```json
   "start": "vite preview --host 0.0.0.0 --port $PORT"
   ```
4. **Vite uses the port** Railway assigned

### Port Numbers Explained

- **5173**: Default Vite dev server port (only for `npm run dev` locally)
- **3000/3001**: Just example numbers - not actually used
- **Railway's PORT**: Railway assigns a random port automatically (could be any number)

### What You Need to Set

**Only this environment variable:**
```
VITE_API_URL=https://your-backend.up.railway.app/api
```

**NOT this:**
```
PORT=3000  ❌ Don't set this - Railway does it automatically!
```

### For Backend

Backend also doesn't need PORT set:
```javascript
const PORT = process.env.PORT || 5000;
```
Railway automatically provides `process.env.PORT`, so it will use Railway's assigned port.

### Summary

✅ **Railway sets PORT automatically**  
✅ **Your app uses `$PORT` in start command**  
✅ **No need to set PORT manually**  
❌ **Don't add PORT=3000 or PORT=5173**

The port number doesn't matter - Railway handles it automatically!

