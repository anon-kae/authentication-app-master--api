import { UUID } from 'crypto';
import IUserModel from '../models/IUserModel';

export type UserWithRolesResponse = Partial<IUserModel>;

/**
 * @interface IUserRepository
 */
export interface IUserRepository {
  findUserWithRolesById(userId: UUID): Promise<UserWithRolesResponse | null>;
  findUserByEmail(email: string): Promise<IUserModel | null>;
  findUserById(userId: UUID): Promise<IUserModel | null>;
  createUser(user: {
    name: string;
    bio: string;
    phone: string;
    email: string;
    password: string;
  }): Promise<{ id: UUID }>;
}
