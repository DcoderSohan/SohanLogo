import AboutPage from '../models/AboutPage.js';

// Helper: ensure there is always a single about document
const getOrCreateAbout = async () => {
  return await AboutPage.getSingleton();
};

// Public: Get about page content for frontend
export const getAboutPublic = async (req, res) => {
  try {
    const doc = await getOrCreateAbout();

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error('Error fetching about content (public):', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about page content',
      error: error.message,
    });
  }
};

// Admin: Get about page content
export const getAboutAdmin = async (req, res) => {
  try {
    const doc = await getOrCreateAbout();

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error('Error fetching about content (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about page content for admin',
      error: error.message,
    });
  }
};

// Admin: Update or create the single about page document
export const upsertAbout = async (req, res) => {
  try {
    const { intro, experiences, educations, skills } = req.body;

    // Validate required fields
    if (!intro || !intro.name || !intro.title || !intro.description) {
      return res.status(400).json({
        success: false,
        message: 'Intro section requires name, title, and description',
      });
    }

    // Get or create the document
    let doc = await AboutPage.findOne();
    
    if (doc) {
      // Update existing document
      doc.intro = intro;
      doc.experiences = experiences || [];
      doc.educations = educations || [];
      if (skills) {
        doc.skills = skills;
      }
      await doc.save();
    } else {
      // Create new document
      doc = await AboutPage.create({
        intro,
        experiences: experiences || [],
        educations: educations || [],
        skills: skills || {
          settings: {
            title: 'My Skills',
            subtitle: 'Technologies I work with',
          },
          items: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'About page content saved successfully',
      data: doc,
    });
  } catch (error) {
    console.error('Error saving about content:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving about page content',
      error: error.message,
    });
  }
};

