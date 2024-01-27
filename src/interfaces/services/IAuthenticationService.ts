import { UUID } from 'crypto';
import Service from '@/abstracts/Service';
import { UserResponse } from './IUserService';

export interface ITokenLifeTime {
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export interface IAuthenticationService extends Service {
  checkLogin(email: string, password: string): Promise<UserResponse | null>;
  createAuthToken(
    userId: UUID,
    { accessTokenExpiresIn, refreshTokenExpiresIn }: ITokenLifeTime
  ): Promise<{ accessToken: string; refreshToken: string; }>
}
