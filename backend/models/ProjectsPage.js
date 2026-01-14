import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Featured Projects', trim: true },
    subtitle: { type: String, default: 'Explore my latest work and creative solutions', trim: true },
    backgroundImageMobile: { type: String, default: '' },
    backgroundImageDesktop: { type: String, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    description: { type: String, required: true, trim: true },
    liveUrl: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false },
  },
  { _id: true, timestamps: false }
);

const projectDetailSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, trim: true },
    images: [{ type: String, trim: true }],
    longDescription: { type: String, default: '', trim: true },
    features: [{ type: String, trim: true }],
    githubUrl: { type: String, default: '', trim: true },
  },
  { _id: true, timestamps: false }
);

const projectsPageSchema = new mongoose.Schema(
  {
    settings: { type: settingsSchema, default: () => ({}) },
    projects: [projectSchema],
    projectDetails: [projectDetailSchema],
  },
  { timestamps: true }
);

// Ensure only one document exists
projectsPageSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      settings: {
        title: 'Featured Projects',
        subtitle: 'Explore my latest work and creative solutions',
        backgroundImageMobile: '',
        backgroundImageDesktop: '',
      },
      projects: [],
      projectDetails: [],
    });
  }
  return doc;
};

const ProjectsPage = mongoose.model('ProjectsPage', projectsPageSchema);

export default ProjectsPage;

