import { Router } from 'express';
import { 
  listUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  reactivateUser  //  Nova função
} from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/roleCheck.middleware';

const router = Router();


router.use(authenticate);


router.get('/', listUsers);


router.post('/', requireAdmin, createUser);


router.put('/:id', requireAdmin, updateUser);

router.delete('/:id', requireAdmin, deleteUser);

router.patch('/:id/reactivate', requireAdmin, reactivateUser);

export default router;