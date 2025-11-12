import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleStats
} from '../controllers/vehicles.controller';

const router = Router();

router.use(authenticate);
router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.get('/:id/stats', getVehicleStats);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;