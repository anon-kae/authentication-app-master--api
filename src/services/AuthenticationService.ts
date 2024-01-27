import Logger from '@/helpers/Logger';
import * as bcrypt from 'bcryptjs';
import {
  IAuthenticationService, ITokenLifeTime,
} from '@/interfaces/services/IAuthenticationService';
import { UUID } from 'crypto';
import * as dayjs from '@/helpers/dayjs';
import * as jwt from 'jsonwebtoken';
import environment from '@/configs/environment';
import {
  DEFAULT_ACCESS_TOKEN_LIFETIME,
  DEFAULT_REFRESH_TOKEN_LIFETIME,
} from '@/helpers/constants';
import ms = require('ms');
import { IUserRepository } from '@/interfaces/repositories/IUserRepository';
import { UserResponse } from '@/interfaces/services/IUserService';
import Service from '@/abstracts/Service';

/**
 * AuthenticationService
 */
export default class AuthenticationService
  extends Service
  implements IAuthenticationService {
  private readonly UserRepository: IUserRepository;

  /**
   * Constructor
   * @param {Object.<string, string>|null} repositories Repositories
   */
  constructor({ UserRepository }: { UserRepository: new () => IUserRepository; }) {
    super();
    this.UserRepository = new UserRepository();
  }

  /**
   * Generate access token
   * @param {UUID} userId - The user ID
   * @param {string} application - The application
   * @param {string | number | undefined} expiresIn - The expires
   * @return {string} Access token
   */
  private generateAccessToken(
    userId: UUID,
    expiresIn: string | number | undefined
  ) {
    const token = jwt.sign(
      { id: userId, type: 'access', expiresIn },
      environment.JWT_SECRET,
      { expiresIn: DEFAULT_ACCESS_TOKEN_LIFETIME }
    );

    Logger.debug(
      `Successfully generated access token for user id=${userId} with expiresIn=${expiresIn}`,
      { userId, expiresIn }
    );

    return token;
  }

  /**
   * Refresh access token
   * @param {UUID} userId - The user ID
   * @param {string} application - The application
   * @param {string | number | undefined} expiresIn - The expires
   * @return {string} Access token
   */
  private generateRefreshToken(
    userId: UUID,
    expiresIn: string | number | undefined
  ) {
    const token = jwt.sign(
      { id: userId, type: 'refresh', expiresIn },
      environment.JWT_SECRET,
      { expiresIn: DEFAULT_REFRESH_TOKEN_LIFETIME }
    );

    Logger.debug(
      `Successfully generated refresh token for user id=${userId} with expiresIn=${expiresIn}`,
      { userId, expiresIn }
    );

    return token;
  }

  /**
   * Valid Password
   * @param {string} password - The user password
   * @param {string} hashPassword - The user hash password
   * @return {Boolean} The user
   * @private
   */
  private validPassword(password: string, hashPassword: string): Boolean {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
   * Check login is valid by email and password.
   * @param {String} email - The user email
   * @param {String} password - The password
   * @returns {Promise<UserResponse | null>} The user
   */
  async checkLogin(
    email: string,
    password: string
  ): Promise<UserResponse | null> {
    const user = await this.UserRepository.findUserByEmail(email);

    if (!user) {
      Logger.warning(`Failed to login by email=${email}, user not found`, {
        email,
      });

      return null;
    }

    const isValid = this.validPassword(password, user.password);

    if (!isValid) {
      Logger.warning(
        `Failed to login by email=${email}, invalid email or password`,
        {
          email,
        }
      );

      return null;
    }

    Logger.debug(`Successfully login by email=${email}`, { email });

    return user as UserResponse;
  }

  /**
   * Create auth token
   * @param {UUID} userId - The user ID
   * @param {ITokenLifeTime} tokenLifeTime - The token lifetime
   * @return {Promise<{accessToken: string, refreshToken: string}|null>} Auth token
   */
  public async createAuthToken(
    userId: UUID,
    { accessTokenExpiresIn = DEFAULT_ACCESS_TOKEN_LIFETIME, refreshTokenExpiresIn = DEFAULT_REFRESH_TOKEN_LIFETIME }: ITokenLifeTime
  ): Promise<{ accessToken: string; refreshToken: string; }> {
    // current time in epoch ms
    const currentTimestamp = dayjs.default();
    // get milliseconds from *ExpiresIn (always string, so ms return number), then add to current time
    const accessTokenExpires = currentTimestamp.add(
      ms(accessTokenExpiresIn.toString()),
      'ms'
    );
    const refreshTokenExpires = currentTimestamp.add(
      ms(refreshTokenExpiresIn.toString()),
      'ms'
    );

    // sign tokens
    const accessToken = this.generateAccessToken(userId, accessTokenExpires.unix());
    const refreshToken = this.generateRefreshToken(userId, refreshTokenExpires.unix());

    Logger.debug(
      `Successfully created new auth token for user id=${userId}, expires in ${accessTokenExpiresIn}/${refreshTokenExpiresIn}`,
      {
        userId,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
