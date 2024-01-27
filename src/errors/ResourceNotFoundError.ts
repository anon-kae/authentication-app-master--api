import { IError } from '@/interfaces/common/IError';
import CustomError from '@/errors/CustomError';

/**
 * ResourceNotFound Error
 */
class ResourceNotFoundError extends CustomError implements IError {
  public static type: string = 'RESOURCE_NOT_FOUND_ERROR';
  public name: string;

  /**
   * Constructor
   * @param {string} message
   */
  constructor(message: string) {
    super({ code: null, type: ResourceNotFoundError.type, message });
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

CustomError.registerErrorType(ResourceNotFoundError);
export default ResourceNotFoundError;
