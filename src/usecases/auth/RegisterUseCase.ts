import * as joi from 'joi';
import UseCase from '@/abstracts/UseCase';
import { IUserService } from '@/interfaces/services/IUserService';
import ILoginUseCase, {
  RegisterRequest,
  RegisterResponse,
} from '@/interfaces/usecases/IRegisterUseCase';
import Logger from '@/helpers/Logger';
import { ValidationError } from '@/errors';

/**
 * RegisterUseCase
 */
class RegisterUseCase
  extends UseCase<RegisterRequest, RegisterResponse>
  implements ILoginUseCase {
  private readonly UserService: IUserService;

  /**
   * Constructor
   * @param {Object.<string, string>|null} services Services
   */
  constructor(services: { UserService: IUserService }) {
    super(services);
    this.UserService = services.UserService;
  }

  /**
   * Validate
   * @param {RegisterRequest} request Request
   * @return {Promise<RegisterRequest>} Validated request
   */
  async validate(request: RegisterRequest): Promise<RegisterRequest> {
    return this.runValidation(
      request,
      joi.object().keys({
        name: joi.string().required(),
        bio: joi.string().optional().allow('').required(),
        phone: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
      })
    );
  }
  /**
   * Execute
   * @param {RegisterRequest} request Request
   * @return {Promise<RegisterResponse>} Result
   */
  public async execute(request: RegisterRequest): Promise<RegisterResponse> {

    const { message } = await this.UserService.createUser(request);

    if (message === 'Failed to create user') {
      Logger.warning('Failed to create user', {
        ...request,
      });

      throw new ValidationError('Failed to create user');
    }

    Logger.info('Successfully created user', { ...request });

    return { message };
  }
}

export default RegisterUseCase;
