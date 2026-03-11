import { TUserRole } from './middlewares/checkAuth';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: TUserRole;
        email: string;
      };
    }
  }
}
