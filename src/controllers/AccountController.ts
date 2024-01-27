import { Request, Response, NextFunction } from 'express';
import * as services from '@/services';
import { GetCurrentAccountUseCase } from '@/usecases/user';
import { success } from '@/helpers/response';
import { UUID } from 'crypto';

export const getCurrentAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user as { id: UUID };

    const useCase = new GetCurrentAccountUseCase(services);
    const request = await useCase.validate({ userId });
    const result = await useCase.execute(request);

    success(res, { status: 'SUCCESS', result });
  } catch (error) {
    next(error);
  }
};
