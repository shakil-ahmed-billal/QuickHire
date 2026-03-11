import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const validateRequest = (zodSchema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = zodSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(parsed.error);
      }
      req.body = parsed.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};
