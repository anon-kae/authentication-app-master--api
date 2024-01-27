import { IError, ErrorClass } from '@/interfaces/common//IError';
import { ISerializedError } from '@/interfaces/common/ISerializedError';

/**
 * CustomError
 */
export default class CustomError extends Error implements IError {
  private static errorTypes: Array<ErrorClass> = [];
  public static type: string = 'CustomError';
  public code: null | string = null;
  public type: string = 'CustomError';

  /**
   * Constructor
   * @param {ISerializedError} options
   */
  constructor({ code, type, message }: ISerializedError) {
    super(message);
    this.code = code;
    this.type = type;
  }

  /**
   * RegisterErrorType
   * @param {IError} ErrorType
   * @return {CustomError}
   */
  public static registerErrorType(
    ErrorType: ErrorClass,
  ): new (args: ISerializedError) => CustomError {
    if (this.errorTypes.includes(ErrorType)) return this;
    this.errorTypes.push(ErrorType);

    return this;
  }

  /**
   * FromJSON
   * @param {ISerializedError} options
   * @return {CustomError}
   */
  public static fromJSON({ type, message }: ISerializedError): CustomError {
    const [error] = this.errorTypes;
    const FoundErrorType =
      this.errorTypes.find((errorType) => errorType.type === type) ?? error;
    return new FoundErrorType(message);
  }

  /**
   * To Json
   * @return {ISerializedError}
   */
  public toJSON(): ISerializedError {
    return {
      code: this.code,
      type: this.type,
      message: this.message,
    };
  }
}
