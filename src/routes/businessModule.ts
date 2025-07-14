import { Router } from 'express';
import { BusinessModuleController } from '../controllers/BusinessModuleController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

// Tüm işlemler için auth zorunlu
router.use(authenticateJWT);

// Sadece admin ve owner işletme-modül eşleştirmesi yapabilir
router.get('/', authorizeRoles('admin', 'owner'), BusinessModuleController.getAll);
router.get('/:id', authorizeRoles('admin', 'owner'), BusinessModuleController.getOne);
router.post('/', authorizeRoles('admin', 'owner'), BusinessModuleController.create);
router.delete('/:id', authorizeRoles('admin', 'owner'), BusinessModuleController.delete);

export default router; 