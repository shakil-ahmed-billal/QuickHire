import status from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { ICreateApplicationPayload } from './application.interface';

const submitApplication = async (payload: ICreateApplicationPayload) => {
  const job = await prisma.jobPost.findUnique({ where: { id: payload.jobId, isDeleted: false } });
  if (!job) {
    throw new AppError(status.NOT_FOUND, 'Job not found or no longer available.');
  }

  // Check if deadline passed
  if (job.deadline && new Date() > job.deadline) {
    throw new AppError(status.BAD_REQUEST, 'Application deadline has passed.');
  }

  // Prevent duplicate application from same email
  const existing = await prisma.application.findFirst({
    where: { jobId: payload.jobId, applicantEmail: payload.applicantEmail },
  });
  if (existing) {
    throw new AppError(status.CONFLICT, 'You have already applied for this job.');
  }

  const application = await prisma.application.create({
    data: payload,
    include: { job: { select: { title: true, company: true } } },
  });

  return application;
};

const getAllApplications = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      include: { job: { select: { id: true, title: true, company: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.application.count(),
  ]);

  return {
    data: applications,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getApplicationsByJobId = async (jobId: string) => {
  const job = await prisma.jobPost.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError(status.NOT_FOUND, 'Job not found.');
  }

  const applications = await prisma.application.findMany({
    where: { jobId },
    orderBy: { createdAt: 'desc' },
  });

  return applications;
};

const updateApplicationStatus = async (id: string, appStatus: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED') => {
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) {
    throw new AppError(status.NOT_FOUND, 'Application not found.');
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status: appStatus },
  });

  return updated;
};

export const ApplicationService = {
  submitApplication,
  getAllApplications,
  getApplicationsByJobId,
  updateApplicationStatus,
};
