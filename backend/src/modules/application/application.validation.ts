import z from 'zod';

export const createApplicationZodSchema = z.object({
  applicantName: z.string().min(1, 'Name is required'),
  applicantEmail: z.string().email('Invalid email address'),
  resumeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  coverNote: z.string().optional(),
  jobId: z.string().min(1, 'Job ID is required'),
});

export const updateApplicationStatusZodSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED']),
});
