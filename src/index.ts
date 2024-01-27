/**
 * Setup Logger
 */
import Logger from '@/helpers/Logger';
import environment from '@/configs/environment';

/*
 * Setup application
 */
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';

import router from '@/routes';
import errorHandler from '@/middlewares/errorHandler';
import contextStorage from '@/configs/contextStorage';
import RequestIdGenerator from '@/helpers/RequestIdGenerator';
import morgan from '@/configs/morgan';

import functions = require('firebase-functions');
/**
 * Generate Express App
 * @return {Express} Express App
 */
function generateExpressApp() {
  const app = express();

  /**
   *  First, set HTTP context for logging
   */
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      contextStorage.runAndReturn(() => {
        contextStorage.set('requestId', RequestIdGenerator.generate());
        next();
      });
    },
  );

  /**
   * Then, log request info
   */
  app.use(morgan);

  /**
   * Then process body
   */
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(express.json());

  /**
   * Security Settings
   */
  const allowedOrigins = environment.CORS_WHITELIST_ORIGINS.split(',');
  app.use(
    cors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : true,
      credentials: true,
    }),
  );
  app.use(helmet.default());

  /**
   * Then process api
   */
  const API_BASE_PATH = environment.API_BASE_PATH || '';
  app.use(API_BASE_PATH, router);

  /**
   * Error handling
   */
  app.use(errorHandler);

  return app;
}

/**
 * Start Local Express Server
 * @return {Express} Express App
 */
function startLocalServer() {
  const app = generateExpressApp();
  const ENV = environment.NODE_ENV || 'development';
  const HOST = environment.HOST || '0.0.0.0';
  const PORT = environment.PORT ? Number(environment.PORT) : 9000;

  app.listen(PORT, HOST, () => {
    Logger.debug(
      `✅ App is running at http://${HOST}:${PORT}/ in ${ENV} mode`,
      { HOST, PORT, ENV },
    );
  });

  return app;
}

// const ExpressApp = startLocalServer();

// export { ExpressApp };

exports.authenticationAppMaster = functions.region('asia-southeast1').runWith({ memory: '256MB' }).https.onRequest(generateExpressApp());

