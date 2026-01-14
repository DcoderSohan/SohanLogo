# Cloudinary & Image Upload Setup Guide

## Prerequisites

1. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com) (free tier available)

2. **Get Your Cloudinary Credentials**:
   - Log in to your Cloudinary dashboard
   - Go to **Settings** → **Product Environment Credentials**
   - Copy your:
     - Cloud Name
     - API Key
     - API Secret

## Backend Setup

1. **Install Dependencies** (already done):
   ```bash
   cd backend
   npm install multer cloudinary
   ```

2. **Configure Environment Variables**:
   - Create a `.env` file in the `backend` directory (if it doesn't exist)
   - Add your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   MONGODB_URI=mongodb://localhost:27017/sohanlogo
   PORT=5000
   ```

3. **Start the Backend Server**:
   ```bash
   cd backend
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## Frontend Setup

1. **Configure API URL** (if needed):
   - Create `.env` file in `admin` and `frontend` directories:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Start Frontend Apps**:
   ```bash
   # Admin Panel
   cd admin
   npm run dev

   # Frontend Website
   cd frontend
   npm run dev
   ```

## How It Works

### Image Upload Flow

1. **Admin Panel**:
   - When you upload an image in the admin panel (Hero section, Skills section, etc.)
   - The image is sent to `/api/upload/single` endpoint
   - Multer saves it temporarily to `backend/uploads/`
   - Cloudinary uploads it and returns a secure URL
   - The temporary file is deleted
   - The Cloudinary URL is saved to the database

2. **Frontend Display**:
   - Frontend fetches home content from `/api/home`
   - Images are displayed directly from Cloudinary URLs
   - No need to store images locally

### API Endpoints

- **POST `/api/upload/single`**: Upload a single image
  - Body: `FormData` with `image` field
  - Returns: `{ success: true, data: { url: "https://..." } }`

- **POST `/api/upload/multiple`**: Upload multiple images
  - Body: `FormData` with `images` array
  - Returns: `{ success: true, data: { urls: ["https://...", ...] } }`

## Troubleshooting

### Images Not Uploading

1. **Check Cloudinary Credentials**:
   - Verify your `.env` file has correct credentials
   - Make sure there are no extra spaces or quotes

2. **Check File Size**:
   - Maximum file size is 5MB
   - If you need larger files, update `backend/middlewares/upload.js`

3. **Check CORS**:
   - Make sure your frontend URL is in the CORS allowed origins in `backend/server.js`

4. **Check Console Logs**:
   - Backend: Check terminal for error messages
   - Frontend: Check browser console for API errors

### Images Not Displaying

1. **Check Cloudinary URL**:
   - Verify the URL in the database is a valid Cloudinary URL
   - Format: `https://res.cloudinary.com/...`

2. **Check Network Tab**:
   - Open browser DevTools → Network tab
   - See if image requests are failing

## Notes

- Images are stored in Cloudinary folder: `sohanlogo/`
- Temporary uploads are stored in `backend/uploads/` (auto-deleted after upload)
- Make sure `backend/uploads/` directory exists (created automatically on server start)

