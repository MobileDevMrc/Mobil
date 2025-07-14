import { Router } from 'express';
import { ActivityLogController } from '../controllers/ActivityLogController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

// Tüm işlemler için auth zorunlu
router.use(authenticateJWT);

// Sadece admin activity logları görebilir ve ekleyebilir
router.get('/', authorizeRoles('admin'), ActivityLogController.getAll);
router.get('/:id', authorizeRoles('admin'), ActivityLogController.getOne);
router.post('/', authorizeRoles('admin'), ActivityLogController.create);
router.delete('/:id', authorizeRoles('admin'), ActivityLogController.delete);

export default router; 