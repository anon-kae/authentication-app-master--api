import { UUID } from 'crypto';

export type GetCurrentAccountRequest = {
  userId: UUID;
};

export type GetCurrentAccountResponse = {
  id: UUID;
  name: string;
  bio: string;
  phone: string;
  email: string;
  avatar: string;
};

/**
 * @interface IGetCurrentAccountUseCase
 */
export default interface IGetCurrentAccountUseCase {
  validate(
    request: GetCurrentAccountRequest,
  ): Promise<GetCurrentAccountRequest>;
  execute(
    request: GetCurrentAccountRequest,
  ): Promise<GetCurrentAccountResponse>;
}
