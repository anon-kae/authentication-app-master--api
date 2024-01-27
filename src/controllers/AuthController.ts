import { Request, Response, NextFunction } from 'express';
import * as services from '@/services';
import { LoginUseCase, RegisterUseCase } from '@/usecases/auth';
import { success } from '@/helpers/response';
import { RegisterRequest } from '@/interfaces/usecases/IRegisterUseCase';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body as { email: string, password: string }

    const useCase = new LoginUseCase(services);
    const request = await useCase.validate({ email, password });
    const result = await useCase.execute(request);

    success(res, { status: 'SUCCESS', result });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as RegisterRequest

    const useCase = new RegisterUseCase(services);
    const request = await useCase.validate(body);
    const result = await useCase.execute(request);

    success(res, { status: 'SUCCESS', result });
  } catch (error) {
    next(error);
  }
};
