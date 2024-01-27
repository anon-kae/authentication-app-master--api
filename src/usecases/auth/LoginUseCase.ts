import * as joi from 'joi';
import UseCase from '@/abstracts/UseCase';
import { IAuthenticationService } from '@/interfaces/services/IAuthenticationService';
import ILoginUseCase, {
  LoginRequest,
  LoginResponse,
} from '@/interfaces/usecases/ILoginUseCase';
import Logger from '@/helpers/Logger';
import { AuthenticationError } from '@/errors';
import {
  DEFAULT_ACCESS_TOKEN_LIFETIME,
  DEFAULT_REFRESH_TOKEN_LIFETIME,
} from '@/helpers/constants';

/**
 * LoginUseCase
 */
class LoginUseCase
  extends UseCase<LoginRequest, LoginResponse>
  implements ILoginUseCase {
  private readonly AuthenticationService: IAuthenticationService;

  /**
   * Constructor
   * @param {Object.<string, string>|null} services Services
   */
  constructor(services: { AuthenticationService: IAuthenticationService }) {
    super(services);
    this.AuthenticationService = services.AuthenticationService;
  }

  /**
   * Validate
   * @param {LoginRequest} request Request
   * @return {Promise<LoginRequest>} Validated request
   */
  async validate(request: LoginRequest): Promise<LoginRequest> {
    return this.runValidation(
      request,
      joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),
      })
    );
  }
  /**
   * Execute
   * @param {LoginRequest} request Request
   * @return {Promise<LoginResponse>} Result
   */
  public async execute(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request;

    const user = await this.AuthenticationService.checkLogin(email, password);

    if (!user) {
      Logger.warning(`Failed to login by email=${email}, user not found`, {
        email,
      });

      throw new AuthenticationError('Invalid email or password.');
    }

    // then create a new one
    const { accessToken, refreshToken } =
      await this.AuthenticationService.createAuthToken(
        user.id,
        {
          accessTokenExpiresIn: DEFAULT_ACCESS_TOKEN_LIFETIME,
          refreshTokenExpiresIn: DEFAULT_REFRESH_TOKEN_LIFETIME,
        }
      );

    Logger.info(`Successfully login user id=${user.id}`, { userId: user.id, email });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export default LoginUseCase;
