import { Router } from 'express';
import * as userController from '@/controllers/AccountController';
const router = Router();

router.get('/account', userController.getCurrentAccount);

export default router;
