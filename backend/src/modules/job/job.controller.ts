import { Request, Response } from 'express';
import status from 'http-status';
import { IJobQueryParams } from './job.interface';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { JobService } from './job.service';

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as IJobQueryParams;
  const result = await JobService.getAllJobs(query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Jobs fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getJobById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const result = await JobService.getJobById(id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Job fetched successfully',
    data: result,
  });
});

const createJob = catchAsync(async (req: Request, res: Response) => {
  const postedById = req.user!.userId;
  const result = await JobService.createJob(req.body, postedById);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Job created successfully',
    data: result,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const result = await JobService.updateJob(id, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Job updated successfully',
    data: result,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const result = await JobService.deleteJob(id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Job deleted successfully',
    data: result,
  });
});

export const JobController = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
