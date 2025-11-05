import { Router } from 'express';
import { registerCompanyAndUser } from '../controllers/registration.controller';

const router = Router();

router.post('/register', registerCompanyAndUser);

export default router;