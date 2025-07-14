import { Router } from 'express';
import { MediaFileController } from '../controllers/MediaFileController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

// Tüm işlemler için auth zorunlu
router.use(authenticateJWT);

// Sadece admin, owner ve user medya dosyası CRUD yapabilir
router.get('/', authorizeRoles('admin', 'owner', 'user'), MediaFileController.getAll);
router.get('/:id', authorizeRoles('admin', 'owner', 'user'), MediaFileController.getOne);
router.post('/', authorizeRoles('admin', 'owner', 'user'), MediaFileController.create);
router.put('/:id', authorizeRoles('admin', 'owner', 'user'), MediaFileController.update);
router.delete('/:id', authorizeRoles('admin', 'owner', 'user'), MediaFileController.delete);

export default router; 