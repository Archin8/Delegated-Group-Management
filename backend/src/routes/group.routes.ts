import { Router } from 'express';
import { GroupController } from '../controllers/group.controller';
import { RoleController } from '../controllers/role.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkPermission, checkGroupOwner } from '../middlewares/permission.middleware';
import { Permission } from '../types';

const router = Router();
const groupController = new GroupController();
const roleController = new RoleController();

// Group management routes
router.post('/', authenticate, groupController.createGroup.bind(groupController));
router.get('/:id', authenticate, groupController.getGroup.bind(groupController));
router.put('/:id', authenticate, checkPermission(Permission.MANAGE_GROUP), groupController.updateGroup.bind(groupController));
router.delete('/:id', authenticate, checkGroupOwner, groupController.deleteGroup.bind(groupController));

// Member management routes
router.post('/:groupId/members', authenticate, checkPermission(Permission.MANAGE_MEMBERS), groupController.addMember.bind(groupController));
router.delete('/:groupId/members/:userId', authenticate, checkPermission(Permission.MANAGE_MEMBERS), groupController.removeMember.bind(groupController));
router.put('/:groupId/members/:userId/role', authenticate, checkPermission(Permission.MANAGE_ROLES), groupController.updateMemberRole.bind(groupController));
router.get('/:groupId/members', authenticate, checkPermission(Permission.VIEW_GROUP_INFO), groupController.getGroupMembers.bind(groupController));

// Role management routes
router.get('/:groupId/roles', authenticate, checkPermission(Permission.VIEW_ROLES), roleController.getGroupRoles.bind(roleController));
router.post('/:groupId/roles', authenticate, checkPermission(Permission.MANAGE_ROLES), roleController.createRole.bind(roleController));
router.put('/:groupId/roles/:roleId', authenticate, checkPermission(Permission.MANAGE_ROLES), roleController.updateRole.bind(roleController));
router.delete('/:groupId/roles/:roleId', authenticate, checkPermission(Permission.MANAGE_ROLES), roleController.deleteRole.bind(roleController));

// Join request routes
router.get('/:groupId/join-requests', authenticate, groupController.getJoinRequests.bind(groupController));
router.post('/:groupId/join-requests', authenticate, groupController.createJoinRequest.bind(groupController));
router.put('/:groupId/join-requests/:requestId/approve', authenticate, checkPermission(Permission.APPROVE_REQUESTS), groupController.approveJoinRequest.bind(groupController));
router.put('/:groupId/join-requests/:requestId/reject', authenticate, checkPermission(Permission.APPROVE_REQUESTS), groupController.rejectJoinRequest.bind(groupController));

// User's groups
router.get('/user/groups', authenticate, groupController.getUserGroups.bind(groupController));

export default router; 