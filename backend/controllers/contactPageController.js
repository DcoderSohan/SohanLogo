import ContactPage from '../models/ContactPage.js';

// Helper: ensure there is always a single contact page document
const getOrCreateContactPage = async () => {
  return await ContactPage.getSingleton();
};

// Public: Get contact page content for frontend
export const getContactPagePublic = async (req, res) => {
  try {
    const doc = await getOrCreateContactPage();

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error('Error fetching contact page content (public):', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact page content',
      error: error.message,
    });
  }
};

// Admin: Get contact page content
export const getContactPageAdmin = async (req, res) => {
  try {
    const doc = await getOrCreateContactPage();

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error('Error fetching contact page content (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact page content for admin',
      error: error.message,
    });
  }
};

// Admin: Update or create the single contact page document
export const upsertContactPage = async (req, res) => {
  try {
    const { settings, formFields } = req.body;

    // Validate required fields
    if (!settings || !settings.title || !settings.subtitle) {
      return res.status(400).json({
        success: false,
        message: 'Settings section requires title and subtitle',
      });
    }

    // Validate map location
    if (settings.mapLocation) {
      if (typeof settings.mapLocation.latitude !== 'number' || typeof settings.mapLocation.longitude !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Map location requires valid latitude and longitude numbers',
        });
      }
      if (settings.mapLocation.latitude < -90 || settings.mapLocation.latitude > 90) {
        return res.status(400).json({
          success: false,
          message: 'Latitude must be between -90 and 90',
        });
      }
      if (settings.mapLocation.longitude < -180 || settings.mapLocation.longitude > 180) {
        return res.status(400).json({
          success: false,
          message: 'Longitude must be between -180 and 180',
        });
      }
    }

    // Validate form fields
    if (formFields && Array.isArray(formFields)) {
      // Ensure unique field names
      const fieldNames = formFields.map(f => f.name);
      const uniqueNames = new Set(fieldNames);
      if (fieldNames.length !== uniqueNames.size) {
        return res.status(400).json({
          success: false,
          message: 'Form fields must have unique names',
        });
      }
    }

    // Get or create the document
    let doc = await ContactPage.findOne();

    if (doc) {
      // Update existing document
      doc.settings = settings || doc.settings;
      doc.formFields = formFields || doc.formFields;
      await doc.save();
    } else {
      // Create new document
      doc = await ContactPage.create({
        settings: settings || {},
        formFields: formFields || [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact page content saved successfully',
      data: doc,
    });
  } catch (error) {
    console.error('Error saving contact page content:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving contact page content',
      error: error.message,
    });
  }
};

