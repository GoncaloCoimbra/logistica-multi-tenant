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
router.patch('/:id/read', markAsRead);             
router.patch('/mark-all-read', markAllAsRead);      
router.delete('/all', clearAllNotifications);       

export default router;