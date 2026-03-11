import jwt from 'jsonwebtoken';

export const jwtUtils = {
  generateToken: (payload: object, secret: string, expiresIn: string): string => {
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  },

  verifyToken: (token: string, secret: string): { success: boolean; data?: jwt.JwtPayload } => {
    try {
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
      return { success: true, data: decoded };
    } catch {
      return { success: false };
    }
  },
};
