import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const roleController = new RoleController();

// Role management routes
router.post('/', authenticate, roleController.createRole.bind(roleController));
router.get('/:id', authenticate, roleController.getRole.bind(roleController));
router.put('/:id', authenticate, roleController.updateRole.bind(roleController));
router.delete('/:id', authenticate, roleController.deleteRole.bind(roleController));

// Group roles
router.get('/group/:groupId', authenticate, roleController.getGroupRoles.bind(roleController));

// Role permissions and priority
router.put('/:id/permissions', authenticate, roleController.updateRolePermissions.bind(roleController));
router.put('/:id/priority', authenticate, roleController.updateRolePriority.bind(roleController));

export default router; 