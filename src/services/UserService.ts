import Logger from '@/helpers/Logger';
import {
  IUserRepository,
  UserWithRolesResponse,
} from '@/interfaces/repositories/IUserRepository';
import { IUserService, UserResponse } from '@/interfaces/services/IUserService';
import { UUID } from 'crypto';
import services from '@/abstracts/Service';

/**
 * User Service
 */
export default class UserService extends services implements IUserService {
  private readonly UserRepository: IUserRepository;

  /**
   * Constructor
   * @param {Object.<string, string>|null} repositories Repositories
   */
  constructor({
    UserRepository,
  }: {
    UserRepository: new () => IUserRepository;
  }) {
    super();
    this.UserRepository = new UserRepository();
  }

  /**
   * Get user with roles info by user id
   * @param {UUID} userId - used for find user by id
   * @return {Promise<UserWithRolesResponse|null>} - returns user with roles info
   */
  public async getUserWithRolesInfoByUserId(
    userId: UUID,
  ): Promise<UserWithRolesResponse | null> {
    const user = await this.UserRepository.findUserWithRolesById(userId);

    if (!user) {
      Logger.warning(`Failed to find user by id=${userId}: User not found`, {
        userId,
      });

      return null;
    }

    return user;
  }

  /**
   * Get user info by user id
   * @param {UUID} userId - used for find user by id
   * @return {Promise<UserResponse|null>} - returns user with roles info
   */
  public async getUserInfoById(
    userId: UUID,
  ): Promise<UserResponse | null> {
    const user = await this.UserRepository.findUserById(userId);

    if (!user) {
      Logger.warning(`Failed to find user by id=${userId}: User not found`, {
        userId,
      });

      return null;
    }

    return user as UserResponse;
  }

  /**
   * Create user
   * @param {{ name: string; bio: string; phone: string; email: string; password: string; }} user - used for create user
   * @return {Promise<{ message: string; }>} - returns message
   */
  public async createUser(user: { name: string; bio: string; phone: string; email: string; password: string; }): Promise<{ message: string; }> {
    const { id } = await this.UserRepository.createUser(user);

    if (!id) {
      Logger.warning('Failed to create user: User not created', {
        user,
      });

      return { message: 'Failed to create user' };
    }

    Logger.debug(`Successfully created user id=${id}`, { id });

    return { message: 'Successfully created user' };
  }
}
