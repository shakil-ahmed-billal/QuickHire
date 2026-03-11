import { Response } from 'express';

type TResponseMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type TSendResponse<T> = {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: TResponseMeta;
};

export const sendResponse = <T>(res: Response, payload: TSendResponse<T>) => {
  res.status(payload.httpStatusCode).json({
    success: payload.success,
    message: payload.message,
    meta: payload.meta || undefined,
    data: payload.data || null,
  });
};
