import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware'; //  ADICIONAR ESTE IMPORT
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

router.use(authenticate);        // 1º: Valida o token e popula req.user
router.use(requireSuperAdmin);   // 2º: Verifica se req.user.role === 'SUPER_ADMIN'

// Rotas de Empresas
router.get('/companies', getAllCompanies);
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

// Rotas de Utilizadores
router.get('/users', getAllUsers);
router.get('/users/company/:companyId', getUsersByCompany);
router.post('/users', createUserForCompany);
router.put('/users/:id', updateUserGlobal);
router.delete('/users/:id', deleteUserGlobal);

// Estatísticas Globais
router.get('/stats', getGlobalStats);

export default router;