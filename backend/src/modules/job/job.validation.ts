import z from 'zod';

export const createJobZodSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  companyLogo: z.string().url().optional().or(z.literal('')),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'INTERNSHIP', 'CONTRACT']).optional(),
  salary: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
  deadline: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
});

export const updateJobZodSchema = createJobZodSchema.partial();
