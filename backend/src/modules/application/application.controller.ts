import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { ApplicationService } from './application.service';

const submitApplication = catchAsync(async (req: Request, res: Response) => {
  const applicantId = req.user!.userId;
  const result = await ApplicationService.submitApplication({ ...req.body, applicantId });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Application submitted successfully!',
    data: result,
  });
});

const getMyApplications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await ApplicationService.getMyApplications(userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Your applications fetched successfully',
    data: result,
  });
});

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = parseInt(req.query['limit'] as string) || 10;
  const result = await ApplicationService.getAllApplications(page, limit);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Applications fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getApplicationsByJobId = catchAsync(async (req: Request, res: Response) => {
  const jobId = req.params['jobId'] as string;
  const result = await ApplicationService.getApplicationsByJobId(jobId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Applications fetched successfully',
    data: result,
  });
});

const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const appStatus = req.body.status as 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';
  const result = await ApplicationService.updateApplicationStatus(id, appStatus);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Application status updated successfully',
    data: result,
  });
});

export const ApplicationController = {
  submitApplication,
  getMyApplications,
  getAllApplications,
  getApplicationsByJobId,
  updateApplicationStatus,
};
