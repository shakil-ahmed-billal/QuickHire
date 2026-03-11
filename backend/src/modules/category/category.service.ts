import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { jobPosts: { where: { isDeleted: false } } } },
    },
  });
  return categories;
};

const createCategory = async (payload: { name: string; slug: string; icon?: string }) => {
  const existing = await prisma.category.findUnique({ where: { slug: payload.slug } });
  if (existing) {
    throw new AppError(status.CONFLICT, 'Category with this slug already exists.');
  }

  const category = await prisma.category.create({ data: payload });
  return category;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(status.NOT_FOUND, 'Category not found.');
  }

  await prisma.category.delete({ where: { id } });
  return { message: 'Category deleted successfully' };
};

export const CategoryService = {
  getAllCategories,
  createCategory,
  deleteCategory,
};
