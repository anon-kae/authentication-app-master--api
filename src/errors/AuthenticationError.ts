import { IError } from '@/interfaces/common/IError';
import CustomError from '@/errors/CustomError';

/**
 * Authentication Error
 */
class AuthenticationError extends CustomError implements IError {
  public static type: string = 'AUTHENTICATION_ERROR';
  public name: string;

  /**
   * Constructor
   * @param {string} message
   */
  constructor(message: string) {
    super({ code: null, type: AuthenticationError.type, message });
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

CustomError.registerErrorType(AuthenticationError);
export default AuthenticationError;
