import { Router } from 'express';
import { IncomeExpenseController } from '../controllers/IncomeExpenseController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

// Tüm işlemler için auth zorunlu
router.use(authenticateJWT);

// Sadece admin, owner ve user gelir/gider CRUD yapabilir
router.get('/', authorizeRoles('admin', 'owner', 'user'), IncomeExpenseController.getAll);
router.get('/:id', authorizeRoles('admin', 'owner', 'user'), IncomeExpenseController.getOne);
router.post('/', authorizeRoles('admin', 'owner', 'user'), IncomeExpenseController.create);
router.put('/:id', authorizeRoles('admin', 'owner', 'user'), IncomeExpenseController.update);
router.delete('/:id', authorizeRoles('admin', 'owner', 'user'), IncomeExpenseController.delete);

export default router; 