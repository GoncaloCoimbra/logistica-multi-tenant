import { Router } from 'express';
import { 
  listProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  changeProductStatus,
  getNextStates,
  getProductHistory
} from '../controllers/products.controller';
import { authenticate } from '../middlewares/auth.middleware';  // Atualize para 'authenticate'

const router = Router();

router.get('/', authenticate, listProducts);
router.get('/:id', authenticate, getProduct);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

 
router.post('/:id/change-status', authenticate, changeProductStatus);
router.get('/:id/next-states', authenticate, getNextStates);
router.get('/:id/history', authenticate, getProductHistory);

export default router;
