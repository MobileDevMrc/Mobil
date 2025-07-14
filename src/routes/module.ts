import { Router } from 'express';
import { ModuleController } from '../controllers/ModuleController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

// Tüm işlemler için auth zorunlu
router.use(authenticateJWT);

// Sadece admin modül CRUD yapabilir
router.get('/', authorizeRoles('admin'), ModuleController.getAll);
router.get('/:id', authorizeRoles('admin'), ModuleController.getOne);
router.post('/', authorizeRoles('admin'), ModuleController.create);
router.put('/:id', authorizeRoles('admin'), ModuleController.update);
router.delete('/:id', authorizeRoles('admin'), ModuleController.delete);

export default router; 