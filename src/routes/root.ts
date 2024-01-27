import { Router } from 'express';
import * as rootController from '../controllers/RootController';

const router = Router();

router.get('/', rootController.getApiIdentity);

export default router;
