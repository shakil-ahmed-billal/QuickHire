/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { envVars } from '../config/env';
import AppError from '../errors/AppError';
import { CookieUtils } from '../utils/cookie';
import { jwtUtils } from '../utils/jwt';

export type TUserRole = 'ADMIN' | 'JOB_SEEKER';

export const checkAuth = (...authRoles: TUserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = CookieUtils.getCookie(req, 'accessToken');

      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized! No access token provided.');
      }

      const verified = jwtUtils.verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);

      if (!verified.success || !verified.data) {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized! Invalid or expired access token.');
      }

      const { userId, role, email } = verified.data as { userId: string; role: TUserRole; email: string };

      if (authRoles.length > 0 && !authRoles.includes(role)) {
        throw new AppError(status.FORBIDDEN, 'Forbidden! You do not have permission to access this resource.');
      }

      req.user = { userId, role, email };
      next();
    } catch (error: any) {
      next(error);
    }
  };
