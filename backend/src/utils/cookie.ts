import { Request, Response } from 'express';

export const CookieUtils = {
  getCookie: (req: Request, name: string): string | undefined => {
    return req.cookies?.[name];
  },

  setCookie: (res: Response, name: string, value: string, maxAge: number) => {
    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
    });
  },

  clearCookie: (res: Response, name: string) => {
    res.clearCookie(name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  },
};
