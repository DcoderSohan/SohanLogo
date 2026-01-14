import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
} from '../controllers/contactController.js';

const router = express.Router();

// Create a new contact message
router.post('/', createContact);

// Get all contact messages
router.get('/', getAllContacts);

// Get contact statistics
router.get('/stats', getContactStats);

// Get a single contact message
router.get('/:id', getContactById);

// Update contact status
router.patch('/:id', updateContactStatus);

// Delete a contact message
router.delete('/:id', deleteContact);

export default router;

