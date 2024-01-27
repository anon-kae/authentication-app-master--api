import * as joi from 'joi';
import Logger from '@/helpers/Logger';
import UseCase from '@/abstracts/UseCase';
import IGetApiIdentityUseCase, {
  GetApiIdentityRequest,
  GetApiIdentityResponse,
} from '@/interfaces/usecases/IGetApiIdentityUseCase';

/**
 * Get API Identity UseCase
 */
class GetApiIdentityUseCase
  extends UseCase<GetApiIdentityRequest, GetApiIdentityResponse>
  implements IGetApiIdentityUseCase {

  /**
   * Constructor
   * @param {Object.<string, string>|null} services Services
   */
  constructor(services: { [key: string]: any }) {
    super(services);
  }

  /**
   * Validate
   * @param {GetApiIdentityRequest} request Request
   * @return {Promise<Object.<string, *>|null>} Validated arguments
   */
  async validate(
    request: GetApiIdentityRequest,
  ): Promise<GetApiIdentityRequest> {
    return this.runValidation(request, joi.object());
  }

  /**
   * Execute
   * @param {GetApiIdentityRequest} request Request
   * @return {Promise<Object.<string, string>|null>} Result
   */
  public async execute(
    request: GetApiIdentityRequest,
  ): Promise<GetApiIdentityResponse> {
    const message = 'Authentication App Master API';

    Logger.info(`Successfully get API identity: ${message}`, {
      message,
      request,
    });

    return { message };
  }
}

export default GetApiIdentityUseCase;
