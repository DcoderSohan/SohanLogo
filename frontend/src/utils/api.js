import axios from 'axios';

// Create axios instance with base configuration
// If VITE_API_URL is not set, use relative URL for Vercel proxy
// Otherwise use the provided URL or fallback to Render backend
const getBaseURL = () => {
  // Always use environment variable if set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // If no env var, check if we're on Vercel (has vercel.json proxy)
  // Use relative URL to leverage Vercel's API proxy
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return '/api';
  }
  
  // Fallback to Render backend (works for both local dev and production)
  return 'https://sohanlogo.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds (increased for slower connections)
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors with better messaging
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network Error: Unable to reach the server. Please check your internet connection and ensure the backend is running.');
      // Provide more helpful error message
      error.message = 'Network Error: Unable to connect to the server. Please try again later.';
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Contact API methods
export const contactAPI = {
  // Create a new contact message
  createContact: async (contactData) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },

  // Get all contacts (with optional filters)
  getAllContacts: async (params = {}) => {
    const response = await api.get('/contacts', { params });
    return response.data;
  },

  // Get contact statistics
  getContactStats: async () => {
    const response = await api.get('/contacts/stats');
    return response.data;
  },

  // Get a single contact by ID
  getContactById: async (id) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  // Update contact status
  updateContactStatus: async (id, status, adminNotes) => {
    const response = await api.patch(`/contacts/${id}`, { status, adminNotes });
    return response.data;
  },

  // Delete a contact
  deleteContact: async (id) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },
};

// Home page content API methods
export const homeAPI = {
  // Public fetch of home page content (with cache busting)
  getHome: async () => {
    const response = await api.get('/home', {
      params: {
        _t: Date.now(), // Cache busting timestamp
      },
    });
    return response.data;
  },
};

// About page content API methods
export const aboutAPI = {
  // Public fetch of about page content (with cache busting)
  getAbout: async () => {
    const response = await api.get('/about', {
      params: {
        _t: Date.now(), // Cache busting timestamp
      },
    });
    return response.data;
  },
};

// Projects page content API methods
export const projectsAPI = {
  // Public fetch of projects page content (with cache busting)
  getProjects: async () => {
    const response = await api.get('/projects', {
      params: {
        _t: Date.now(), // Cache busting timestamp
      },
    });
    return response.data;
  },
};

// Contact page content API methods
export const contactPageAPI = {
  // Public fetch of contact page content (with cache busting)
  getContactPage: async () => {
    const response = await api.get('/contact-page', {
      params: {
        _t: Date.now(), // Cache busting timestamp
      },
    });
    return response.data;
  },
};

export default api;

