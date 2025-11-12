import { Router } from 'express';
import { getCompanyInfo, updateCompanyInfo, getCompanyStats } from '../controllers/company.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/roleCheck.middleware';

const router = Router();


router.use(authenticate);
router.get('/', getCompanyInfo);
router.get('/stats', getCompanyStats);
router.put('/', requireAdmin, updateCompanyInfo);

export default router;