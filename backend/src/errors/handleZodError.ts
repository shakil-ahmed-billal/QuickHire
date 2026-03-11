import { ZodError } from 'zod';

export const handleZodError = (err: ZodError) => {
  const errorSources = err.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources,
  };
};
