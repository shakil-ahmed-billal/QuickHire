import bcrypt from 'bcrypt';
import status from 'http-status';
import { envVars } from '../../config/env';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { jwtUtils } from '../../utils/jwt';
import { ILoginPayload, IRegisterPayload } from './auth.interface';

const register = async (payload: IRegisterPayload) => {
  const { name, email, password, role, adminSecret } = payload;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(status.CONFLICT, 'Email already registered.');
  }

  // Admin role requires secret
  let assignedRole: 'ADMIN' | 'JOB_SEEKER' = 'JOB_SEEKER';
  if (role === 'ADMIN') {
    if (adminSecret !== envVars.ADMIN_SECRET) {
      throw new AppError(status.FORBIDDEN, 'Invalid admin secret key.');
    }
    assignedRole = 'ADMIN';
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: assignedRole,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email, isDeleted: false },
  });

  if (!user) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid email or password.');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid email or password.');
  }

  const tokenPayload = { userId: user.id, role: user.role, email: user.email };

  const accessToken = jwtUtils.generateToken(
    tokenPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES_IN
  );

  const refreshToken = jwtUtils.generateToken(
    tokenPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN
  );

  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  return { accessToken, refreshToken, user: userWithoutPassword };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found.');
  }

  return user;
};

export const AuthService = {
  register,
  login,
  getMe,
};
