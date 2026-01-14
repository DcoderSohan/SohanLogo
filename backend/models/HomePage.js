import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    subtitleAlt: { type: String, required: true, trim: true },
    heroImageMobile: { type: String, default: '' },
    heroImageTablet: { type: String, default: '' },
    heroImageDesktop: { type: String, default: '' },
  },
  { _id: false }
);

const quoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
  },
  { _id: true, timestamps: false }
);

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: Number, required: true, min: 0 },
    plus: { type: Boolean, default: false },
  },
  { _id: true, timestamps: false }
);

const skillSettingsSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'My Skills', trim: true },
    subtitle: { type: String, default: 'Technologies I work with', trim: true },
    backgroundImageMobile: { type: String, default: '' },
    backgroundImageDesktop: { type: String, default: '' },
  },
  { _id: false }
);

const skillItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '' }, // Image URL or empty string
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

const gitgraphSchema = new mongoose.Schema(
  {
    userName: { type: String, default: 'DcoderSohan', trim: true },
  },
  { _id: false }
);

const homePageSchema = new mongoose.Schema(
  {
    hero: {
      type: heroSchema,
      required: true,
      default: () => ({
        name: 'Sohan Sarang',
        title: 'WEB',
        subtitle: 'DEVELOPER',
        subtitleAlt: 'DESIGNER',
        heroImageMobile: '',
        heroImageTablet: '',
        heroImageDesktop: '',
      }),
    },
    quotes: {
      type: [quoteSchema],
      default: () => [
        {
          text: `"Code is not just lines it's creativity in motion, logic in art, and passion in practice."`,
        },
      ],
    },
    stats: {
      type: [statSchema],
      default: () => [
        { label: 'Commits', value: 500, plus: true },
        { label: 'Projects', value: 10, plus: true },
        { label: 'Satisfied Customers', value: 2, plus: false },
      ],
    },
    skills: {
      settings: {
        type: skillSettingsSchema,
        default: () => ({
          title: 'My Skills',
          subtitle: 'Technologies I work with',
          backgroundImageMobile: '',
          backgroundImageDesktop: '',
        }),
      },
      items: {
        type: [skillItemSchema],
        default: () => [
          {
            name: 'React',
            icon: '⚛️',
            percent: 90,
            color: 'from-cyan-400 to-blue-500',
            height: 'tall',
          },
          {
            name: 'JavaScript',
            icon: '📜',
            percent: 85,
            color: 'from-yellow-300 to-yellow-500',
            height: 'short',
          },
          {
            name: 'HTML5',
            icon: '🌐',
            percent: 95,
            color: 'from-orange-400 to-pink-500',
            height: 'medium',
          },
          {
            name: 'CSS3',
            icon: '🎨',
            percent: 90,
            color: 'from-blue-400 to-indigo-500',
            height: 'tall',
          },
        ],
      },
    },
    gitgraph: {
      type: gitgraphSchema,
      default: () => ({
        userName: 'DcoderSohan',
      }),
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const HomePage = mongoose.model('HomePage', homePageSchema);

export default HomePage;


