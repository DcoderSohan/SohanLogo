import express from 'express';
import { getProjectsPublic, getProjectsAdmin, upsertProjects } from '../controllers/projectsController.js';

const router = express.Router();

// Public endpoint to get projects page content
router.get('/', getProjectsPublic);

// Admin endpoints - in a real app you would protect these with auth middleware
router.get('/admin', getProjectsAdmin);
router.put('/admin', upsertProjects);

export default router;

