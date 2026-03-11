// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

// src/config/env.ts
import "dotenv/config";
import z from "zod";
var envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string().default("quickhire-access-secret-change-in-prod"),
  JWT_REFRESH_SECRET: z.string().default("quickhire-refresh-secret-change-in-prod"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  ADMIN_SECRET: z.string().default("quickhire-admin-secret"),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string()
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("\u274C Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}
var envVars = parsed.data;

// src/middlewares/globalErrorHandler.ts
import status from "http-status";
import { ZodError } from "zod";

// src/errors/AppError.ts
var AppError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
};
var AppError_default = AppError;

// src/errors/handleZodError.ts
var handleZodError = (err) => {
  const errorSources = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));
  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources
  };
};

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, _next) => {
  if (envVars.NODE_ENV === "development") {
    console.error("\u274C Global Error Handler:", err);
  }
  let statusCode = status.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources = [];
  let stack;
  if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources;
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  });
};

// src/middlewares/notFound.ts
import status2 from "http-status";
var notFound = (req, res) => {
  res.status(status2.NOT_FOUND).json({
    success: false,
    message: `Cannot find ${req.method} ${req.originalUrl}`,
    errorSources: [{ path: req.originalUrl, message: "Route not found" }]
  });
};

// src/routes/index.ts
import { Router as Router5 } from "express";

// src/modules/application/application.route.ts
import { Router } from "express";

// src/middlewares/checkAuth.ts
import status3 from "http-status";

// src/utils/cookie.ts
var CookieUtils = {
  getCookie: (req, name) => {
    return req.cookies?.[name];
  },
  setCookie: (res, name, value, maxAge) => {
    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge
    });
  },
  clearCookie: (res, name) => {
    res.clearCookie(name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
  }
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var jwtUtils = {
  generateToken: (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
  },
  verifyToken: (token, secret) => {
    try {
      const decoded = jwt.verify(token, secret);
      return { success: true, data: decoded };
    } catch {
      return { success: false };
    }
  }
};

// src/middlewares/checkAuth.ts
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized! No access token provided.");
    }
    const verified = jwtUtils.verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);
    if (!verified.success || !verified.data) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized! Invalid or expired access token.");
    }
    const { userId, role, email } = verified.data;
    if (authRoles.length > 0 && !authRoles.includes(role)) {
      throw new AppError_default(status3.FORBIDDEN, "Forbidden! You do not have permission to access this resource.");
    }
    req.user = { userId, role, email };
    next();
  } catch (error) {
    next(error);
  }
};

// src/middlewares/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, _res, next) => {
    try {
      const parsed2 = zodSchema.safeParse(req.body);
      if (!parsed2.success) {
        return next(parsed2.error);
      }
      req.body = parsed2.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/application/application.controller.ts
import status5 from "http-status";

// src/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/shared/sendResponse.ts
var sendResponse = (res, payload) => {
  res.status(payload.httpStatusCode).json({
    success: payload.success,
    message: payload.message,
    meta: payload.meta || void 0,
    data: payload.data || null
  });
};

// src/modules/application/application.service.ts
import status4 from "http-status";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
var adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
var prismaClientSingleton = () => new PrismaClient({ adapter });
var prisma = globalThis.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// src/modules/application/application.service.ts
var submitApplication = async (payload) => {
  const job = await prisma.jobPost.findUnique({ where: { id: payload.jobId, isDeleted: false } });
  if (!job) {
    throw new AppError_default(status4.NOT_FOUND, "Job not found or no longer available.");
  }
  if (job.deadline && /* @__PURE__ */ new Date() > job.deadline) {
    throw new AppError_default(status4.BAD_REQUEST, "Application deadline has passed.");
  }
  const existing = await prisma.application.findFirst({
    where: { jobId: payload.jobId, applicantId: payload.applicantId }
  });
  if (existing) {
    throw new AppError_default(status4.CONFLICT, "You have already applied for this job.");
  }
  const application = await prisma.application.create({
    data: payload,
    include: { job: { select: { title: true, company: true } } }
  });
  return application;
};
var getMyApplications = async (userId) => {
  const applications = await prisma.application.findMany({
    where: { applicantId: userId },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          companyLogo: true,
          location: true,
          type: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return applications;
};
var getAllApplications = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      include: { job: { select: { id: true, title: true, company: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.application.count()
  ]);
  return {
    data: applications,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getApplicationsByJobId = async (jobId) => {
  const job = await prisma.jobPost.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError_default(status4.NOT_FOUND, "Job not found.");
  }
  const applications = await prisma.application.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" }
  });
  return applications;
};
var updateApplicationStatus = async (id, appStatus) => {
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) {
    throw new AppError_default(status4.NOT_FOUND, "Application not found.");
  }
  const updated = await prisma.application.update({
    where: { id },
    data: { status: appStatus }
  });
  return updated;
};
var ApplicationService = {
  submitApplication,
  getMyApplications,
  getAllApplications,
  getApplicationsByJobId,
  updateApplicationStatus
};

// src/modules/application/application.controller.ts
var submitApplication2 = catchAsync(async (req, res) => {
  const applicantId = req.user.userId;
  const result = await ApplicationService.submitApplication({ ...req.body, applicantId });
  sendResponse(res, {
    httpStatusCode: status5.CREATED,
    success: true,
    message: "Application submitted successfully!",
    data: result
  });
});
var getMyApplications2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ApplicationService.getMyApplications(userId);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Your applications fetched successfully",
    data: result
  });
});
var getAllApplications2 = catchAsync(async (req, res) => {
  const page = parseInt(req.query["page"]) || 1;
  const limit = parseInt(req.query["limit"]) || 10;
  const result = await ApplicationService.getAllApplications(page, limit);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Applications fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getApplicationsByJobId2 = catchAsync(async (req, res) => {
  const jobId = req.params["jobId"];
  const result = await ApplicationService.getApplicationsByJobId(jobId);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Applications fetched successfully",
    data: result
  });
});
var updateApplicationStatus2 = catchAsync(async (req, res) => {
  const id = req.params["id"];
  const appStatus = req.body.status;
  const result = await ApplicationService.updateApplicationStatus(id, appStatus);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Application status updated successfully",
    data: result
  });
});
var ApplicationController = {
  submitApplication: submitApplication2,
  getMyApplications: getMyApplications2,
  getAllApplications: getAllApplications2,
  getApplicationsByJobId: getApplicationsByJobId2,
  updateApplicationStatus: updateApplicationStatus2
};

// src/modules/application/application.validation.ts
import z2 from "zod";
var createApplicationZodSchema = z2.object({
  applicantName: z2.string().min(1, "Name is required"),
  applicantEmail: z2.string().email("Invalid email address"),
  resumeUrl: z2.string().url("Invalid URL").optional().or(z2.literal("")),
  coverNote: z2.string().optional(),
  jobId: z2.string().min(1, "Job ID is required")
});
var updateApplicationStatusZodSchema = z2.object({
  status: z2.enum(["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED"])
});

// src/modules/application/application.route.ts
var router = Router();
router.post("/", checkAuth("JOB_SEEKER", "ADMIN"), validateRequest(createApplicationZodSchema), ApplicationController.submitApplication);
router.get("/my-applications", checkAuth("JOB_SEEKER", "ADMIN"), ApplicationController.getMyApplications);
router.get("/", checkAuth("ADMIN"), ApplicationController.getAllApplications);
router.get("/job/:jobId", checkAuth("ADMIN"), ApplicationController.getApplicationsByJobId);
router.patch("/:id/status", checkAuth("ADMIN"), validateRequest(updateApplicationStatusZodSchema), ApplicationController.updateApplicationStatus);
var ApplicationRoutes = router;

// src/modules/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/modules/auth/auth.controller.ts
import status7 from "http-status";

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import status6 from "http-status";
var register = async (payload) => {
  const { name, email, password, role, adminSecret } = payload;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError_default(status6.CONFLICT, "Email already registered.");
  }
  let assignedRole = "JOB_SEEKER";
  if (role === "ADMIN") {
    if (adminSecret !== envVars.ADMIN_SECRET) {
      throw new AppError_default(status6.FORBIDDEN, "Invalid admin secret key.");
    }
    assignedRole = "ADMIN";
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: assignedRole
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
  return user;
};
var login = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: { email, isDeleted: false }
  });
  if (!user) {
    throw new AppError_default(status6.UNAUTHORIZED, "Invalid email or password.");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new AppError_default(status6.UNAUTHORIZED, "Invalid email or password.");
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
    createdAt: user.createdAt
  };
  return { accessToken, refreshToken, user: userWithoutPassword };
};
var getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
  if (!user) {
    throw new AppError_default(status6.NOT_FOUND, "User not found.");
  }
  return user;
};
var AuthService = {
  register,
  login,
  getMe
};

// src/modules/auth/auth.controller.ts
var register2 = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);
  sendResponse(res, {
    httpStatusCode: status7.CREATED,
    success: true,
    message: "Registration successful!",
    data: result
  });
});
var login2 = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, user } = await AuthService.login(req.body);
  CookieUtils.setCookie(res, "accessToken", accessToken, 15 * 60 * 1e3);
  CookieUtils.setCookie(res, "refreshToken", refreshToken, 30 * 24 * 60 * 60 * 1e3);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Login successful!",
    data: user
  });
});
var logout = catchAsync(async (_req, res) => {
  CookieUtils.clearCookie(res, "accessToken");
  CookieUtils.clearCookie(res, "refreshToken");
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Logout successful!"
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await AuthService.getMe(userId);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result
  });
});
var AuthController = {
  register: register2,
  login: login2,
  logout,
  getMe: getMe2
};

// src/modules/auth/auth.validation.ts
import z3 from "zod";
var registerZodSchema = z3.object({
  name: z3.string().min(2, "Name must be at least 2 characters"),
  email: z3.string().email("Invalid email address"),
  password: z3.string().min(6, "Password must be at least 6 characters"),
  role: z3.enum(["ADMIN", "JOB_SEEKER"]).optional(),
  adminSecret: z3.string().optional()
});
var loginZodSchema = z3.object({
  email: z3.string().email("Invalid email address"),
  password: z3.string().min(1, "Password is required")
});

// src/modules/auth/auth.route.ts
var router2 = Router2();
router2.post("/register", validateRequest(registerZodSchema), AuthController.register);
router2.post("/login", validateRequest(loginZodSchema), AuthController.login);
router2.post("/logout", AuthController.logout);
router2.get("/me", checkAuth("ADMIN", "JOB_SEEKER"), AuthController.getMe);
var AuthRoutes = router2;

// src/modules/category/category.route.ts
import { Router as Router3 } from "express";

// src/modules/category/category.controller.ts
import status9 from "http-status";

// src/modules/category/category.service.ts
import status8 from "http-status";
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { jobPosts: { where: { isDeleted: false } } } }
    }
  });
  return categories;
};
var createCategory = async (payload) => {
  const existing = await prisma.category.findUnique({ where: { slug: payload.slug } });
  if (existing) {
    throw new AppError_default(status8.CONFLICT, "Category with this slug already exists.");
  }
  const category = await prisma.category.create({ data: payload });
  return category;
};
var deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError_default(status8.NOT_FOUND, "Category not found.");
  }
  await prisma.category.delete({ where: { id } });
  return { message: "Category deleted successfully" };
};
var CategoryService = {
  getAllCategories,
  createCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var getAllCategories2 = catchAsync(async (_req, res) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result
  });
});
var createCategory2 = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, {
    httpStatusCode: status9.CREATED,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var deleteCategory2 = catchAsync(async (req, res) => {
  const id = req.params["id"];
  const result = await CategoryService.deleteCategory(id);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Category deleted successfully",
    data: result
  });
});
var CategoryController = {
  getAllCategories: getAllCategories2,
  createCategory: createCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.validation.ts
import z4 from "zod";
var createCategoryZodSchema = z4.object({
  name: z4.string().min(1, "Category name is required"),
  slug: z4.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  icon: z4.string().optional()
});

// src/modules/category/category.route.ts
var router3 = Router3();
router3.get("/", CategoryController.getAllCategories);
router3.post("/", checkAuth("ADMIN"), validateRequest(createCategoryZodSchema), CategoryController.createCategory);
router3.delete("/:id", checkAuth("ADMIN"), CategoryController.deleteCategory);
var CategoryRoutes = router3;

// src/modules/job/job.route.ts
import { Router as Router4 } from "express";

// src/modules/job/job.controller.ts
import status11 from "http-status";

// src/modules/job/job.service.ts
import status10 from "http-status";
var jobInclude = {
  category: true,
  postedBy: {
    select: { id: true, name: true, email: true }
  },
  _count: { select: { applications: true } }
};
var getAllJobs = async (query) => {
  const { search, category, location, type, isFeatured, page = "1", limit = "9", sortBy = "createdAt", sortOrder = "desc" } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const whereConditions = { isDeleted: false };
  if (search) {
    whereConditions.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } }
    ];
  }
  if (category) whereConditions.category = { slug: category };
  if (location) whereConditions.location = { contains: location, mode: "insensitive" };
  if (type) whereConditions.type = type;
  if (isFeatured === "true") whereConditions.isFeatured = true;
  if (isFeatured === "false") whereConditions.isFeatured = false;
  const [jobs, total] = await Promise.all([
    prisma.jobPost.findMany({
      where: whereConditions,
      include: jobInclude,
      skip,
      take: limitNum,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.jobPost.count({ where: whereConditions })
  ]);
  return {
    data: jobs,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};
var getJobById = async (id) => {
  const job = await prisma.jobPost.findUnique({
    where: { id, isDeleted: false },
    include: {
      ...jobInclude,
      applications: {
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!job) {
    throw new AppError_default(status10.NOT_FOUND, "Job not found.");
  }
  return job;
};
var createJob = async (payload, postedById) => {
  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) {
    throw new AppError_default(status10.NOT_FOUND, "Category not found.");
  }
  const job = await prisma.jobPost.create({
    data: {
      ...payload,
      deadline: payload.deadline ? new Date(payload.deadline) : void 0,
      postedById
    },
    include: jobInclude
  });
  return job;
};
var updateJob = async (id, payload) => {
  const existing = await prisma.jobPost.findUnique({ where: { id, isDeleted: false } });
  if (!existing) {
    throw new AppError_default(status10.NOT_FOUND, "Job not found.");
  }
  const job = await prisma.jobPost.update({
    where: { id },
    data: {
      ...payload,
      deadline: payload.deadline ? new Date(payload.deadline) : void 0
    },
    include: jobInclude
  });
  return job;
};
var deleteJob = async (id) => {
  const existing = await prisma.jobPost.findUnique({ where: { id, isDeleted: false } });
  if (!existing) {
    throw new AppError_default(status10.NOT_FOUND, "Job not found.");
  }
  await prisma.jobPost.update({
    where: { id },
    data: { isDeleted: true }
  });
  return { message: "Job deleted successfully" };
};
var JobService = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};

// src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET
});

// src/modules/job/job.controller.ts
var getAllJobs2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await JobService.getAllJobs(query);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Jobs fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getJobById2 = catchAsync(async (req, res) => {
  const id = req.params["id"];
  const result = await JobService.getJobById(id);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Job fetched successfully",
    data: result
  });
});
var createJob2 = catchAsync(async (req, res) => {
  const postedById = req.user.userId;
  const payload = req.body;
  if (req.file) {
    payload.companyLogo = req.file.path;
  }
  try {
    const result = await JobService.createJob(payload, postedById);
    sendResponse(res, {
      httpStatusCode: status11.CREATED,
      success: true,
      message: "Job created successfully",
      data: result
    });
  } catch (error) {
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    throw error;
  }
});
var updateJob2 = catchAsync(async (req, res) => {
  const id = req.params["id"];
  const payload = req.body;
  if (req.file) {
    payload.companyLogo = req.file.path;
  }
  try {
    const result = await JobService.updateJob(id, payload);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Job updated successfully",
      data: result
    });
  } catch (error) {
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    throw error;
  }
});
var deleteJob2 = catchAsync(async (req, res) => {
  const id = req.params["id"];
  const result = await JobService.deleteJob(id);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Job deleted successfully",
    data: result
  });
});
var JobController = {
  getAllJobs: getAllJobs2,
  getJobById: getJobById2,
  createJob: createJob2,
  updateJob: updateJob2,
  deleteJob: deleteJob2
};

// src/modules/job/job.validation.ts
import z5 from "zod";
var createJobZodSchema = z5.object({
  title: z5.string().min(1, "Job title is required"),
  company: z5.string().min(1, "Company name is required"),
  companyLogo: z5.string().url().optional().or(z5.literal("")),
  location: z5.string().min(1, "Location is required"),
  type: z5.enum(["FULL_TIME", "PART_TIME", "REMOTE", "INTERNSHIP", "CONTRACT"]).optional(),
  salary: z5.string().optional(),
  description: z5.string().min(10, "Description must be at least 10 characters"),
  requirements: z5.string().optional(),
  tags: z5.array(z5.string()).optional(),
  isFeatured: z5.boolean().optional(),
  deadline: z5.string().optional(),
  categoryId: z5.string().min(1, "Category is required")
});
var updateJobZodSchema = createJobZodSchema.partial();

// src/middlewares/upload.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
var storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "quickhire",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});
var upload = multer({ storage });

// src/modules/job/job.route.ts
var router4 = Router4();
router4.get("/", JobController.getAllJobs);
router4.get("/:id", JobController.getJobById);
router4.post(
  "/",
  checkAuth("ADMIN"),
  upload.single("companyLogo"),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(createJobZodSchema),
  JobController.createJob
);
router4.patch(
  "/:id",
  checkAuth("ADMIN"),
  upload.single("companyLogo"),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(updateJobZodSchema),
  JobController.updateJob
);
router4.delete("/:id", checkAuth("ADMIN"), JobController.deleteJob);
var JobRoutes = router4;

// src/routes/index.ts
var router5 = Router5();
router5.use("/auth", AuthRoutes);
router5.use("/categories", CategoryRoutes);
router5.use("/jobs", JobRoutes);
router5.use("/applications", ApplicationRoutes);
var IndexRoutes = router5;

// src/app.ts
import morgan from "morgan";
var app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/v1", IndexRoutes);
app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "\u{1F680} QuickHire API is running!" });
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
