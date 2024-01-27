import { Request, Response, NextFunction } from 'express';
import * as services from '@/services';
import { GetApiIdentityUseCase } from '@/usecases/root';
import { success } from '@/helpers/response';

export const getApiIdentity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const useCase = new GetApiIdentityUseCase(services);
    const request = await useCase.validate({});
    const result = await useCase.execute(request);

    success(res, { status: 'SUCCESS', result });
  } catch (error) {
    next(error);
  }
};
