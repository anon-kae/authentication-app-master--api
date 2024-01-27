import { IError } from '@/interfaces/common//IError';
import CustomError from '@/errors/CustomError';

/**
 * Permission Error
 */
class PermissionError extends CustomError implements IError {
  public static type: string = 'PERMISSION_ERROR';
  public name: string;

  /**
   * Constructor
   * @param {string} message
   */
  constructor(message: string) {
    super({ code: null, type: PermissionError.type, message });
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

CustomError.registerErrorType(PermissionError);
export default PermissionError;
