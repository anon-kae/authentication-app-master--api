import { Router } from 'express';
import * as authController from '../controllers/AuthController';

const router = Router();

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

export default router;
