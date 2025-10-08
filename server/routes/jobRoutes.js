import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  updateApplicationStatus
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('employer', 'admin'), createJob);

router.get('/:id', getJobById);
router.post('/:id/apply', protect, authorize('worker'), applyForJob);
router.put('/:id/applicants/:applicantId', protect, authorize('employer'), updateApplicationStatus);

export default router;
