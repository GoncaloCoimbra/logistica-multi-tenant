import { Router } from 'express';
import { listAuditLogs, getAuditStats, getAuditLogDetails } from '../controllers/auditlog.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/roleCheck.middleware';

const router = Router();

router.use(authenticate);
router.get('/', requireAdmin, listAuditLogs);
router.get('/stats', requireAdmin, getAuditStats);
router.get('/:id', requireAdmin, getAuditLogDetails);

export default router;