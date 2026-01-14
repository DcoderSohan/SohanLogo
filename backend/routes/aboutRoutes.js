import express from 'express';
import { getAboutPublic, getAboutAdmin, upsertAbout } from '../controllers/aboutController.js';

const router = express.Router();

// Public endpoint to get about page content
router.get('/', getAboutPublic);

// Admin endpoints - in a real app you would protect these with auth middleware
router.get('/admin', getAboutAdmin);
router.put('/admin', upsertAbout);

export default router;

