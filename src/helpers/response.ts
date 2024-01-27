import { Response } from 'express';
import {
  IResponseSuccess,
  IResponseFailed,
} from '@/interfaces/common/IResponse';
import { OK } from 'http-status';

/**
 * Response Success
 * @param {Response} res the res of express
 * @param {IResponseSuccess} response the response failed
 * @return {Response} response
 */
export function success(
  res: Response,
  { status, result }: IResponseSuccess,
): Response {
  return res.status(OK).json({ status, result });
}

/**
 * Response Failed
 * @param {Response} res the res of express
 * @param {IResponseFailed} response the response failed
 * @param {Number} statusCode optional status code
 * @return {Response} response
 */
export function failed(
  res: Response,
  { status, result }: IResponseFailed,
  statusCode?: number,
): Response {
  return res.status(statusCode || OK).json({ status, result });
}
