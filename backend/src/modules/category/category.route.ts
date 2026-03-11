import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { createCategoryZodSchema } from './category.validation';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.post('/', checkAuth('ADMIN'), validateRequest(createCategoryZodSchema), CategoryController.createCategory);
router.delete('/:id', checkAuth('ADMIN'), CategoryController.deleteCategory);

export const CategoryRoutes = router;
