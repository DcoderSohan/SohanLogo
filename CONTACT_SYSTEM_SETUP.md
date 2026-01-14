# Contact Management System - Setup Guide

## Overview
This system allows users to submit contact forms which are saved to the database, and admins can view and manage all contacts through the admin panel.

## System Architecture

### 1. Frontend Contact Form
- **Location**: `frontend/src/Components/Contact/Contact.jsx`
- **Functionality**:
  - Users fill out contact form (name, email, mobile, message)
  - Form sends email via EmailJS
  - Form saves data to database via axios API
  - Shows success/error notifications

### 2. Backend API
- **Location**: `backend/`
- **Server**: Express.js with MongoDB
- **Endpoints**:
  - `POST /api/contacts` - Create new contact
  - `GET /api/contacts` - Get all contacts (with pagination, filtering)
  - `GET /api/contacts/stats` - Get contact statistics
  - `GET /api/contacts/:id` - Get single contact
  - `PATCH /api/contacts/:id` - Update contact status
  - `DELETE /api/contacts/:id` - Delete contact

### 3. Admin Panel
- **Location**: `admin/src/Components/Dashboard/ContactContent.jsx`
- **Features**:
  - View all contact messages
  - Statistics dashboard (Total, New, Read, Replied, Archived)
  - Search contacts
  - Filter by status
  - Pagination
  - Update contact status
  - Delete contacts
  - View detailed contact information

## Setup Instructions

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Admin
cd ../admin
npm install
```

### Step 2: Configure MongoDB

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sohanlogo
```

Or use MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sohanlogo
```

### Step 3: Configure API URLs (Optional)

Create `.env` files in `frontend` and `admin` folders:

```env
VITE_API_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`

### Step 4: Start the Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Admin
cd admin
npm run dev
```

## Data Flow

1. **User submits contact form**:
   - Form validates input
   - Sends email via EmailJS
   - Saves to database via `POST /api/contacts`
   - Shows success message

2. **Admin views contacts**:
   - Admin panel loads contacts via `GET /api/contacts`
   - Displays statistics via `GET /api/contacts/stats`
   - Shows all contacts with pagination

3. **Admin manages contacts**:
   - Update status: `PATCH /api/contacts/:id`
   - Delete contact: `DELETE /api/contacts/:id`
   - View details: Opens modal with full contact info

## Contact Status Types

- **new**: Newly received contact (default)
- **read**: Admin has viewed the contact
- **replied**: Admin has replied to the contact
- **archived**: Contact has been archived

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

## Features

✅ Contact form saves to database
✅ Admin panel displays all contacts
✅ Search and filter functionality
✅ Status management
✅ Pagination support
✅ Statistics dashboard
✅ Delete contacts
✅ View detailed contact information
✅ Responsive design

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB is running
- Verify MONGODB_URI in `.env` file
- Check MongoDB connection string format

### Frontend/Admin can't connect to API
- Verify backend server is running on port 5000
- Check CORS settings in backend
- Verify VITE_API_URL in `.env` files

### Contacts not showing in admin panel
- Check browser console for errors
- Verify backend API is responding
- Check network tab for failed requests

## Testing

1. Submit a contact form from the frontend
2. Check backend console for "Contact message saved successfully"
3. Open admin panel and verify contact appears
4. Test status updates and deletion

