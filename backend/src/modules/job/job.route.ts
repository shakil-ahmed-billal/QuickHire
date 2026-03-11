import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { JobController } from './job.controller';
import { createJobZodSchema, updateJobZodSchema } from './job.validation';

const router = Router();

router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getJobById);
router.post('/', checkAuth('ADMIN'), validateRequest(createJobZodSchema), JobController.createJob);
router.patch('/:id', checkAuth('ADMIN'), validateRequest(updateJobZodSchema), JobController.updateJob);
router.delete('/:id', checkAuth('ADMIN'), JobController.deleteJob);

export const JobRoutes = router;
