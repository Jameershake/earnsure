import express from 'express';
import { getWages, createWage } from '../controllers/wageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getWages)
  .post(protect, authorize('admin'), createWage);

export default router;
