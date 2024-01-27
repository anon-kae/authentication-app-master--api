import { UUID } from 'crypto';
import services from '@/abstracts/Service';
import { UserWithRolesResponse } from '@/interfaces/repositories/IUserRepository';


export interface UserResponse {
  id: UUID;
  name: string;
  bio: string;
  phone: string;
  email: string;
  avatar: string;
  roles: string[];
}

/**
 * @interface IUserService
 */
export interface IUserService extends services {
  getUserWithRolesInfoByUserId(
    userId: UUID,
  ): Promise<UserWithRolesResponse | null>;
  getUserInfoById(userId: UUID): Promise<UserResponse | null>;
  createUser(
    user: {
      name: string,
      bio: string,
      phone: string,
      email: string,
      password: string,
    }
  ): Promise<{ message: string }>;
}
