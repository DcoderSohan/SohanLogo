import express from 'express';
import { getHomePublic, getHomeAdmin, upsertHome } from '../controllers/homeController.js';

const router = express.Router();

// Public endpoint to get home page content
router.get('/', getHomePublic);

// Admin endpoints - in a real app you would protect these with auth middleware
router.get('/admin', getHomeAdmin);
router.put('/admin', upsertHome);

export default router;


