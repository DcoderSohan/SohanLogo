import HomePage from '../models/HomePage.js';

// Helper: ensure there is always a single home document
const getOrCreateHome = async () => {
  let doc = await HomePage.findOne();
  if (!doc) {
    doc = await HomePage.create({});
  }
  return doc;
};

// Public: Get home page content for frontend
export const getHomePublic = async (req, res) => {
  try {
    const doc = await getOrCreateHome();

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error('Error fetching home content (public):', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching home page content',
      error: error.message,
    });
  }
};

// Admin: Get home page content (same as public for now, but kept separate for future admin-specific data)
export const getHomeAdmin = async (req, res) => {
  try {
    const doc = await getOrCreateHome();

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error('Error fetching home content (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching home page content for admin',
      error: error.message,
    });
  }
};

// Admin: Update or create the single home page document
export const upsertHome = async (req, res) => {
  try {
    const payload = req.body || {};

    const updated = await HomePage.findOneAndUpdate(
      {},
      payload,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Home page content saved successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating home content:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving home page content',
      error: error.message,
    });
  }
};


