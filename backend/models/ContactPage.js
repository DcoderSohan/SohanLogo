import mongoose from 'mongoose';

const formFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Field name (e.g., "name", "email")
    label: { type: String, required: true, trim: true }, // Display label
    type: { 
      type: String, 
      enum: ['text', 'email', 'tel', 'textarea', 'number'],
      default: 'text',
    },
    placeholder: { type: String, default: '', trim: true },
    required: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true, timestamps: false }
);

const mapLocationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    zoom: { type: Number, default: 15, min: 1, max: 20 },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Get In Touch', trim: true },
    subtitle: { type: String, default: 'Feel free to reach out to me', trim: true },
    description: { type: String, default: '', trim: true },
    mapLocation: { type: mapLocationSchema, default: () => ({ latitude: 19.1896137, longitude: 73.0358554, zoom: 15 }) },
  },
  { _id: false }
);

const contactPageSchema = new mongoose.Schema(
  {
    settings: { type: settingsSchema, default: () => ({}) },
    formFields: [formFieldSchema],
  },
  { timestamps: true }
);

// Ensure only one document exists
contactPageSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      settings: {
        title: 'Get In Touch',
        subtitle: 'Feel free to reach out to me',
        description: '',
        mapLocation: {
          latitude: 19.1896137,
          longitude: 73.0358554,
          zoom: 15,
        },
      },
      formFields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Your Name',
          required: true,
          order: 1,
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'your.email@example.com',
          required: true,
          order: 2,
        },
        {
          name: 'mobile',
          label: 'Mobile',
          type: 'tel',
          placeholder: '+1234567890',
          required: true,
          order: 3,
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          placeholder: 'Your Message',
          required: true,
          order: 4,
        },
      ],
    });
  }
  return doc;
};

const ContactPage = mongoose.model('ContactPage', contactPageSchema);

export default ContactPage;

