import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { 
  getNotifications, 
  getAlertStats,
  markAsRead,
  markAllAsRead,
  clearAllNotifications
} from '../controllers/notifications.controller';

const router = Router();

router.use(authenticate);
router.get('/', getNotifications);
router.get('/stats', getAlertStats);
router.patch('/:id/read', markAsRead);              // Marcar uma como lida
router.patch('/mark-all-read', markAllAsRead);      // Marcar todas como lidas
router.delete('/all', clearAllNotifications);       // Limpar todas

export default router;