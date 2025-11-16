import { Router } from 'express';
import { 
  login, 
  register, 
  me, 
  updateProfile, 
  changePassword, 
  uploadAvatar as uploadAvatarController,
  removeAvatar
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadAvatar } from '../middlewares/upload.middleware';

const router = Router();

// Rotas públicas
router.post('/login', login);
router.post('/register', register);

// Rotas protegidas (requerem autenticação)
router.get('/me', authenticate, me);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/avatar', authenticate, uploadAvatar, uploadAvatarController);
router.delete('/avatar', authenticate, removeAvatar);

export default router;