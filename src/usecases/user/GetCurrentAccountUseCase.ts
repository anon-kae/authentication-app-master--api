import * as joi from 'joi';
import UseCase from '@/abstracts/UseCase';
import IGetCurrentAccountUseCase, {
  GetCurrentAccountRequest,
  GetCurrentAccountResponse,
} from '@/interfaces/usecases/IGetCurrentAccountUseCase';
import { IUserService } from '@/interfaces/services/IUserService';
import ValidationError from '@/errors/ValidationError';
import Logger from '@/helpers/Logger';

/**
 * GetCurrentAccountUseCase
 */
class GetCurrentAccountUseCase
  extends UseCase<GetCurrentAccountRequest, GetCurrentAccountResponse>
  implements IGetCurrentAccountUseCase {
  private readonly UserService: IUserService;

  /**
   * Constructor
   * @param {Object.<string, *>} services Services
   */
  constructor(services: { UserService: IUserService }) {
    super(services);
    this.UserService = services.UserService;
  }

  /**
   * Validate
   * @param {GetCurrentAccountRequest} request Request
   * @return {Promise<GetCurrentAccountRequest>} Validated request
   */
  async validate(
    request: GetCurrentAccountRequest,
  ): Promise<GetCurrentAccountRequest> {
    return this.runValidation(
      request,
      joi.object().keys({
        userId: joi.string().uuid().required(),
      }),
    );
  }

  /**
   * Execute
   * @param {GetCurrentAccountRequest} request Request
   * @return {Promise<GetCurrentAccountResponse>} Result
   */
  public async execute(
    request: GetCurrentAccountRequest,
  ): Promise<GetCurrentAccountResponse> {
    const { userId } = request;
    const user = await this.UserService.getUserInfoById(userId);

    if (!user) {
      Logger.warning(`Failed to find user by id=${userId}: User not found`, {
        userId,
      });

      throw new ValidationError('User not found');
    }

    Logger.info(`Successfully get user with roles for userId=${userId}`, {
      userId,
    });

    return user as GetCurrentAccountResponse;
  }
}

export default GetCurrentAccountUseCase;
