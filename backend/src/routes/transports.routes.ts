import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  listTransports,
  getTransport,
  createTransport,
  updateTransport,
  deleteTransport,
  addProductsToTransport
} from '../controllers/transports.controller';

const router = Router();


router.use(authenticate);
router.get('/', listTransports);
router.get('/:id', getTransport);
router.post('/', createTransport);
router.post('/:id/products', addProductsToTransport);
router.put('/:id', updateTransport);
router.delete('/:id', deleteTransport);

export default router;