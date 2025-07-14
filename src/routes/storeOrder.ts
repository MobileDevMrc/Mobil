import { Router } from 'express';
import { StoreOrderController } from '../controllers/StoreOrderController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

// Tüm işlemler için auth zorunlu
router.use(authenticateJWT);

// Sadece admin ve owner sipariş CRUD yapabilir
router.get('/', authorizeRoles('admin', 'owner'), StoreOrderController.getAll);
router.get('/:id', authorizeRoles('admin', 'owner'), StoreOrderController.getOne);
router.post('/', authorizeRoles('admin', 'owner'), StoreOrderController.create);
router.put('/:id', authorizeRoles('admin', 'owner'), StoreOrderController.update);
router.delete('/:id', authorizeRoles('admin', 'owner'), StoreOrderController.delete);

export default router; 