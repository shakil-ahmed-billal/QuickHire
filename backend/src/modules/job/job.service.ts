import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { ICreateJobPayload, IJobQueryParams } from './job.interface';

type JobType = 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'INTERNSHIP' | 'CONTRACT';

const jobInclude = {
  category: true,
  postedBy: {
    select: { id: true, name: true, email: true },
  },
  _count: { select: { applications: true } },
};

const getAllJobs = async (query: IJobQueryParams) => {
  const { search, category, location, type, isFeatured, page = '1', limit = '9', sortBy = 'createdAt', sortOrder = 'desc' } = query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const whereConditions: {
    isDeleted: boolean;
    OR?: { title?: { contains: string; mode: 'insensitive' }; company?: { contains: string; mode: 'insensitive' }; location?: { contains: string; mode: 'insensitive' } }[];
    category?: { slug: string };
    location?: { contains: string; mode: 'insensitive' };
    type?: JobType;
    isFeatured?: boolean;
  } = { isDeleted: false };

  if (search) {
    whereConditions.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) whereConditions.category = { slug: category };
  if (location) whereConditions.location = { contains: location, mode: 'insensitive' };
  if (type) whereConditions.type = type as JobType;
  if (isFeatured === 'true') whereConditions.isFeatured = true;
  if (isFeatured === 'false') whereConditions.isFeatured = false;

  const [jobs, total] = await Promise.all([
    prisma.jobPost.findMany({
      where: whereConditions,
      include: jobInclude,
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.jobPost.count({ where: whereConditions }),
  ]);

  return {
    data: jobs,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getJobById = async (id: string) => {
  const job = await prisma.jobPost.findUnique({
    where: { id, isDeleted: false },
    include: {
      ...jobInclude,
      applications: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!job) {
    throw new AppError(status.NOT_FOUND, 'Job not found.');
  }

  return job;
};

const createJob = async (payload: ICreateJobPayload, postedById: string) => {
  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) {
    throw new AppError(status.NOT_FOUND, 'Category not found.');
  }

  const job = await prisma.jobPost.create({
    data: {
      ...payload,
      deadline: payload.deadline ? new Date(payload.deadline) : undefined,
      postedById,
    },
    include: jobInclude,
  });

  return job;
};

const updateJob = async (id: string, payload: Partial<ICreateJobPayload>) => {
  const existing = await prisma.jobPost.findUnique({ where: { id, isDeleted: false } });
  if (!existing) {
    throw new AppError(status.NOT_FOUND, 'Job not found.');
  }

  const job = await prisma.jobPost.update({
    where: { id },
    data: {
      ...payload,
      deadline: payload.deadline ? new Date(payload.deadline) : undefined,
    },
    include: jobInclude,
  });

  return job;
};

const deleteJob = async (id: string) => {
  const existing = await prisma.jobPost.findUnique({ where: { id, isDeleted: false } });
  if (!existing) {
    throw new AppError(status.NOT_FOUND, 'Job not found.');
  }

  await prisma.jobPost.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: 'Job deleted successfully' };
};

export const JobService = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
