import { Router } from 'express';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/roleCheck.middleware';

const router = Router();


router.use(authenticate);

router.get('/', listUsers); 
router.post('/', requireAdmin, createUser); 
router.put('/:id', requireAdmin, updateUser); 
router.delete('/:id', requireAdmin, deleteUser); 

export default router;