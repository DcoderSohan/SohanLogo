import express from 'express';
import { getContactPagePublic, getContactPageAdmin, upsertContactPage } from '../controllers/contactPageController.js';

const router = express.Router();

router.get('/', getContactPagePublic);
router.get('/admin', getContactPageAdmin);
router.put('/admin', upsertContactPage);

export default router;

