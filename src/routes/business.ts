import { Router } from 'express';
import { BusinessController } from '../controllers/BusinessController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

// Tüm işlemler için auth zorunlu
router.use(authenticateJWT);

// Sadece admin ve owner işletme CRUD yapabilir
router.get('/', authorizeRoles('admin', 'owner'), BusinessController.getAll);
router.get('/:id', authorizeRoles('admin', 'owner'), BusinessController.getOne);
router.post('/', authorizeRoles('admin', 'owner'), BusinessController.create);
router.put('/:id', authorizeRoles('admin', 'owner'), BusinessController.update);
router.delete('/:id', authorizeRoles('admin', 'owner'), BusinessController.delete);

export default router; 