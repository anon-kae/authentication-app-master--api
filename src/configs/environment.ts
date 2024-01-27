import * as joi from 'joi';
import * as path from 'path';
import * as dotenv from 'dotenv';

const pathToProjectRoot = __filename.endsWith('.js') ? '../../..' : '../..';

dotenv.config({
  path: path.resolve(__dirname, pathToProjectRoot, '.env'),
});
dotenv.config({
  path: path.resolve(__dirname, pathToProjectRoot, 'database.env'),
});

const schema = joi
  .object()
  .unknown()
  .keys({
    NODE_ENV: joi
      .string()
      .valid('development', 'staging', 'production', 'test')
      .default('development')
      .optional(),

    // Express.js Server
    HOST: joi.string().default('0.0.0.0').optional(),
    PORT: joi.number().default(80).optional(),
    API_BASE_PATH: joi.string().default('/').optional(),
    CORS_WHITELIST_ORIGINS: joi.string().allow('').default('').optional(),
    JWT_SECRET: joi.string().required(),

    // Logging
    LOG_LEVEL: joi
      .string()
      .valid('debug', 'info', 'warn', 'error')
      .default('debug')
      .optional(),
    LOG_STACKDRIVER_CREDENTIALS: joi.string().default('').optional(),
  });

const { error, value } = schema.validate(process.env);

if (error) {
  console.error(error.stack);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

export default value;
