import Contact from '../models/Contact.js';

// Create a new contact message
export const createContact = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    // Validation
    if (!name || !email || !mobile || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    // Mobile validation
    const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number',
      });
    }

    // Create and save contact
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      message: message.trim(),
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact message saved successfully. We will get back to you soon!',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving contact message',
      error: error.message,
    });
  }
};

// Get all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact messages',
      error: error.message,
    });
  }
};

// Get a single contact message
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact message',
      error: error.message,
    });
  }
};

// Update contact status
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updateData = {};
    if (status) {
      updateData.status = status;
    }
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact message',
      error: error.message,
    });
  }
};

// Delete a contact message
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact message',
      error: error.message,
    });
  }
};

// Get contact statistics
export const getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const newCount = await Contact.countDocuments({ status: 'new' });
    const readCount = await Contact.countDocuments({ status: 'read' });
    const repliedCount = await Contact.countDocuments({ status: 'replied' });
    const archivedCount = await Contact.countDocuments({ status: 'archived' });

    res.status(200).json({
      success: true,
      data: {
        total,
        new: newCount,
        read: readCount,
        replied: repliedCount,
        archived: archivedCount,
      },
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics',
      error: error.message,
    });
  }
};

