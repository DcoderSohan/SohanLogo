import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sohanlogo.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
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
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
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

