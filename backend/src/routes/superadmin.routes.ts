import { Router } from 'express';
import { requireSuperAdmin } from '../middlewares/superAdmin.middleware';
import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getAllUsers,
  getUsersByCompany,
  createUserForCompany,
  updateUserGlobal,
  deleteUserGlobal,
  getGlobalStats
} from '../controllers/superadmin.controller';

const router = Router();


router.use(requireSuperAdmin);


router.get('/companies', getAllCompanies);
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);


router.get('/users', getAllUsers);
router.get('/users/company/:companyId', getUsersByCompany);
router.post('/users', createUserForCompany);
router.put('/users/:id', updateUserGlobal);
router.delete('/users/:id', deleteUserGlobal);

router.get('/stats', getGlobalStats);

export default router;