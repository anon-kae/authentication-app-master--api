import passport from '@/configs/passport';

export const isAuthenticateWithJWT = passport.authenticate('jwt', {
  session: false,
  failWithError: true,
});
