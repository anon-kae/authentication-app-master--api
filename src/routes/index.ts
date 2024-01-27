import { Router } from 'express';
import rootRouter from './root';
import accountRouter from './account';
import authRouter from './auth';
import { isAuthenticateWithJWT } from '@/middlewares/authenticatePassport';

const router = Router();

router.use('/account', isAuthenticateWithJWT, accountRouter);

router.use(rootRouter);
router.use(accountRouter);
router.use(authRouter);

export default router;
