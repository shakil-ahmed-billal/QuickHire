import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { CookieUtils } from '../../utils/cookie';
import { AuthService } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Registration successful!',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await AuthService.login(req.body);

  // 15 minutes in ms
  CookieUtils.setCookie(res, 'accessToken', accessToken, 15 * 60 * 1000);
  // 30 days in ms
  CookieUtils.setCookie(res, 'refreshToken', refreshToken, 30 * 24 * 60 * 60 * 1000);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Login successful!',
    data: user,
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  CookieUtils.clearCookie(res, 'accessToken');
  CookieUtils.clearCookie(res, 'refreshToken');

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Logout successful!',
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await AuthService.getMe(userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User profile fetched successfully',
    data: result,
  });
});

export const AuthController = {
  register,
  login,
  logout,
  getMe,
};
