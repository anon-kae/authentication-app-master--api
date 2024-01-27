import * as joi from 'joi';
import { ValidationError } from '@/errors';

/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface IServices {
  [key: string]: any;
}

/**
 * Base UseCase class
 * @template T, U = T
 */
export default abstract class UseCase<T, U = T> {
  protected services: IServices;

  /**
   * Constructor
   * @param {Object.<string, *>} services Services
   */
  protected constructor(services: IServices) {
    this.services = services;
  }

  /**
   * Run Validation
   * @param {T} args Arguments
   * @param {joi.ObjectSchema<T>} schema Joi schema
   * @return {Promise<T>} Validated arguments
   */
  protected async runValidation(
    args: T,
    schema: joi.ObjectSchema<T>,
  ): Promise<T> {
    try {
      return await schema.validateAsync(args);
    } catch (error: any) {
      if (error instanceof joi.ValidationError) {
        throw new ValidationError(error.message);
      }

      throw error;
    }
  }

  /**
   * Get validators
   * @param {T} args Arguments
   * @return {Promise<*>} Validated arguments
   */
  async validate(args: T): Promise<T> {
    throw new Error('The validation should be implemented in all use cases');
  }

  /**
   * Execute useCase
   * @param {T} args
   */
  public abstract execute(...args: T[]): Promise<U>;
}
