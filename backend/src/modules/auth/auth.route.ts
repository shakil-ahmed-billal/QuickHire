import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { loginZodSchema, registerZodSchema } from './auth.validation';

const router = Router();

router.post('/register', validateRequest(registerZodSchema), AuthController.register);
router.post('/login', validateRequest(loginZodSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', checkAuth('ADMIN', 'JOB_SEEKER'), AuthController.getMe);

export const AuthRoutes = router;
