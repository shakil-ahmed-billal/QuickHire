import { Router } from 'express';
import { ApplicationRoutes } from '../modules/application/application.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { JobRoutes } from '../modules/job/job.route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/categories', CategoryRoutes);
router.use('/jobs', JobRoutes);
router.use('/applications', ApplicationRoutes);

export const IndexRoutes = router;
