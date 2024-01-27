import * as passport from 'passport';
import {
  ExtractJwt,
  Strategy as JWTStrategy,
  StrategyOptions,
  VerifiedCallback,
  VerifyCallback,
} from 'passport-jwt';
import environment from '@/configs/environment';
import contextStorage from '@/configs/contextStorage';
import Logger from '@/helpers/Logger';
import AuthenticationError from '@/errors/AuthenticationError';
import { UserService } from '@/services';
import { UUID } from 'crypto';

interface IJWTPayload {
  id: UUID;
  type: string;
}

const bearerTokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
const JWTStrategyOptions: StrategyOptions = {
  secretOrKey: environment.JWT_SECRET,
  jwtFromRequest: bearerTokenExtractor,
  passReqToCallback: false,
};

/**
 * Generates a JWT passport strategy callback for the given app
 * @return {VerifyCallback} JWT passport strategy callback
 */
function generateJwtCallbackForApp(): VerifyCallback {
  /**
   * This is a JWT passport strategy
   * @param {any} jwtPayload - JWT payload
   * @param {VerifiedCallback} done - Callback function to be called when authentication is complete
   * @return {Promise<void>} Promise that resolves when authentication is complete
   */
  async function jwtAuthCallback(
    jwtPayload: IJWTPayload,
    done: VerifiedCallback
  ): Promise<void> {
    try {
      const { id, type } = jwtPayload;

      if (type !== 'access') {
        Logger.warning(
          `Failed to authenticate user with JWT: invalid token type ${type}`,
          { id, type }
        );
        return done(null, false);
      }

      // If the user does not exist, this will throw an error
      const user = await UserService.getUserInfoById(id);

      if (!user) {
        Logger.warning(
          `Failed to authenticate user with JWT: user not found id=${id}`,
          { id, type }
        );

        return done(null, false);
      }

      Logger.info(`Successfully authenticated user id=${user.id} with JWT`, {
        userId: user.id,
      });

      contextStorage.set('userId', user.id);
      done(null, user, { id, type });

    } catch (error: Error | unknown) {

      if (error instanceof Error) {
        Logger.error(`Failed to authenticate user with JWT: ${error.stack}`, {
          stack: error.stack,
        });
      }

      done(new AuthenticationError('Unauthenticated'));
    }
  }

  return jwtAuthCallback;
}

passport.use(
  'jwt',
  new JWTStrategy(JWTStrategyOptions, generateJwtCallbackForApp())
);

export default passport;
