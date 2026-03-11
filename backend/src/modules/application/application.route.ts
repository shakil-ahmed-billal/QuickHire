import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ApplicationController } from './application.controller';
import { createApplicationZodSchema, updateApplicationStatusZodSchema } from './application.validation';

const router = Router();

// Public - submit application (Changed to authenticated to track applicantId)
router.post('/', checkAuth('JOB_SEEKER', 'ADMIN'), validateRequest(createApplicationZodSchema), ApplicationController.submitApplication);

// User dashboard route
router.get('/my-applications', checkAuth('JOB_SEEKER', 'ADMIN'), ApplicationController.getMyApplications);

// Admin only routes
router.get('/', checkAuth('ADMIN'), ApplicationController.getAllApplications);
router.get('/job/:jobId', checkAuth('ADMIN'), ApplicationController.getApplicationsByJobId);
router.patch('/:id/status', checkAuth('ADMIN'), validateRequest(updateApplicationStatusZodSchema), ApplicationController.updateApplicationStatus);

export const ApplicationRoutes = router;
