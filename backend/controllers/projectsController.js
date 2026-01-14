import ProjectsPage from '../models/ProjectsPage.js';

// Helper: ensure there is always a single projects document
const getOrCreateProjects = async () => {
  return await ProjectsPage.getSingleton();
};

// Public: Get projects page content for frontend
export const getProjectsPublic = async (req, res) => {
  try {
    const doc = await getOrCreateProjects();

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error('Error fetching projects content (public):', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects page content',
      error: error.message,
    });
  }
};

// Admin: Get projects page content
export const getProjectsAdmin = async (req, res) => {
  try {
    const doc = await getOrCreateProjects();

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error('Error fetching projects content (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects page content for admin',
      error: error.message,
    });
  }
};

// Admin: Update or create the single projects page document
export const upsertProjects = async (req, res) => {
  try {
    const { settings, projects, projectDetails } = req.body;

    // Validate required fields
    if (!settings || !settings.title || !settings.subtitle) {
      return res.status(400).json({
        success: false,
        message: 'Settings section requires title and subtitle',
      });
    }

    // Ensure only one project is featured
    if (projects && Array.isArray(projects)) {
      const featuredCount = projects.filter(p => p.featured === true).length;
      if (featuredCount > 1) {
        // If multiple projects are featured, keep only the first one
        let foundFirst = false;
        projects.forEach(project => {
          if (project.featured && foundFirst) {
            project.featured = false;
          } else if (project.featured && !foundFirst) {
            foundFirst = true;
          }
        });
      }
    }

    // Get or create the document
    let doc = await ProjectsPage.findOne();
    
    if (doc) {
      // Update existing document
      doc.settings = settings;
      doc.projects = projects || [];
      doc.projectDetails = projectDetails || [];
      await doc.save();
    } else {
      // Create new document
      doc = await ProjectsPage.create({
        settings,
        projects: projects || [],
        projectDetails: projectDetails || [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Projects page content saved successfully',
      data: doc,
    });
  } catch (error) {
    console.error('Error saving projects content:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving projects page content',
      error: error.message,
    });
  }
};

