import mongoose from 'mongoose';

const introSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    profileImage: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    scrollingSkills: [{ type: String, trim: true }],
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    achievements: [{ type: String, trim: true }],
  },
  { _id: true, timestamps: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    university: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: true, timestamps: false }
);

const skillItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    category: { type: String, default: 'Other', trim: true },
    percent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    color: {
      type: String,
      default: 'from-purple-400 to-blue-500',
      enum: [
        'from-cyan-400 to-blue-500',
        'from-purple-400 to-blue-500',
        'from-yellow-300 to-yellow-500',
        'from-orange-400 to-pink-500',
        'from-blue-400 to-indigo-500',
        'from-teal-300 to-cyan-500',
        'from-green-400 to-lime-500',
        'from-gray-400 to-gray-700',
        'from-green-400 to-emerald-600',
        'from-fuchsia-400 to-blue-600',
        'from-red-400 to-pink-500',
        'from-indigo-400 to-purple-500',
      ],
      trim: true,
    },
    height: {
      type: String,
      enum: ['short', 'medium', 'tall'],
      default: 'medium',
    },
  },
  { _id: true, timestamps: false }
);

const skillsSettingsSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'My Skills', trim: true },
    subtitle: { type: String, default: 'Technologies I work with', trim: true },
  },
  { _id: false }
);

const aboutPageSchema = new mongoose.Schema(
  {
    intro: { type: introSchema, required: true },
    experiences: [experienceSchema],
    educations: [educationSchema],
    skills: {
      settings: { type: skillsSettingsSchema, default: () => ({}) },
      items: [skillItemSchema],
    },
  },
  { timestamps: true }
);

// Ensure only one document exists
aboutPageSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      intro: {
        name: 'Sohan Sarang',
        title: 'Full-Stack Web Developer',
        description: "I'm a passionate full-stack web developer with a strong foundation in modern web technologies. I love creating beautiful, functional, and user-friendly web experiences. With expertise in React.js, Node.js, and various frontend/backend technologies, I bring ideas to life through code.",
        profileImage: '',
        tags: ['Available for Projects', 'Full-Stack Developer'],
        scrollingSkills: ['Analyze', 'Design', 'Develop', 'Testing', 'Deployment'],
      },
      experiences: [],
      educations: [],
      skills: {
        settings: {
          title: 'My Skills',
          subtitle: 'Technologies I work with',
        },
        items: [],
      },
    });
  }
  return doc;
};

const AboutPage = mongoose.model('AboutPage', aboutPageSchema);

export default AboutPage;

