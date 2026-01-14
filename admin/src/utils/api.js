import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and 401 unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    
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
  // Get home content for admin (includes all editable fields)
  getHomeForAdmin: async () => {
    const response = await api.get('/home/admin');
    return response.data;
  },

  // Save full home content object from admin panel
  saveHome: async (homeData) => {
    const response = await api.put('/home/admin', homeData);
    return response.data;
  },

  // Public fetch (same as frontend usage, exposed here for convenience)
  getHomePublic: async () => {
    const response = await api.get('/home');
    return response.data;
  },
};

// About page content API methods
export const aboutAPI = {
  // Get about content for admin (includes all editable fields)
  getAboutForAdmin: async () => {
    const response = await api.get('/about/admin');
    return response.data;
  },

  // Save full about content object from admin panel
  saveAbout: async (aboutData) => {
    const response = await api.put('/about/admin', aboutData);
    return response.data;
  },

  // Public fetch (same as frontend usage, exposed here for convenience)
  getAboutPublic: async () => {
    const response = await api.get('/about');
    return response.data;
  },
};

// Projects page content API methods
export const projectsAPI = {
  // Get projects content for admin (includes all editable fields)
  getProjectsForAdmin: async () => {
    const response = await api.get('/projects/admin');
    return response.data;
  },

  // Save full projects content object from admin panel
  saveProjects: async (projectsData) => {
    const response = await api.put('/projects/admin', projectsData);
    return response.data;
  },

  // Public fetch (same as frontend usage, exposed here for convenience)
  getProjectsPublic: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
};

// Contact page content API methods
export const contactPageAPI = {
  // Get contact page content for admin (includes all editable fields)
  getContactPageForAdmin: async () => {
    const response = await api.get('/contact-page/admin');
    return response.data;
  },

  // Save full contact page content object from admin panel
  saveContactPage: async (contactPageData) => {
    const response = await api.put('/contact-page/admin', contactPageData);
    return response.data;
  },

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

// Upload API methods
export const uploadAPI = {
  // Upload single image to Cloudinary
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images to Cloudinary
  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Auth API methods
export const authAPI = {
  // Sign up
  signup: async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },
};

export default api;

